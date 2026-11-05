
import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Package,
  RefreshCw
} from "lucide-react";

import API from "../services/api";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "Men",
  image: "",
  brand: "",
  sizes: "",
  stock: ""
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/products");
      const data = response.data;

      setProducts(
        Array.isArray(data) ? data : data.products || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.category} ${product.brand || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData(initialForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product._id);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      category: product.category || "Men",
      image: product.image || "",
      brand: product.brand || "",
      sizes: Array.isArray(product.sizes)
        ? product.sizes.join(", ")
        : "",
      stock: product.stock ?? ""
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        sizes: formData.sizes
          .split(",")
          .map((size) => size.trim())
          .filter(Boolean)
      };

      if (editingId) {
        await API.put(`/products/${editingId}`, payload);
        setSuccess("Product updated successfully.");
      } else {
        await API.post("/products", payload);
        setSuccess("Product added successfully.");
      }

      setShowForm(false);
      setFormData(initialForm);
      setEditingId(null);

      await fetchProducts();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await API.delete(`/products/${productId}`);

      setProducts((current) =>
        current.filter((product) => product._id !== productId)
      );

      setSuccess("Product deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete product."
      );
    }
  };

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  return (
    <div className="admin-products-page">
      <div className="admin-products-header">
        <div>
          <p className="admin-eyebrow">STYLECART MANAGEMENT</p>
          <h1>Manage Products</h1>
          <p>Add, update and manage your store inventory.</p>
        </div>

        <button className="btn" onClick={openAddForm}>
          <Plus size={17} />
          Add Product
        </button>
      </div>

      {error && <div className="admin-products-error">{error}</div>}
      {success && <div className="admin-products-success">{success}</div>}

      <div className="admin-products-toolbar">
        <div className="admin-products-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search products, brands or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className="admin-products-refresh"
          onClick={fetchProducts}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="admin-products-count">
        <Package size={18} />
        <span>{filteredProducts.length} Products</span>
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="admin-products-empty">
          <Package size={40} />
          <h3>No Products Found</h3>
          <p>Try another search or add a new product.</p>
        </div>
      ) : (
        <div className="admin-products-table-wrapper">
          <table className="admin-products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Sizes</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="admin-product-info">
                      <img
                        src={product.image}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.style.visibility = "hidden";
                        }}
                      />
                      <div>
                        <strong>{product.name}</strong>
                        <span>{product.brand || "StyleCart"}</span>
                      </div>
                    </div>
                  </td>

                  <td>{product.category}</td>

                  <td className="admin-product-price">
                    {formatPrice(product.price)}
                  </td>

                  <td>
                    <span
                      className={
                        Number(product.stock) > 0
                          ? "admin-stock-available"
                          : "admin-stock-out"
                      }
                    >
                      {product.stock ?? 0}
                    </span>
                  </td>

                  <td>
                    {Array.isArray(product.sizes) &&
                    product.sizes.length > 0
                      ? product.sizes.join(", ")
                      : "—"}
                  </td>

                  <td>
                    <div className="admin-product-actions">
                      <button
                        title="Edit product"
                        onClick={() => openEditForm(product)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        title="Delete product"
                        className="delete"
                        onClick={() => handleDelete(product._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="admin-product-modal-overlay">
          <div className="admin-product-modal">
            <div className="admin-product-modal-header">
              <div>
                <p className="admin-eyebrow">STYLECART</p>
                <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setShowForm(false)}
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Classic Oversized Shirt"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Brand</label>
                  <input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="StyleCart"
                  />
                </div>

                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="form-group admin-full-width">
                  <label>Product Image URL *</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/product.jpg"
                    required
                  />
                </div>

                <div className="form-group admin-full-width">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter product description..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Sizes</label>
                  <input
                    name="sizes"
                    value={formData.sizes}
                    onChange={handleChange}
                    placeholder="S, M, L, XL"
                  />
                </div>

                <div className="form-group">
                  <label>Stock Quantity *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="admin-product-modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Product"
                    : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
