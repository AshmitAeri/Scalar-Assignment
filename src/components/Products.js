import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Products.css";

function Products({ addToCart, addToWishlist, search, category, setCategory }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const API = process.env.REACT_APP_API_URL || "http://localhost:5001";
    fetch(`${API}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  const filteredProducts = products.filter((item) => {
    return (
      (category === "All" || item.category === category) &&
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div>

      {/* CATEGORY TITLE */}
      <h2 style={{ margin: "10px" }}>
        {category === "All" ? "All Products" : category}
      </h2>

      {/* SHOW ALL BUTTON */}
      {category !== "All" && (
        <button
          style={{
            margin: "10px",
            padding: "8px 12px",
            background: "#2874f0",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
          onClick={() => setCategory("All")}
        >
          Show All Products
        </button>
      )}

      {/* PRODUCTS GRID */}
      <div className="products">
        {filteredProducts.map((item) => (
          <div key={item.id} className="product-card">

            <Link to={`/product/${item.id}`}>
              <img src={item.img} alt={item.name} />
            </Link>

            <h4>{item.name}</h4>
            <p>₹{item.price}</p>

            {/* ✅ STOCK FIX */}
            <p style={{ color: Number(item.stock) > 0 ? "green" : "red" }}>
              {Number(item.stock) > 0 ? "In Stock" : "Sold Out"}
            </p>

            {/* BUTTON ROW */}
            <div className="button-row">

              {/* ✅ ADD TO CART FIX */}
              {Number(item.stock) > 0 ? (
                <button onClick={() => addToCart(item)}>
                  Add to Cart
                </button>
              ) : (
                <button
                  disabled
                  style={{ background: "gray", cursor: "not-allowed" }}
                >
                  Sold Out
                </button>
              )}

              {/* ❤️ WISHLIST */}
              <button
                className="wishlist-btn"
                onClick={() => addToWishlist(item)}
              >
                ❤️
              </button>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default Products;