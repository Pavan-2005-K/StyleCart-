import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <Link to={`/product/${product._id || product.id}`}>
        <div className="product-image">
          <img src={product.image} alt={product.name} />
          <span className="product-tag">NEW ARRIVAL</span>
        </div>
      </Link>

      <div className="product-info">
        <div>
          <p className="product-category">{product.category}</p>
          <Link to={`/product/${product._id || product.id}`}>
            <h3>{product.name}</h3>
          </Link>
          <p className="product-price">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>
        </div>

        <button
          className="product-cart-btn"
          aria-label={`View ${product.name}`}
          onClick={() =>
            window.location.assign(
              `/product/${product._id || product.id}`
            )
          }
        >
          <ShoppingBag size={18} />
        </button>
      </div>
    </div>
  );
}

export default ProductCard;