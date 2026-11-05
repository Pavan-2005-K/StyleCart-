
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ShoppingBag,
  Menu,
  X,
  UserRound,
  Search
} from "lucide-react";

import "../styles/global.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="announcement-bar">
        FREE SHIPPING ON ORDERS ABOVE ₹999
      </div>

      <header className="navbar">
        <div className="nav-container">

          <Link to="/" className="nav-logo" onClick={closeMenu}>
            STYLE<span>CART.</span>
          </Link>

          <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
            <NavLink to="/" onClick={closeMenu}>
              Home
            </NavLink>

            <NavLink to="/shop" onClick={closeMenu}>
              Shop
            </NavLink>

            <NavLink to="/shop?category=Men" onClick={closeMenu}>
              Men
            </NavLink>

            <NavLink to="/shop?category=Women" onClick={closeMenu}>
              Women
            </NavLink>

            <NavLink to="/shop?category=Footwear" onClick={closeMenu}>
              Footwear
            </NavLink>

            <NavLink to="/shop?category=Accessories" onClick={closeMenu}>
              Accessories
            </NavLink>
          </nav>

          <div className="nav-actions">
            <Link to="/shop" className="nav-icon" aria-label="Search products">
              <Search size={20} />
            </Link>

            <Link to="/login" className="nav-icon" aria-label="Account">
              <UserRound size={20} />
            </Link>

            <Link to="/cart" className="nav-icon" aria-label="Shopping cart">
              <ShoppingBag size={20} />
            </Link>

            <button
              className="mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation"
            >
              {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>

        </div>
      </header>
    </>
  );
}

export default Navbar;
