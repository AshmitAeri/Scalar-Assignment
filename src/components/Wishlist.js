import React from "react";
import { useNavigate } from "react-router-dom";
function Wishlist({ wishlist, removeFromWishlist, addToCart }) {
    const navigate = useNavigate();
 return (
  <div style={{ padding: "20px" }}>

    {/* 🔙 BACK BUTTON */}
    <button
      onClick={() => navigate("/")}
      style={{
        marginBottom: "15px",
        padding: "8px 12px",
        background: "#2874f0",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
      }}
    >
      ⬅ Back to Home
    </button>

    <h2>Your Wishlist ❤️</h2>
      {wishlist.length === 0 ? (
        <h3>No items in wishlist</h3>
      ) : (
        wishlist.map((item) => (
          <div key={item.id} style={{ marginBottom: "15px" }}>
            <img src={item.img} alt={item.name} width="100" />
            <h4>{item.name}</h4>
            <p>₹{item.price}</p>
            <button
                onClick={() => addToCart(item)}
            style={{
             marginRight: "10px",
                padding: "6px 10px",
                 background: "#2874f0",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
                >
                Add to Cart
            </button>
            <button onClick={() => removeFromWishlist(item.id)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Wishlist;