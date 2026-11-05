
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ArrowRight,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle
} from "lucide-react";

import API from "../services/api";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please sign in to view your orders.");
        return;
      }

      const response = await API.get("/orders/my-orders");

      const data = response.data;
      const orderList = Array.isArray(data)
        ? data
        : data.orders || [];

      setOrders(orderList);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load your orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle size={16} />;

      case "Shipped":
        return <Truck size={16} />;

      case "Cancelled":
        return <XCircle size={16} />;

      case "Processing":
        return <Package size={16} />;

      default:
        return <Clock size={16} />;
    }
  };

  const getStatusClass = (status) => {
    return `order-status status-${(status || "Pending").toLowerCase()}`;
  };

  if (loading) {
    return <div className="loading">Loading your orders...</div>;
  }

  return (
    <section className="my-orders-page">
      <div className="container">

        <div className="orders-heading">
          <p className="eyebrow">YOUR STYLECART ACCOUNT</p>
          <h1>My Orders</h1>
          <p>Track your purchases and check your delivery updates.</p>
        </div>

        {error && (
          <div className="orders-error">
            {error}
            {!localStorage.getItem("token") && (
              <Link to="/login"> Sign In</Link>
            )}
          </div>
        )}

        {!error && orders.length === 0 && (
          <div className="orders-empty">
            <div className="orders-empty-icon">
              <ShoppingBag size={35} />
            </div>

            <h2>No orders yet</h2>
            <p>
              Your shopping journey starts here. Explore our latest collection.
            </p>

            <Link to="/shop" className="btn">
              Start Shopping <ArrowRight size={17} />
            </Link>
          </div>
        )}

        {orders.length > 0 && (
          <div className="orders-list">

            <div className="orders-count">
              <span>{orders.length} Order{orders.length !== 1 ? "s" : ""}</span>
              <span>Recent purchases</span>
            </div>

            {orders.map((order) => (
              <div className="order-card" key={order._id}>

                <div className="order-card-header">
                  <div>
                    <p className="order-label">ORDER ID</p>
                    <h3>#{order._id}</h3>
                  </div>

                  <div className={getStatusClass(order.orderStatus)}>
                    {getStatusIcon(order.orderStatus)}
                    {order.orderStatus || "Pending"}
                  </div>
                </div>

                <div className="order-card-info">
                  <div>
                    <span>Order Date</span>
                    <strong>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })
                        : "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Payment</span>
                    <strong>{order.paymentMethod || "COD"}</strong>
                  </div>

                  <div>
                    <span>Total Amount</span>
                    <strong>
                      ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>

                <div className="order-products">
                  {(order.items || []).map((item, index) => (
                    <div
                      className="order-product"
                      key={item._id || `${order._id}-${index}`}
                    >
                      <img
                        src={item.image || item.product?.image}
                        alt={item.name || item.product?.name || "Product"}
                      />

                      <div className="order-product-details">
                        <h4>{item.name || item.product?.name || "Product"}</h4>
                        <p>
                          Quantity: {item.quantity}
                          {item.size ? ` • Size: ${item.size}` : ""}
                        </p>
                        <strong>
                          ₹{(
                            Number(item.price || item.product?.price || 0) *
                            Number(item.quantity || 1)
                          ).toLocaleString("en-IN")}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-card-footer">
                  <span>
                    {order.items?.length || 0} product type(s)
                  </span>

                  <Link to={`/orders/${order._id}`}>
                    View Order Details <ArrowRight size={16} />
                  </Link>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </section>
  );
}

export default MyOrders;