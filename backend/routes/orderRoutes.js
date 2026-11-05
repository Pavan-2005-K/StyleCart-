
const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/orderController");

const {
  protect,
  adminOnly
} = require("../middleware/authMiddleware");

// User routes
router.post("/", protect, placeOrder);
router.get("/my-orders", protect, getMyOrders);

// Admin routes
router.get("/admin/all", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

// Single order details
router.get("/:id", protect, getOrderById);

module.exports = router;
