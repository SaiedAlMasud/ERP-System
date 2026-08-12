import mongoose from "mongoose";

import Sale from "./sale.model.js";
import Product from "../products/product.model.js";

class SaleService {
  async createSale(payload, userId) {
    const session =
      await mongoose.startSession();

    session.startTransaction();

    try {
      const productIds =
        payload.items.map(
          (item) => item.product
        );

      const products =
        await Product.find({
          _id: {
            $in: productIds,
          },
        }).session(session);

      if (
        products.length !==
        productIds.length
      ) {
        throw new Error(
          "One or more products were not found."
        );
      }

      const productMap = new Map(
        products.map((product) => [
          product._id.toString(),
          product,
        ])
      );

      const saleItems = [];

      let subtotal = 0;

      for (const item of payload.items) {
        const product =
          productMap.get(
            item.product.toString()
          );

        if (!product) {
          throw new Error(
            `Product not found: ${item.product}`
          );
        }

        if (
          product.status !== "active"
        ) {
          throw new Error(
            `${product.name} is inactive.`
          );
        }

        if (
          product.stockQuantity <
          item.quantity
        ) {
          throw new Error(
            `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}.`
          );
        }

        const itemSubtotal =
          item.quantity *
          item.unitPrice;

        subtotal += itemSubtotal;

        saleItems.push({
          product: product._id,
          productName: product.name,
          productCode:
            product.productCode,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: itemSubtotal,
        });
      }

      const discount =
        payload.discount || 0;

      const tax = payload.tax || 0;

      const totalAmount =
        subtotal -
        discount +
        tax;

      if (totalAmount < 0) {
        throw new Error(
          "Total amount cannot be negative."
        );
      }

      // Deduct inventory
      for (const item of payload.items) {
        const updatedProduct =
          await Product.findOneAndUpdate(
            {
              _id: item.product,
              stockQuantity: {
                $gte: item.quantity,
              },
            },
            {
              $inc: {
                stockQuantity:
                  -item.quantity,
              },
            },
            {
              new: true,
              session,
            }
          );

        if (!updatedProduct) {
          throw new Error(
            "Stock changed while processing the sale. Please try again."
          );
        }
      }

      const [sale] =
        await Sale.create(
          [
            {
              invoiceNumber:
                payload.invoiceNumber,

              customer:
                payload.customer || null,

              items: saleItems,

              subtotal,

              discount,

              tax,

              totalAmount,

              paymentMethod:
                payload.paymentMethod,

              paymentStatus:
                payload.paymentStatus,

              status: payload.status,

              saleDate:
                payload.saleDate
                  ? new Date(
                      payload.saleDate
                    )
                  : new Date(),

              notes:
                payload.notes || "",

              createdBy: userId,
            },
          ],
          {
            session,
          }
        );

      await session.commitTransaction();

      return sale;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async getSales({
    page = 1,
    limit = 10,
    search = "",
    status,
    paymentStatus,
  }) {
    const skip =
      (page - 1) * limit;

    const query = {};

    if (search) {
      query.$or = [
        {
          invoiceNumber: {
            $regex: search,
            $options: "i",
          },
        },
        {
          "items.productName": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (status) {
      query.status = status;
    }

    if (paymentStatus) {
      query.paymentStatus =
        paymentStatus;
    }

    const [
      sales,
      total,
    ] = await Promise.all([
      Sale.find(query)
        .populate(
          "customer",
          "name phone"
        )
        .populate(
          "createdBy",
          "name email"
        )
        .sort({
          saleDate: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Sale.countDocuments(query),
    ]);

    return {
      sales,
      pagination: {
        page,
        limit,
        total,
        totalPages:
          Math.ceil(total / limit),

        hasNextPage:
          page <
          Math.ceil(total / limit),

        hasPreviousPage:
          page > 1,
      },
    };
  }

  async getSaleById(id) {
    const sale =
      await Sale.findById(id)
        .populate(
          "customer",
          "name phone"
        )
        .populate(
          "createdBy",
          "name email"
        )
        .lean();

    if (!sale) {
      throw new Error(
        "Sale not found."
      );
    }

    return sale;
  }
}

const saleService =
  new SaleService();

export default saleService;