import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Truck,
  ShieldCheck,
  RefreshCw
} from "lucide-react";

import ProductCard from "../components/ProductCard";

const categories = [
  {
    name: "Men",
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=700",
    link: "/shop?category=Men"
  },
  {
    name: "Women",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700",
    link: "/shop?category=Women"
  },
  {
    name: "Footwear",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700",
    link: "/shop?category=Footwear"
  },
  {
    name: "Accessories",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700",
    link: "/shop?category=Accessories"
  }
];

const featuredProducts = [
  {
    id: "demo-1",
    name: "Classic Oversized Shirt",
    category: "Men",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=700"
  },
  {
    id: "demo-2",
    name: "Elegant Summer Dress",
    category: "Women",
    price: 1899,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=700"
  },
  {
    id: "demo-3",
    name: "Urban Street Sneakers",
    category: "Footwear",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700"
  },
  {
    id: "demo-4",
    name: "Minimal Classic Watch",
    category: "Accessories",
    price: 1599,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700"
  }
];

function Home() {
  return (
    <main>
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-label">THE NEW SEASON COLLECTION</p>

          <h1>
            Style is a way
            <br />
            to <span>say who you are.</span>
          </h1>

          <p className="hero-description">
            Discover timeless fashion, everyday essentials
            and styles that define your personality.
          </p>

          <Link to="/shop" className="btn hero-btn">
            EXPLORE COLLECTION <ArrowRight size={17} />
          </Link>

          <div className="hero-bottom-text">
            <span>01 / 04</span>
            <span>NEW COLLECTION 2026</span>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400"
            alt="Fashion collection"
          />
          <div className="hero-image-caption">
            <span>THE ART OF EVERYDAY STYLE</span>
            <ArrowUpRight size={20} />
          </div>
        </div>
      </section>

      {/* CATEGORY SECTION */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">EXPLORE YOUR STYLE</p>
            <h2>Shop by Category</h2>
            <p>Find something that feels like you.</p>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <Link
                to={category.link}
                className="category-card"
                key={category.name}
              >
                <img src={category.image} alt={category.name} />

                <div className="category-overlay">
                  <h3>{category.name}</h3>
                  <span>
                    EXPLORE <ArrowUpRight size={17} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section featured-section">
        <div className="container">
          <div className="featured-heading">
            <div>
              <p className="eyebrow">HANDPICKED FOR YOU</p>
              <h2>Featured Products</h2>
              <p>Our favourites, just for your wardrobe.</p>
            </div>

            <Link to="/shop" className="view-all-link">
              VIEW ALL PRODUCTS <ArrowRight size={17} />
            </Link>
          </div>

          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="promo-section">
        <div className="promo-content">
          <p className="eyebrow">LESS IS MORE</p>
          <h2>
            Everyday essentials.
            <br />
            <span>Exceptional style.</span>
          </h2>
          <p>
            Build your wardrobe with pieces you'll
            love wearing every day.
          </p>

          <Link to="/shop" className="btn promo-btn">
            SHOP NOW <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="benefits-section">
        <div className="container benefits-grid">
          <div className="benefit-item">
            <Truck size={27} />
            <div>
              <h3>Easy Shopping</h3>
              <p>A simple and convenient shopping experience.</p>
            </div>
          </div>

          <div className="benefit-item">
            <ShieldCheck size={27} />
            <div>
              <h3>Secure Orders</h3>
              <p>Your order details are handled securely.</p>
            </div>
          </div>

          <div className="benefit-item">
            <RefreshCw size={27} />
            <div>
              <h3>Order Tracking</h3>
              <p>Stay updated on your order status.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;