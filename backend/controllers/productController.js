
const Product = require("../models/Product");

// ================================
// GET ALL PRODUCTS
// ================================
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i"
      };
    }

    const products = await Product.find(filter).sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message
    });
  }
};

// ================================
// GET SINGLE PRODUCT
// ================================
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      product
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID"
    });
  }
};

// ================================
// ADD PRODUCT (ADMIN)
// ================================
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      brand,
      sizes,
      stock
    } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      !image ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required product fields"
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      brand,
      sizes,
      stock,
      isAvailable: Number(stock) > 0
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to add product",
      error: error.message
    });
  }
};

// ================================
// UPDATE PRODUCT (ADMIN)
// ================================
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        isAvailable:
          req.body.stock !== undefined
            ? Number(req.body.stock) > 0
            : undefined
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update product",
      error: error.message
    });
  }
};

// ================================
// DELETE PRODUCT (ADMIN)
// ================================
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete product",
      error: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
