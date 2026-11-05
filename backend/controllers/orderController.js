
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ================================
// PLACE ORDER / CHECKOUT
// ================================
const placeOrder = async (req, res) => {
  let createdOrder = null;
  const reducedStock = [];

  try {
    const { shippingAddress, paymentMethod = "COD" } = req.body;

    // Validate delivery address
    const requiredFields = [
      "fullName",
      "phone",
      "address",
      "city",
      "state",
      "postalCode"
    ];

    if (
      !shippingAddress ||
      requiredFields.some(
        (field) =>
          typeof shippingAddress[field] !== "string" ||
          !shippingAddress[field].trim()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide complete delivery details"
      });
    }

    if (paymentMethod !== "COD") {
      return res.status(400).json({
        success: false,
        message: "Only Cash on Delivery is currently supported"
      });
    }

    // Find user's cart
    const cart = await Cart.findOne({
      user: req.user._id
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your shopping cart is empty"
      });
    }

    let totalPrice = 0;
    const orderItems = [];

    // Validate products and calculate total
    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "A product in your cart no longer exists"
        });
      }

      if (!product.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is unavailable`
        });
      }

      if (item.quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      // Validate selected size
      if (
        product.sizes?.length > 0 &&
        !product.sizes.includes(item.size)
      ) {
        return res.status(400).json({
          success: false,
          message: `Please select a valid size for ${product.name}`
        });
      }

      totalPrice += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
        size: item.size || ""
      });
    }

    // Create order
    createdOrder = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice
    });

    // Reduce product stock
    for (const item of cart.items) {
      const result = await Product.updateOne(
        {
          _id: item.product._id,
          stock: { $gte: item.quantity },
          isAvailable: true
        },
        {
          $inc: { stock: -item.quantity }
        }
      );

      if (result.modifiedCount !== 1) {
        throw new Error(
          `Stock changed during checkout for ${item.product.name}`
        );
      }

      // Remember successfully reduced stock for rollback
      reducedStock.push({
        productId: item.product._id,
        quantity: item.quantity
      });
    }

    // Clear cart after successful order
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: createdOrder
    });

  } catch (error) {
    console.error("Place Order Error:", error);

    // Restore stock if checkout fails
    for (const item of reducedStock) {
      try {
        await Product.findByIdAndUpdate(
          item.productId,
          {
            $inc: { stock: item.quantity }
          }
        );
      } catch (rollbackError) {
        console.error(
          "Stock restoration failed:",
          rollbackError.message
        );
      }
    }

    // Delete incomplete order
    if (createdOrder) {
      try {
        await Order.findByIdAndDelete(createdOrder._id);
      } catch (deleteError) {
        console.error(
          "Order cleanup failed:",
          deleteError.message
        );
      }
    }

    res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message
    });
  }
};

// ================================
// GET USER ORDERS
// ================================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch your orders",
      error: error.message
    });
  }
};

// ================================
// GET SINGLE ORDER
// ================================
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Users can only view their own orders.
    // Admins can view any order.
    if (
      req.user.role !== "admin" &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this order"
      });
    }

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid order ID"
    });
  }
};

// ================================
// GET ALL ORDERS (ADMIN)
// ================================
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};

// ================================
// UPDATE ORDER STATUS (ADMIN)
// ================================
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled"
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (
      order.orderStatus === "Cancelled" ||
      order.orderStatus === "Delivered"
    ) {
      return res.status(400).json({
        success: false,
        message: "This order can no longer be updated"
      });
    }

    // Restore stock when an order is cancelled
    if (orderStatus === "Cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          {
            $inc: { stock: item.quantity }
          }
        );
      }
    }

    order.orderStatus = orderStatus;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order
    });

  } catch (error) {
    console.error("Update Order Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message
    });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};
