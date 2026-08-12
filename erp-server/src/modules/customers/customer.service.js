import Customer from "./customer.model.js";

class CustomerService {
    async createCustomer(data, userId) {
        let customerCode =
            data.customerCode;

        if (!customerCode) {
            const lastCustomer =
                await Customer.findOne()
                    .sort({ createdAt: -1 })
                    .select("customerCode")
                    .lean();

            let nextNumber = 1;

            if (lastCustomer?.customerCode) {
                const match =
                    lastCustomer.customerCode.match(
                        /^CUS-(\d+)$/
                    );

                if (match) {
                    nextNumber =
                        Number(match[1]) + 1;
                }
            }

            customerCode =
                `CUS-${String(nextNumber).padStart(6, "0")}`;
        }

        const existingCustomer =
            await Customer.findOne({
                customerCode,
            });

        if (existingCustomer) {
            const error = new Error(
                "Customer code already exists."
            );

            error.statusCode = 409;

            throw error;
        }

        const customer =
            await Customer.create({
                ...data,
                customerCode,
                createdBy: userId,
            });

        return customer;
    }

    async getCustomers(query = {}) {
        const {
            page = 1,
            limit = 10,
            search = "",
            status = "",
        } = query;

        const currentPage = Math.max(
            Number(page) || 1,
            1
        );

        const perPage = Math.min(
            Math.max(
                Number(limit) || 10,
                1
            ),
            100
        );

        const filter = {};

        if (search.trim()) {
            filter.$or = [
                {
                    name: {
                        $regex: search.trim(),
                        $options: "i",
                    },
                },
                {
                    customerCode: {
                        $regex: search.trim(),
                        $options: "i",
                    },
                },
                {
                    phone: {
                        $regex: search.trim(),
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: search.trim(),
                        $options: "i",
                    },
                },
            ];
        }

        if (status) {
            filter.status = status;
        }

        const skip =
            (currentPage - 1) *
            perPage;

        const [
            customers,
            total,
        ] = await Promise.all([
            Customer.find(filter)
                .sort({
                    createdAt: -1,
                })
                .skip(skip)
                .limit(perPage)
                .lean(),

            Customer.countDocuments(filter),
        ]);

        const totalPages =
            Math.ceil(total / perPage);

        return {
            customers,

            pagination: {
                page: currentPage,
                limit: perPage,
                total,
                totalPages,

                hasNextPage:
                    currentPage < totalPages,

                hasPreviousPage:
                    currentPage > 1,
            },
        };
    }

    async getCustomerById(id) {
        const customer =
            await Customer.findById(id)
                .populate(
                    "createdBy",
                    "name email"
                )
                .populate(
                    "updatedBy",
                    "name email"
                )
                .lean();

        if (!customer) {
            const error = new Error(
                "Customer not found."
            );

            error.statusCode = 404;

            throw error;
        }

        return customer;
    }

    async updateCustomer(
        id,
        data,
        userId
    ) {
        const customer =
            await Customer.findById(id);

        if (!customer) {
            const error = new Error(
                "Customer not found."
            );

            error.statusCode = 404;

            throw error;
        }

        if (
            data.customerCode &&
            data.customerCode !==
            customer.customerCode
        ) {
            const existingCustomer =
                await Customer.findOne({
                    customerCode:
                        data.customerCode,
                    _id: {
                        $ne: id,
                    },
                });

            if (existingCustomer) {
                const error = new Error(
                    "Customer code already exists."
                );

                error.statusCode = 409;

                throw error;
            }
        }

        Object.assign(
            customer,
            data
        );

        customer.updatedBy =
            userId;

        await customer.save();

        return customer;
    }

    async deleteCustomer(id) {
        const customer =
            await Customer.findById(id);

        if (!customer) {
            const error = new Error(
                "Customer not found."
            );

            error.statusCode = 404;

            throw error;
        }

        await customer.deleteOne();

        return customer;
    }
}

const customerService =
    new CustomerService();

export default customerService;