import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";

import API from "../services/api";
import ProductCard from "../components/ProductCard";

const demoProducts = [
  {
    id: "demo-1",
    name: "Classic Oversized Shirt",
    category: "Men",
    price: 1299,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=700"
  },
  {
    id: "demo-2",
    name: "Elegant Summer Dress",
    category: "Women",
    price: 1899,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=700"
  },
  {
    id: "demo-3",
    name: "Urban Street Sneakers",
    category: "Footwear",
    price: 2499,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700"
  },
  {
    id: "demo-4",
    name: "Minimal Classic Watch",
    category: "Accessories",
    price: 1599,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700"
  },
  {
    id: "demo-5",
    name: "Casual Cotton T-Shirt",
    category: "Men",
    price: 799,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700"
  },
  {
    id: "demo-6",
    name: "Women's Casual Outfit",
    category: "Women",
    price: 1499,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700"
  },
  {
    id: "demo-7",
    name: "Classic White Sneakers",
    category: "Footwear",
    price: 2199,
    image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=700"
  },
  {
    id: "demo-8",
    name: "Everyday Sunglasses",
    category: "Accessories",
    price: 999,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700"
  }
];

const categories = ["All", "Men", "Women", "Footwear", "Accessories"];

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  const selectedCategory = searchParams.get("category") || "All";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/products");
        const data = response.data;

        const fetchedProducts = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
            ? data.products
            : [];

        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Unable to fetch products:", err);
        setError("Could not connect to the product server. Showing demo products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const displayedProducts = useMemo(() => {
    const sourceProducts = products.length > 0 ? products : demoProducts;

    let result = sourceProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        product.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(search.trim().toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (sort === "low-high") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "high-low") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
      result = [...result].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [products, selectedCategory, search, sort]);

  const handleCategoryChange = (category) => {
    if (category === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <main className="shop-page">
      <section className="shop-banner">
        <div>
          <p className="eyebrow">THE STYLECART COLLECTION</p>
          <h1>Find Your Style.</h1>
          <p>Explore fashion made for every moment.</p>
        </div>
      </section>

      <section className="container shop-content">
        <div className="shop-heading">
          <div>
            <p className="eyebrow">OUR COLLECTION</p>
            <h2>Shop All Products</h2>
          </div>

          <p className="product-count">
            {displayedProducts.length} PRODUCTS
          </p>
        </div>

        <div className="shop-toolbar">
          <div className="shop-categories">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  selectedCategory === category
                    ? "category-filter active"
                    : "category-filter"
                }
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="shop-controls">
            <div className="shop-search">
              <Search size={17} />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="shop-sort">
              <ArrowUpDown size={16} />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort products"
              >
                <option value="default">Sort By</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <p className="shop-notice">{error}</p>
        )}

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : displayedProducts.length > 0 ? (
          <div className="products-grid shop-products-grid">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <SlidersHorizontal size={35} />
            <h3>No products found</h3>
            <p>Try another search or choose a different category.</p>
            <button
              className="btn"
              onClick={() => {
                setSearch("");
                setSort("default");
                setSearchParams({});
              }}
            >
              CLEAR FILTERS
            </button>
          </div>
        )}

        <div className="shop-bottom-link">
          <Link to="/">← Back to Home</Link>
        </div>
      </section>
    </main>
  );
}

export default Shop;