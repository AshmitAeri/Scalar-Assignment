import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Success.css";

function Success() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ SAFE ACCESS (NO CRASH)
  const orderId =
    location && location.state && location.state.orderId
      ? location.state.orderId
      : "Not Available";

  return (
    <div className="success">
      <div className="success-box">

        <div className="success-icon">✔</div>

        <h2>Order Placed Successfully 🎉</h2>

        <p>Your order has been placed successfully.</p>

        <p className="order-id">
          Order ID: <strong>{orderId}</strong>
        </p>

        <button onClick={() => navigate("/")}>
          Continue Shopping
        </button>

      </div>
    </div>
  );
}

export default Success;