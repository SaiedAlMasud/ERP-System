import saleService from "./sale.service.js";
import {
  createSaleSchema,
} from "./sale.validation.js";

export const createSale = async (
  req,
  res
) => {
  const validatedData =
    createSaleSchema.parse(
      req.body
    );

  const sale =
    await saleService.createSale(
      validatedData,
      req.user.id
    );

  res.status(201).json({
    success: true,
    message:
      "Sale created successfully.",
    data: sale,
  });
};

export const getSales = async (
  req,
  res
) => {
  const page = Math.max(
    Number(req.query.page) || 1,
    1
  );

  const limit = Math.min(
    Math.max(
      Number(req.query.limit) || 10,
      1
    ),
    100
  );

  const result =
    await saleService.getSales({
      page,
      limit,
      search:
        req.query.search || "",
      status:
        req.query.status || "",
      paymentStatus:
        req.query.paymentStatus || "",
    });

  res.status(200).json({
    success: true,
    message:
      "Sales fetched successfully.",
    data: result,
  });
};

export const getSaleById = async (
  req,
  res
) => {
  const sale =
    await saleService.getSaleById(
      req.params.id
    );

  res.status(200).json({
    success: true,
    message:
      "Sale fetched successfully.",
    data: sale,
  });
};