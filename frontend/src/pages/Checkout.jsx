import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  CheckCircle
} from "lucide-react";

import API from "../services/api";

function Checkout() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await API.get("/cart");

      const items = response.data.cart?.items || [];
      setCartItems(items);

      if (items.length === 0) {
        setError("Your cart is empty. Add products before checkout.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load your cart."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const subtotal = cartItems.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  const shipping = 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setPlacingOrder(true);

      const response = await API.post("/orders/checkout", {
        shippingAddress: formData,
        paymentMethod: "COD"
      });

      setOrder(response.data.order || response.data);
      setCartItems([]);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to place your order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading checkout...</div>;
  }

  if (order) {
    return (
      <section className="checkout-success">
        <div className="success-card">
          <CheckCircle size={65} />

          <p className="success-eyebrow">ORDER CONFIRMED</p>

          <h1>Thank you for shopping with us!</h1>

          <p>
            Your order has been placed successfully. We will deliver
            your products to the address you provided.
          </p>

          {order._id && (
            <div className="success-order-id">
              Order ID: <strong>{order._id}</strong>
            </div>
          )}

          <div className="success-payment">
            <span>Payment Method</span>
            <strong>Cash on Delivery</strong>
          </div>

          <button
            className="btn"
            onClick={() => navigate("/my-orders")}
          >
            View My Orders <ArrowRight size={17} />
          </button>

          <Link to="/shop" className="success-continue">
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <div className="container">

        <div className="checkout-heading">
          <Link to="/cart" className="checkout-back">
            <ArrowLeft size={16} /> Back to Cart
          </Link>

          <p className="eyebrow">STYLECART CHECKOUT</p>
          <h1>Complete Your Order</h1>
          <p>You're just one step away from your new style.</p>
        </div>

        {error && (
          <div className="checkout-error">
            {error}
          </div>
        )}

        <div className="checkout-layout">

          {/* DELIVERY FORM */}

          <div className="checkout-form-section">

            <div className="checkout-section-title">
              <MapPin size={21} />
              <div>
                <h2>Delivery Information</h2>
                <p>Where should we deliver your order?</p>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder}>

              <div className="checkout-form-grid">

                <div className="form-group full-width">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    maxLength="10"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Full Address</label>
                  <textarea
                    name="address"
                    rows="3"
                    placeholder="House number, street, area..."
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>PIN Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="6-digit PIN code"
                    value={formData.postalCode}
                    onChange={handleChange}
                    pattern="[0-9]{6}"
                    maxLength="6"
                    required
                  />
                </div>

              </div>

              {/* PAYMENT */}

              <div className="checkout-payment">
                <div className="checkout-section-title">
                  <Package size={21} />
                  <div>
                    <h2>Payment Method</h2>
                    <p>Choose how you want to pay.</p>
                  </div>
                </div>

                <div className="payment-option">
                  <div className="payment-radio">
                    <span className="radio-selected"></span>
                  </div>

                  <div>
                    <h3>Cash on Delivery</h3>
                    <p>Pay when your order arrives at your doorstep.</p>
                  </div>

                  <span className="cod-label">COD</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn checkout-submit"
                disabled={placingOrder || cartItems.length === 0}
              >
                {placingOrder
                  ? "Placing Your Order..."
                  : "Place Order"}
                {!placingOrder && <ArrowRight size={18} />}
              </button>

            </form>
          </div>

          {/* ORDER SUMMARY */}

          <aside className="checkout-summary">

            <h2>Your Order</h2>

            <div className="checkout-items">

              {cartItems.map((item) => (
                <div
                  className="checkout-item"
                  key={item._id}
                >
                  <div className="checkout-item-image">
                    <img
                      src={item.product?.image}
                      alt={item.product?.name}
                    />

                    <span>{item.quantity}</span>
                  </div>

                  <div className="checkout-item-info">
                    <h3>{item.product?.name}</h3>

                    <p>
                      {item.size ? `Size: ${item.size}` : item.product?.category}
                    </p>

                    <strong>
                      ₹{(
                        item.product?.price * item.quantity
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>
              ))}

            </div>

            <div className="checkout-price-details">
              <div>
                <span>Subtotal</span>
                <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
              </div>

              <div>
                <span>Shipping</span>
                <strong className="free-shipping">FREE</strong>
              </div>

              <div className="checkout-total">
                <span>Total Amount</span>
                <strong>₹{total.toLocaleString("en-IN")}</strong>
              </div>
            </div>

            <div className="checkout-secure">
              <ShieldCheck size={20} />
              <p>Your order details are securely processed.</p>
            </div>

          </aside>

        </div>

      </div>
    </section>
  );
}

export default Checkout;