
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShoppingCart
} from "lucide-react";

import API from "../services/api";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState("");

  // Fetch cart
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/cart");

      setCart(response.data.cart?.items || []);
    } catch (err) {
      console.error("Cart fetch failed:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load your shopping cart."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setLoading(false);
      setError("Please login to view your shopping cart.");
      return;
    }

    fetchCart();
  }, []);

  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => {
    if (!item.product) return total;

    return total + item.product.price * item.quantity;
  }, 0);

  // Update quantity
  const updateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;

    const product = item.product;

    if (!product) return;

    if (newQuantity > product.stock) {
      setError(`Only ${product.stock} items are available.`);
      return;
    }

    const itemKey = item._id;

    try {
      setUpdating(itemKey);
      setError("");

      await API.put(
        `/cart/update/${product._id}`,
        {
          quantity: newQuantity,
          size: item.size || ""
        }
      );

      await fetchCart();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to update product quantity."
      );
    } finally {
      setUpdating("");
    }
  };

  // Remove product
  const removeItem = async (item) => {
    if (!item.product) return;

    try {
      setUpdating(item._id);
      setError("");

      await API.delete(
        `/cart/remove/${item.product._id}`,
        {
          params: {
            size: item.size || ""
          }
        }
      );

      await fetchCart();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to remove product."
      );
    } finally {
      setUpdating("");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading">
        Loading your shopping cart...
      </div>
    );
  }

  // Login required
  if (
    error === "Please login to view your shopping cart."
  ) {
    return (
      <div className="empty-state container">
        <ShoppingBag size={45} />

        <h3>Login Required</h3>

        <p>Please login to view your shopping cart.</p>

        <Link to="/login" className="btn">
          LOGIN NOW
        </Link>
      </div>
    );
  }

  // Empty cart
  if (cart.length === 0 && !error) {
    return (
      <main className="cart-page">
        <div className="container">
          <div className="cart-empty-state">
            <ShoppingCart size={55} />

            <h1>Your Shopping Bag is Empty</h1>

            <p>
              Looks like you haven't added anything to your
              shopping bag yet.
            </p>

            <Link to="/shop" className="btn">
              CONTINUE SHOPPING
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="container">

        {/* Page Heading */}
        <div className="cart-heading">
          <div>
            <p className="eyebrow">YOUR STYLE, YOUR CHOICE</p>
            <h1>Shopping Bag</h1>
            <p>
              {cart.length} {cart.length === 1 ? "item" : "items"} in
              your bag
            </p>
          </div>

          <Link to="/shop" className="continue-shopping">
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>

        {error && (
          <p className="error-message">{error}</p>
        )}

        <div className="cart-layout">

          {/* Cart Products */}
          <div className="cart-items-section">

            {cart.map((item) => {
              const product = item.product;

              if (!product) return null;

              const itemKey = item._id;

              return (
                <div className="cart-item" key={itemKey}>

                  {/* Product Image */}
                  <Link
                    to={`/product/${product._id}`}
                    className="cart-item-image"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                  </Link>

                  {/* Product Information */}
                  <div className="cart-item-details">

                    <div className="cart-item-top">
                      <div>
                        <p className="product-category">
                          {product.category}
                        </p>

                        <Link to={`/product/${product._id}`}>
                          <h3>{product.name}</h3>
                        </Link>
                      </div>

                      <p className="cart-item-price">
                        ₹{(
                          product.price * item.quantity
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>

                    {item.size && (
                      <p className="cart-item-size">
                        Size: <strong>{item.size}</strong>
                      </p>
                    )}

                    <p className="cart-unit-price">
                      ₹{Number(product.price).toLocaleString("en-IN")} each
                    </p>

                    {/* Quantity and Remove */}
                    <div className="cart-item-actions">

                      <div className="cart-quantity-control">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item,
                              item.quantity - 1
                            )
                          }
                          disabled={
                            item.quantity <= 1 ||
                            updating === itemKey
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item,
                              item.quantity + 1
                            )
                          }
                          disabled={
                            item.quantity >= product.stock ||
                            updating === itemKey
                          }
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="remove-cart-item"
                        onClick={() => removeItem(item)}
                        disabled={updating === itemKey}
                      >
                        <Trash2 size={15} />
                        Remove
                      </button>

                    </div>

                  </div>
                </div>
              );
            })}

          </div>

          {/* Order Summary */}
          <aside className="cart-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>

              <span>
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping">FREE</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total</span>

              <strong>
                ₹{subtotal.toLocaleString("en-IN")}
              </strong>
            </div>

            <p className="summary-note">
              Shipping charges are free on all orders.
            </p>

            <button
              type="button"
              className="btn checkout-btn"
              onClick={() => navigate("/checkout")}
              disabled={cart.length === 0}
            >
              PROCEED TO CHECKOUT
              <ArrowRight size={17} />
            </button>

            <div className="cart-secure-note">
              <ShoppingBag size={16} />
              Secure Shopping at StyleCart
            </div>

          </aside>

        </div>
      </div>
    </main>
  );
}

export default Cart;
