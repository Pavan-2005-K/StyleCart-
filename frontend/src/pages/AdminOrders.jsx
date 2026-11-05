
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  RefreshCw,
  Package,
  Eye,
  X,
  MapPin,
  Phone,
  Calendar,
  IndianRupee
} from "lucide-react";

import API from "../services/api";

const statuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled"
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/orders/admin/all");
      const data = response.data;

      setOrders(
        Array.isArray(data) ? data : data.orders || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load customer orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const customerName =
      order.shippingAddress?.fullName || "";

    const matchesSearch =
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      (order._id || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (orderId, newStatus) => {
    const confirmed = window.confirm(
      `Change this order status to ${newStatus}?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(orderId);
      setError("");
      setSuccess("");

      const response = await API.put(
        `/orders/admin/${orderId}/status`,
        { orderStatus: newStatus }
      );

      const updatedOrder =
        response.data.order || response.data;

      setOrders((current) =>
        current.map((order) =>
          order._id === orderId
            ? {
                ...order,
                ...updatedOrder,
                orderStatus:
                  updatedOrder.orderStatus || newStatus
              }
            : order
        )
      );

      setSelectedOrder((current) =>
        current?._id === orderId
          ? {
              ...current,
              ...updatedOrder,
              orderStatus:
                updatedOrder.orderStatus || newStatus
            }
          : current
      );

      setSuccess("Order status updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getStatusClass = (status) =>
    `admin-status ${(status || "").toLowerCase()}`;

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-header">
        <div>
          <p className="admin-eyebrow">STYLECART MANAGEMENT</p>
          <h1>Manage Orders</h1>
          <p>View customer orders and manage their delivery status.</p>
        </div>

        <button
          className="admin-orders-refresh"
          onClick={fetchOrders}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="admin-orders-message error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-orders-message success">
          {success}
        </div>
      )}

      {/* Order Statistics */}
      <div className="admin-order-stats">
        <div>
          <span>Total Orders</span>
          <h2>{orders.length}</h2>
        </div>

        <div>
          <span>Pending</span>
          <h2>
            {orders.filter(
              (order) => order.orderStatus === "Pending"
            ).length}
          </h2>
        </div>

        <div>
          <span>Shipped</span>
          <h2>
            {orders.filter(
              (order) => order.orderStatus === "Shipped"
            ).length}
          </h2>
        </div>

        <div>
          <span>Delivered</span>
          <h2>
            {orders.filter(
              (order) => order.orderStatus === "Delivered"
            ).length}
          </h2>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="admin-orders-toolbar">
        <div className="admin-orders-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="loading">Loading customer orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="admin-orders-empty">
          <Package size={42} />
          <h3>No Orders Found</h3>
          <p>There are no orders matching your search.</p>
        </div>
      ) : (
        <div className="admin-orders-table-wrapper">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Update Status</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td className="admin-orders-id">
                    #{order._id?.slice(-7).toUpperCase()}
                  </td>

                  <td>
                    {order.shippingAddress?.fullName || "Customer"}
                  </td>

                  <td>{formatDate(order.createdAt)}</td>

                  <td>{order.items?.length || 0}</td>

                  <td className="admin-orders-price">
                    {formatPrice(order.totalPrice)}
                  </td>

                  <td>{order.paymentMethod || "COD"}</td>

                  <td>
                    <span className={getStatusClass(order.orderStatus)}>
                      {order.orderStatus}
                    </span>
                  </td>

                  <td>
                    <select
                      className="admin-order-status-select"
                      value={order.orderStatus}
                      disabled={
                        updatingId === order._id ||
                        order.orderStatus === "Cancelled" ||
                        order.orderStatus === "Delivered"
                      }
                      onChange={(e) =>
                        updateStatus(order._id, e.target.value)
                      }
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <button
                      className="admin-order-details-btn"
                      onClick={() => setSelectedOrder(order)}
                      title="View order details"
                    >
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="admin-order-modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="admin-order-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-order-modal-header">
              <div>
                <p className="admin-eyebrow">ORDER INFORMATION</p>
                <h2>
                  Order #{selectedOrder._id?.slice(-7).toUpperCase()}
                </h2>
              </div>

              <button
                className="admin-order-modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                <X size={21} />
              </button>
            </div>

            <div className="admin-order-modal-summary">
              <div>
                <span>Order Date</span>
                <strong>{formatDate(selectedOrder.createdAt)}</strong>
              </div>

              <div>
                <span>Order Status</span>
                <strong>
                  <span className={getStatusClass(selectedOrder.orderStatus)}>
                    {selectedOrder.orderStatus}
                  </span>
                </strong>
              </div>

              <div>
                <span>Payment Method</span>
                <strong>{selectedOrder.paymentMethod || "COD"}</strong>
              </div>
            </div>

            <div className="admin-order-modal-section">
              <h3>Customer Information</h3>

              <p>
                <strong>{selectedOrder.shippingAddress?.fullName}</strong>
              </p>

              <p>
                <Phone size={15} />
                {selectedOrder.shippingAddress?.phone}
              </p>

              <p>
                <MapPin size={15} />
                {[
                  selectedOrder.shippingAddress?.address,
                  selectedOrder.shippingAddress?.city,
                  selectedOrder.shippingAddress?.state,
                  selectedOrder.shippingAddress?.postalCode
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>

            <div className="admin-order-modal-section">
              <h3>Ordered Products</h3>

              <div className="admin-order-items">
                {(selectedOrder.items || []).map((item, index) => (
                  <div
                    className="admin-order-item"
                    key={item._id || index}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <div>
                      <strong>{item.name}</strong>
                      <span>
                        Qty: {item.quantity}
                        {item.size ? ` · Size: ${item.size}` : ""}
                      </span>
                    </div>

                    <strong>
                      {formatPrice(
                        Number(item.price) * Number(item.quantity)
                      )}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-order-total">
              <span>Order Total</span>
              <strong>{formatPrice(selectedOrder.totalPrice)}</strong>
            </div>

            <div className="admin-order-modal-footer">
              <Link
                to={`/orders/${selectedOrder._id}`}
                className="btn btn-outline"
                onClick={() => setSelectedOrder(null)}
              >
                Full Order Page
              </Link>

              <button
                className="btn"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
