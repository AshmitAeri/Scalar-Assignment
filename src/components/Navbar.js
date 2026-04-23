import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ cartCount, wishlistCount, setSearch, setCategory, user }) {
  const [input, setInput] = useState("");
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // 🔐 Check login
  const token = localStorage.getItem("token");

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Fetch products
  useEffect(() => {
    const API = process.env.REACT_APP_API_URL || "http://localhost:5001";
    fetch(`${API}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  // Handle search
  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    setSearch(value);

    if (value.length > 0) {
      const lower = value.toLowerCase();

      const productMatches = products.filter((item) =>
        item.name.toLowerCase().includes(lower)
      );

      const categories = [...new Set(products.map((p) => p.category))];

      const categoryMatches = categories.filter((cat) =>
        cat.toLowerCase().includes(lower)
      );

      const combined = [
        ...categoryMatches.map((cat) => ({
          type: "category",
          value: cat,
        })),
        ...productMatches.map((item) => ({
          type: "product",
          value: item,
        })),
      ];

      setSuggestions(combined.slice(0, 6));
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="navbar">

      {/* 🔵 LOGO */}
      <div
        className="logo-container"
        onClick={() => {
          setCategory("All");
          setSearch("");
          setInput("");
        }}
      >
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0cGuSNJW0YeTDT8v3ndG9wnTk-1uJUbnTqQ&s"
          alt="logo"
          className="logo-img"
        />
        <h2 className="logo-text">Flipkart Clone</h2>
      </div>

      {/* 🔍 SEARCH */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for products or categories..."
          value={input}
          onChange={handleChange}
        />

        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((item, index) => {

              if (item.type === "category") {
                return (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => {
                      setCategory(item.value);
                      setSearch("");
                      setInput("");
                      setSuggestions([]);
                    }}
                  >
                    🔎 {item.value} (Category)
                  </div>
                );
              }

              return (
                <Link
                  key={index}
                  to={`/product/${item.value.id}`}
                  className="suggestion-item"
                  onClick={() => setSuggestions([])}
                >
                  {item.value.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="nav-right">

        {/* 🔐 LOGIN / USER */}
        {!token ? (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        ) : (
          <div className="profile">
            <span className="profile-name">
              👤 {user ? user.split("@")[0] : "User"}
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        )}

        {/* 📦 ORDERS */}
        <Link to="/orders" className="orders">
          📦 Orders
        </Link>

        {/* ❤️ WISHLIST */}
        <Link to="/wishlist" className="wishlist">
          ❤️ Wishlist ({wishlistCount})
        </Link>

        {/* 🛒 CART */}
        <Link to="/cart" className="cart">
          🛒 Cart ({cartCount})
        </Link>

      </div>
    </div>
  );
}

export default Navbar;