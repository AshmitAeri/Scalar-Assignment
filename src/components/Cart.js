import React from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart({ cart, setCart, removeFromCart }) {
  const navigate = useNavigate();

  // ➕ Increase quantity (with stock limit)
  const increaseQty = (index) => {
    const updated = [...cart];

    const maxQty = Math.min(5, updated[index].stock || 0);

    if ((updated[index].quantity || 1) < maxQty) {
      updated[index].quantity = (updated[index].quantity || 1) + 1;
      setCart(updated);
    }
  };

  // ➖ Decrease quantity
  const decreaseQty = (index) => {
    const updated = [...cart];

    if ((updated[index].quantity || 1) > 1) {
      updated[index].quantity -= 1;
      setCart(updated);
    }
  };

  // 💰 Total price
  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  return (
    <div className="cart-container">

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

      <h2>Your Cart 🛒</h2>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          {cart.map((item, index) => {
            const maxQty = Math.min(5, item.stock || 0);

            return (
              <div key={index} className="cart-item">
                <h4>{item.name}</h4>
                <p>₹{item.price}</p>

                {/* 🔥 Quantity Controls */}
                <div className="qty-controls">
                  <button onClick={() => decreaseQty(index)}>-</button>

                  <span>{item.quantity || 1}</span>

                  <button
                    onClick={() => increaseQty(index)}
                    disabled={(item.quantity || 1) >= maxQty}
                  >
                    +
                  </button>
                </div>

                {/* ❌ Remove */}
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(index)}
                >
                  Remove
                </button>
              </div>
            );
          })}

          {/* 💰 Total */}
          <h3 className="cart-total">Total: ₹{total}</h3>

          {/* ✅ Checkout */}
          <button
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;