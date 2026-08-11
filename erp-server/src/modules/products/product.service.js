import Product from "./product.model.js";

class ProductService {
  async createProduct(data, userId) {
    const existingProduct =
      await Product.findOne({
        productCode: data.productCode,
      });

    if (existingProduct) {
      const error = new Error(
        "Product code already exists."
      );

      error.statusCode = 409;

      throw error;
    }

    const product = await Product.create({
      ...data,
      createdBy: userId,
    });

    return product;
  }

  async getProducts(query = {}) {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      category = "",
    } = query;

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const perPage = Math.min(
      Math.max(Number(limit) || 10, 1),
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
          productCode: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          brand: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    const skip =
      (currentPage - 1) * perPage;

    const [
      products,
      total,
    ] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .lean(),

      Product.countDocuments(filter),
    ]);

    const totalPages =
      Math.ceil(total / perPage);

    return {
      products,

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

  async getProductById(id) {
    const product =
      await Product.findById(id);

    if (!product) {
      const error = new Error(
        "Product not found."
      );

      error.statusCode = 404;

      throw error;
    }

    return product;
  }

  async updateProduct(
    id,
    data,
    userId
  ) {
    const product =
      await Product.findById(id);

    if (!product) {
      const error = new Error(
        "Product not found."
      );

      error.statusCode = 404;

      throw error;
    }

    if (
      data.productCode &&
      data.productCode !== product.productCode
    ) {
      const existingProduct =
        await Product.findOne({
          productCode: data.productCode,
          _id: { $ne: id },
        });

      if (existingProduct) {
        const error = new Error(
          "Product code already exists."
        );

        error.statusCode = 409;

        throw error;
      }
    }

    Object.assign(product, data);

    product.updatedBy = userId;

    await product.save();

    return product;
  }

  async deleteProduct(id) {
    const product =
      await Product.findById(id);

    if (!product) {
      const error = new Error(
        "Product not found."
      );

      error.statusCode = 404;

      throw error;
    }

    await product.deleteOne();

    return product;
  }
}

const productService =
  new ProductService();

export default productService;