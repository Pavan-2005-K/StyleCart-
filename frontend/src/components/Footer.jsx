
import { Link } from "react-router-dom";
import {
  Camera,
  Globe,
  Mail,
  ArrowUpRight
} from "lucide-react";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">

          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              STYLE<span>CART.</span>
            </Link>

            <p>
              Discover your style. Explore timeless fashion
              and everyday essentials with StyleCart.
            </p>

            <div className="footer-socials">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <Camera size={18} />
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <Globe size={18} />
              </a>

              <a
                href="mailto:support@stylecart.com"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3>SHOP</h3>
            <Link to="/shop">All Products</Link>
            <Link to="/shop?category=Men">Men</Link>
            <Link to="/shop?category=Women">Women</Link>
            <Link to="/shop?category=Footwear">Footwear</Link>
            <Link to="/shop?category=Accessories">Accessories</Link>
          </div>

          <div className="footer-column">
            <h3>MY ACCOUNT</h3>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/cart">Shopping Bag</Link>
            <Link to="/my-orders">My Orders</Link>
          </div>

          <div className="footer-column footer-contact">
            <h3>NEED HELP?</h3>
            <p>Have questions about your order?</p>

            <a href="mailto:support@stylecart.com">
              Contact Support <ArrowUpRight size={15} />
            </a>
          </div>

        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} StyleCart. All rights reserved.
          </p>
          <p>Designed for everyday style.</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
