
const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Helper: Get cart with populated product details
const getPopulatedCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId })
    .populate("items.product");

  if (!cart) {
    return {
      items: [],
      totalPrice: 0
    };
  }

  const validItems = cart.items.filter(
    (item) => item.product !== null
  );

  const totalPrice = validItems.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  return {
    _id: cart._id,
    items: validItems,
    totalPrice
  };
};

// GET CART
const getCart = async (req, res) => {
  try {
    const cart = await getPopulatedCart(req.user._id);

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch cart.",
      error: error.message
    });
  }
};

// ADD PRODUCT TO CART
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size = "" } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Valid product ID is required."
      });
    }

    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1."
      });
    }

    const product = await Product.findById(productId);

    if (!product || !product.isAvailable) {
      return res.status(404).json({
        success: false,
        message: "Product is unavailable."
      });
    }

    if (product.sizes?.length > 0 && !product.sizes.includes(size)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid product size."
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: []
      });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === size
    );

    const newQuantity = existingItem
      ? existingItem.quantity + Number(quantity)
      : Number(quantity);

    if (newQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} units are available.`
      });
    }

    if (existingItem) {
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        size
      });
    }

    await cart.save();

    const updatedCart = await getPopulatedCart(req.user._id);

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully.",
      cart: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to add product to cart.",
      error: error.message
    });
  }
};

// UPDATE CART ITEM QUANTITY
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, size = "" } = req.body;

    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1."
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found."
      });
    }

    const item = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === size
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found."
      });
    }

    const product = await Product.findById(productId);

    if (!product || !product.isAvailable) {
      return res.status(404).json({
        success: false,
        message: "Product is unavailable."
      });
    }

    if (Number(quantity) > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} units are available.`
      });
    }

    item.quantity = Number(quantity);

    await cart.save();

    const updatedCart = await getPopulatedCart(req.user._id);

    res.status(200).json({
      success: true,
      message: "Cart quantity updated.",
      cart: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update cart.",
      error: error.message
    });
  }
};

// REMOVE PRODUCT FROM CART
const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const size = req.query.size ?? req.body?.size ?? "";

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found."
      });
    }

    const initialLength = cart.items.length;

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          item.size === size
        )
    );

    if (cart.items.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found."
      });
    }

    await cart.save();

    const updatedCart = await getPopulatedCart(req.user._id);

    res.status(200).json({
      success: true,
      message: "Product removed from cart.",
      cart: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to remove product.",
      error: error.message
    });
  }
};

// CLEAR CART
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [] } }
    );

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to clear cart.",
      error: error.message
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
