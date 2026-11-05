
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Men",
        "Women",
        "Footwear",
        "Accessories"
      ]
    },

    image: {
      type: String,
      required: true
    },

    brand: {
      type: String,
      default: "StyleCart"
    },

    sizes: {
      type: [String],
      default: []
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },

    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Product", productSchema);
