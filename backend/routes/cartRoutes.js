
const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

// All cart routes require authentication
router.use(protect);

// Get user's cart
router.get("/", getCart);

// Add product to cart
router.post("/add", addToCart);

// Update product quantity
router.put("/update/:productId", updateCartItem);

// Remove product from cart
router.delete("/remove/:productId", removeCartItem);

// Clear entire cart
router.delete("/clear", clearCart);

module.exports = router;
