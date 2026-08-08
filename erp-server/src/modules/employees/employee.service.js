import mongoose from "mongoose";
import Employee from "./employee.model.js";

class EmployeeService {
    // ===========================
    // Create Employee
    // ===========================

    async createEmployee(data, userId) {
        const existingEmployee = await Employee.findOne({
            $or: [
                { employeeCode: data.employeeCode },
                { email: data.email },
            ],
        });

        if (existingEmployee) {
            if (
                existingEmployee.employeeCode ===
                data.employeeCode
            ) {
                const error = new Error(
                    "Employee code already exists."
                );
                error.statusCode = 409;
                throw error;
            }

            if (
                existingEmployee.email === data.email
            ) {
                const error = new Error(
                    "Employee email already exists."
                );
                error.statusCode = 409;
                throw error;
            }
        }

        const employee = await Employee.create({
            ...data,
            createdBy: userId,
            updatedBy: userId,
        });

        return employee;
    }

    // ===========================
    // Get Employees
    // ===========================

    async getEmployees(query) {
        const {
            page,
            limit,
            search,
            status,
            employmentType,
            department,
            sortBy,
            sortOrder,
        } = query;

        const filter = {};

        // Search
        if (search) {
            filter.$or = [
                {
                    firstName: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    lastName: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    employeeCode: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    phone: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        // Status filter
        if (status) {
            filter.status = status;
        }

        // Employment type filter
        if (employmentType) {
            filter.employmentType = employmentType;
        }

        // Department filter
        if (department) {
            if (mongoose.Types.ObjectId.isValid(department)) {
                filter.department = department;
            }
        }

        const skip = (page - 1) * limit;

        const sortDirection =
            sortOrder === "asc" ? 1 : -1;

        const sort = {
            [sortBy]: sortDirection,
        };

        const [
            employees,
            total,
        ] = await Promise.all([
            Employee.find(filter)
                .populate(
                    "createdBy",
                    "firstName lastName email"
                )
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),

            Employee.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(
            total / limit
        );

        return {
            employees,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        };
    }

    // ===========================
    // Get Employee By ID
    // ===========================

    async getEmployeeById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error(
                "Invalid employee ID."
            );

            error.statusCode = 400;

            throw error;
        }

        const employee = await Employee.findById(id)
            .populate(
                "createdBy",
                "firstName lastName email"
            )
            .populate(
                "updatedBy",
                "firstName lastName email"
            );

        if (!employee) {
            const error = new Error(
                "Employee not found."
            );

            error.statusCode = 404;

            throw error;
        }

        return employee;
    }

    // ===========================
    // Update Employee
    // ===========================

    async updateEmployee(
        id,
        data,
        userId
    ) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error(
                "Invalid employee ID."
            );

            error.statusCode = 400;

            throw error;
        }

        const employee =
            await Employee.findById(id);

        if (!employee) {
            const error = new Error(
                "Employee not found."
            );

            error.statusCode = 404;

            throw error;
        }

        // Check duplicate email
        if (data.email) {
            const existingEmail =
                await Employee.findOne({
                    email: data.email,
                    _id: { $ne: id },
                });

            if (existingEmail) {
                const error = new Error(
                    "Employee email already exists."
                );

                error.statusCode = 409;

                throw error;
            }
        }

        // Check duplicate employee code
        if (data.employeeCode) {
            const existingCode =
                await Employee.findOne({
                    employeeCode:
                        data.employeeCode,
                    _id: { $ne: id },
                });

            if (existingCode) {
                const error = new Error(
                    "Employee code already exists."
                );

                error.statusCode = 409;

                throw error;
            }
        }

        Object.assign(employee, data);

        employee.updatedBy = userId;

        await employee.save();

        return employee;
    }

    // ===========================
    // Delete Employee
    // ===========================

    async deleteEmployee(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error(
                "Invalid employee ID."
            );

            error.statusCode = 400;

            throw error;
        }

        const employee =
            await Employee.findById(id);

        if (!employee) {
            const error = new Error(
                "Employee not found."
            );

            error.statusCode = 404;

            throw error;
        }

        await Employee.findByIdAndDelete(id);

        return employee;
    }
}

const employeeService =
    new EmployeeService();

export default employeeService;