import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ShieldCheck
} from "lucide-react";

import API from "../services/api";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(`/orders/${id}`);

      setOrder(response.data.order || response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load order details."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle size={20} />;

      case "Shipped":
        return <Truck size={20} />;

      case "Cancelled":
        return <XCircle size={20} />;

      case "Processing":
        return <Package size={20} />;

      default:
        return <Clock size={20} />;
    }
  };

  if (loading) {
    return <div className="loading">Loading order details...</div>;
  }

  if (error || !order) {
    return (
      <section className="order-details-page">
        <div className="container">
          <div className="order-details-error">
            <Package size={40} />
            <h2>Order not found</h2>
            <p>{error || "We couldn't find this order."}</p>
            <Link to="/my-orders" className="btn">
              <ArrowLeft size={16} /> Back to My Orders
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const address = order.shippingAddress || {};

  const status = order.orderStatus || "Pending";

  const orderSteps = [
    {
      name: "Pending",
      description: "Your order has been received."
    },
    {
      name: "Processing",
      description: "Your order is being prepared."
    },
    {
      name: "Shipped",
      description: "Your order is on its way."
    },
    {
      name: "Delivered",
      description: "Your order has been delivered."
    }
  ];

  const currentStep = orderSteps.findIndex(
    (step) => step.name === status
  );

  return (
    <section className="order-details-page">
      <div className="container">

        <Link to="/my-orders" className="order-details-back">
          <ArrowLeft size={17} /> Back to My Orders
        </Link>

        <div className="order-details-heading">
          <div>
            <p className="eyebrow">STYLECART ACCOUNT</p>
            <h1>Order Details</h1>
            <p>Order ID: #{order._id}</p>
          </div>

          <div className={`detail-status status-${status.toLowerCase()}`}>
            {getStatusIcon(status)}
            {status}
          </div>
        </div>

        {/* ORDER TRACKING */}

        <div className="order-tracking-card">
          <h2>Order Tracking</h2>

          {status === "Cancelled" ? (
            <div className="cancelled-message">
              <XCircle size={22} />
              <div>
                <strong>Order Cancelled</strong>
                <p>This order has been cancelled.</p>
              </div>
            </div>
          ) : (
            <div className="tracking-steps">
              {orderSteps.map((step, index) => {
                const completed = currentStep >= index;

                return (
                  <div
                    className={`tracking-step ${completed ? "completed" : ""}`}
                    key={step.name}
                  >
                    <div className="tracking-circle">
                      {completed ? (
                        <CheckCircle size={20} />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>

                    <div className="tracking-step-info">
                      <strong>{step.name}</strong>
                      <p>{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="order-details-layout">

          {/* LEFT SECTION */}

          <div className="order-details-main">

            <div className="order-detail-card">
              <div className="order-detail-title">
                <Package size={20} />
                <h2>Ordered Products</h2>
              </div>

              {(order.items || []).map((item, index) => (
                <div
                  className="detail-product"
                  key={item._id || index}
                >
                  <img
                    src={item.image || item.product?.image}
                    alt={item.name || item.product?.name || "Product"}
                  />

                  <div className="detail-product-info">
                    <h3>
                      {item.name || item.product?.name || "Product"}
                    </h3>

                    <p>Quantity: {item.quantity}</p>

                    {item.size && <p>Size: {item.size}</p>}

                    <strong>
                      ₹{Number(item.price || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div className="detail-product-total">
                    ₹{(
                      Number(item.price || 0) *
                      Number(item.quantity || 1)
                    ).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>

            {/* DELIVERY ADDRESS */}

            <div className="order-detail-card">
              <div className="order-detail-title">
                <MapPin size={20} />
                <h2>Delivery Address</h2>
              </div>

              <div className="delivery-address">
                <h3>{address.fullName}</h3>
                <p>{address.address}</p>
                <p>
                  {address.city}, {address.state} - {address.postalCode}
                </p>
                <p>Phone: {address.phone}</p>
              </div>
            </div>

          </div>

          {/* RIGHT SECTION */}

          <aside className="order-details-sidebar">

            <div className="order-detail-card">
              <div className="order-detail-title">
                <CreditCard size={20} />
                <h2>Payment Summary</h2>
              </div>

              <div className="detail-summary-row">
                <span>Payment Method</span>
                <strong>{order.paymentMethod || "COD"}</strong>
              </div>

              <div className="detail-summary-row">
                <span>Payment Status</span>
                <strong className="payment-pending">
                  {order.paymentMethod === "COD" ? "Pay on Delivery" : "—"}
                </strong>
              </div>

              <div className="detail-summary-row">
                <span>Shipping</span>
                <strong className="free-shipping">FREE</strong>
              </div>

              <div className="detail-summary-row detail-grand-total">
                <span>Total Amount</span>
                <strong>
                  ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            <div className="order-detail-card">
              <div className="order-detail-title">
                <Clock size={20} />
                <h2>Order Information</h2>
              </div>

              <div className="detail-information">
                <span>Order ID</span>
                <strong>{order._id}</strong>
              </div>

              <div className="detail-information">
                <span>Order Date</span>
                <strong>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                      })
                    : "—"}
                </strong>
              </div>

              <div className="detail-information">
                <span>Order Status</span>
                <strong>{status}</strong>
              </div>
            </div>

            <div className="order-help-card">
              <ShieldCheck size={22} />
              <p>Your order information is securely stored with StyleCart.</p>
            </div>

          </aside>

        </div>

      </div>
    </section>
  );
}

export default OrderDetails;