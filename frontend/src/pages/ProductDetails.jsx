
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ShoppingBag,
  Minus,
  Plus,
  ArrowLeft,
  Truck,
  ShieldCheck
} from "lucide-react";

import API from "../services/api";

const demoProducts = [
  {
    id: "demo-1",
    name: "Classic Oversized Shirt",
    category: "Men",
    price: 1299,
    description:
      "A versatile oversized shirt designed for effortless everyday styling. Made for comfort and a relaxed fit.",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900",
    sizes: ["S", "M", "L", "XL"],
    stock: 15
  },
  {
    id: "demo-2",
    name: "Elegant Summer Dress",
    category: "Women",
    price: 1899,
    description:
      "An elegant summer dress with a timeless silhouette. A perfect addition to your everyday wardrobe.",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900",
    sizes: ["S", "M", "L", "XL"],
    stock: 10
  },
  {
    id: "demo-3",
    name: "Urban Street Sneakers",
    category: "Footwear",
    price: 2499,
    description:
      "Modern street-style sneakers that combine everyday comfort with a clean, versatile design.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900",
    sizes: ["7", "8", "9", "10", "11"],
    stock: 8
  },
  {
    id: "demo-4",
    name: "Minimal Classic Watch",
    category: "Accessories",
    price: 1599,
    description:
      "A minimal everyday accessory with a classic look that complements any outfit.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900",
    sizes: ["One Size"],
    stock: 12
  }
];

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setProduct(null);
      setSelectedSize("");
      setQuantity(1);
      setMessage("");
      setError("");

      try {
        if (id.startsWith("demo-")) {
          const demoProduct = demoProducts.find(
            (item) => item.id === id
          );

          if (demoProduct) {
            setProduct(demoProduct);
          } else {
            setError("Product not found.");
          }

          return;
        }

        const response = await API.get(`/products/${id}`);
        const data = response.data.product || response.data;

        setProduct(data);
      } catch (err) {
        console.error("Product fetch failed:", err);

        setError(
          err.response?.data?.message ||
          "Unable to load this product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Add product to cart
  const handleAddToCart = async () => {
    if (!product) return;

    setError("");
    setMessage("");

    // Check product size
    if (product.sizes?.length > 0 && !selectedSize) {
      setError("Please select a size before adding to cart.");
      return;
    }

    // Check login
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login to add products to your cart.");
      return;
    }

    // Demo products are not stored in MongoDB
    if (id.startsWith("demo-")) {
      setError(
        "Demo products cannot be added to the database cart. Add real products through the admin dashboard."
      );
      return;
    }

    try {
      setAdding(true);

      // Send product ID, quantity and selected size
      await API.post("/cart/add", {
        productId: product._id,
        quantity: Number(quantity),
        size: selectedSize || ""
      });

      setMessage("Product successfully added to your cart!");
    } catch (err) {
      console.error("Add to cart failed:", err);

      setError(
        err.response?.data?.message ||
        "Unable to add product to cart."
      );
    } finally {
      setAdding(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading">
        Loading product details...
      </div>
    );
  }

  // Product not found
  if (error && !product) {
    return (
      <div className="empty-state container">
        <h3>Product Not Found</h3>
        <p>{error}</p>

        <Link to="/shop" className="btn">
          BACK TO SHOP
        </Link>
      </div>
    );
  }

  if (!product) return null;

  const availableSizes = product.sizes || [];
  const stock = product.stock ?? 0;

  return (
    <main className="product-details-page">
      <div className="container">

        {/* Back to Shop */}
        <Link to="/shop" className="back-to-shop">
          <ArrowLeft size={17} />
          Back to Shop
        </Link>

        <div className="product-details-grid">

          {/* Product Image */}
          <div className="product-details-image">
            <img
              src={product.image}
              alt={product.name}
            />
          </div>

          {/* Product Information */}
          <div className="product-details-info">

            <p className="eyebrow">
              {product.category}
            </p>

            <h1>{product.name}</h1>

            <p className="details-price">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>

            <div className="details-divider" />

            <p className="details-description">
              {product.description ||
                "Discover everyday fashion with StyleCart. Designed for comfort and effortless style."}
            </p>

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="size-selection">
                <h3>Select Size</h3>

                <div className="size-options">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={
                        selectedSize === size
                          ? "size-btn selected"
                          : "size-btn"
                      }
                      onClick={() => {
                        setSelectedSize(size);
                        setError("");
                        setMessage("");
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="quantity-section">
              <h3>Quantity</h3>

              <div className="quantity-control">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(stock, q + 1))
                  }
                  disabled={quantity >= stock}
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>

              <span className="stock-message">
                {stock > 0
                  ? `${stock} items available`
                  : "Out of stock"}
              </span>
            </div>

            {/* Messages */}
            {error && (
              <p className="error-message">
                {error}
              </p>
            )}

            {message && (
              <p className="success-message">
                {message}
              </p>
            )}

            {/* Add to Cart */}
            <button
              type="button"
              className="btn add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={adding || stock === 0}
            >
              <ShoppingBag size={18} />

              {adding
                ? "ADDING..."
                : stock === 0
                  ? "OUT OF STOCK"
                  : "ADD TO CART"}
            </button>

            {/* Product Benefits */}
            <div className="product-benefits">

              <div>
                <Truck size={20} />
                <span>Convenient Delivery</span>
              </div>

              <div>
                <ShieldCheck size={20} />
                <span>Secure Shopping</span>
              </div>

            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;
