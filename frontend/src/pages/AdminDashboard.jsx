
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  IndianRupee,
  Clock,
  ArrowUpRight,
  ExternalLink,
  RefreshCw,
  LogOut,
  Truck,
  CheckCircle,
  AlertCircle
} from "lucide-react";

import API from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [productsResponse, ordersResponse] = await Promise.all([
        API.get("/products"),
        API.get("/orders/admin/all")
      ]);

      const productData = productsResponse.data;
      const orderData = ordersResponse.data;

      setProducts(
        Array.isArray(productData)
          ? productData
          : productData.products || []
      );

      setOrders(
        Array.isArray(orderData)
          ? orderData
          : orderData.orders || []
      );
    } catch (err) {
      console.error("Dashboard error:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (err.response?.status === 403) {
        setError("Access denied. Only administrators can view this dashboard.");
      } else {
        setError(
          err.response?.data?.message ||
          "Unable to load dashboard data. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, []);

  const totalProducts = products.length;
  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "Delivered"
  ).length;

  const totalSales = orders
    .filter((order) => order.orderStatus !== "Cancelled")
    .reduce(
      (total, order) => total + Number(order.totalPrice || 0),
      0
    );

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
    .slice(0, 5);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (user?.role !== "admin") {
    return (
      <div className="admin-access-denied container">
        <AlertCircle size={45} />
        <h2>Admin Access Required</h2>
        <p>You must be logged in with an administrator account to access this page.</p>
        <Link to="/login" className="btn">
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <p className="admin-eyebrow">STYLECART MANAGEMENT</p>
          <h1>Admin Dashboard</h1>
          <p>Manage your store, products and customer orders.</p>
        </div>

        <div className="admin-header-actions">
          <button
            className="admin-refresh-btn"
            onClick={fetchDashboardData}
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-error">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={fetchDashboardData}>Try Again</button>
        </div>
      )}

      {!error && (
        <>
          {/* Dashboard Statistics */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <span>Total Products</span>
                <div className="admin-stat-icon">
                  <Package size={21} />
                </div>
              </div>
              <h2>{totalProducts}</h2>
              <p>Products in your store</p>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <span>Total Orders</span>
                <div className="admin-stat-icon">
                  <ShoppingBag size={21} />
                </div>
              </div>
              <h2>{totalOrders}</h2>
              <p>Customer orders received</p>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <span>Total Sales</span>
                <div className="admin-stat-icon">
                  <IndianRupee size={21} />
                </div>
              </div>
              <h2>{formatPrice(totalSales)}</h2>
              <p>Excluding cancelled orders</p>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <span>Pending Orders</span>
                <div className="admin-stat-icon">
                  <Clock size={21} />
                </div>
              </div>
              <h2>{pendingOrders}</h2>
              <p>Orders awaiting processing</p>
            </div>
          </div>

          {/* Order Overview */}
          <div className="admin-overview-grid">
            <div className="admin-overview-card">
              <div className="admin-overview-icon">
                <Truck size={22} />
              </div>
              <div>
                <h3>{totalOrders - deliveredOrders}</h3>
                <p>Orders not yet delivered</p>
              </div>
            </div>

            <div className="admin-overview-card">
              <div className="admin-overview-icon">
                <CheckCircle size={22} />
              </div>
              <div>
                <h3>{deliveredOrders}</h3>
                <p>Successfully delivered</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <section className="admin-section">
            <div className="admin-section-heading">
              <div>
                <h2>Store Management</h2>
                <p>Quick access to your store operations.</p>
              </div>
            </div>

            <div className="admin-action-grid">
              <Link to="/admin/products" className="admin-action-card">
                <div className="admin-action-icon">
                  <Package size={24} />
                </div>
                <div>
                  <h3>Manage Products</h3>
                  <p>Add, edit and delete store products.</p>
                </div>
                <ArrowUpRight size={20} />
              </Link>

              <Link to="/admin/orders" className="admin-action-card">
                <div className="admin-action-icon">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h3>Manage Orders</h3>
                  <p>View orders and update their status.</p>
                </div>
                <ArrowUpRight size={20} />
              </Link>
            </div>
          </section>

          {/* Recent Orders */}
          <section className="admin-section">
            <div className="admin-section-heading">
              <div>
                <h2>Recent Orders</h2>
                <p>Latest orders placed by your customers.</p>
              </div>

              <Link to="/admin/orders" className="admin-view-all">
                View All <ExternalLink size={15} />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="admin-empty">
                <ShoppingBag size={35} />
                <h3>No Orders Yet</h3>
                <p>Customer orders will appear here.</p>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <span className="admin-order-id">
                            #{order._id?.slice(-7).toUpperCase()}
                          </span>
                        </td>

                        <td>
                          {order.shippingAddress?.fullName || "Customer"}
                        </td>

                        <td>{formatDate(order.createdAt)}</td>

                        <td className="admin-order-price">
                          {formatPrice(order.totalPrice)}
                        </td>

                        <td>
                          <span
                            className={`admin-status ${
                              order.orderStatus?.toLowerCase()
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>

                        <td>
                          <Link
                            to={`/orders/${order._id}`}
                            className="admin-order-link"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
