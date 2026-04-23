import React, { useEffect, useState } from "react";
import "./Orders.css";

function Orders({ setChatMessage }) {
  const [orders, setOrders] = useState([]);

  // 🔥 Fetch orders
  const fetchOrders = () => {
    const API = process.env.REACT_APP_API_URL || "http://localhost:5001";
    const token = localStorage.getItem("token");

    fetch(`${API}/orders`, {
      headers: {
        "Authorization": token
      }
    })
      .then((res) => res.json())
      .then((data) => {
  if (Array.isArray(data)) {
    setOrders(data);
  } else {
    console.error("Invalid data:", data);
    setOrders([]);
  }
})
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderHelp = (order) => {
    const items = order.cart?.map((item) => item.name).join(", ") || "items";
    const message = `I need help with Order #${order.id} (${items}). Status: ${order.status || "Pending"}.`;
    setChatMessage(message);
  };

  return (
    <div className="orders-page">
      <h2>Your Orders 📦</h2>

      {orders.length === 0 ? (
        <p className="empty">No orders yet</p>
      ) : (
        Array.isArray(orders) && orders.map((order) => (
          <div key={order.id} className="order-card">

            {/* HEADER */}
            <div className="order-header">
              <div>
                <p><b>Order ID:</b> #{order.id}</p>
                <p><b>Date:</b> {new Date(order.created_at).toLocaleDateString()}</p>
              </div>

              <div className="status">
                {order.status || "Delivered"}
              </div>
            </div>

            {/* ITEMS */}
            <div className="order-items">
  {order.cart?.map((item, i) => (
    <div key={i} className="order-item">
      <span>
        {item.name} x {item.quantity}
      </span>

      <span>
        ₹{item.price * item.quantity}
      </span>
    </div>
  ))}
</div>

            {/* FOOTER */}
            <div className="order-footer">
              Total: ₹
{order.cart?.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
)}
              <p><b>Payment:</b> {order.payment_method}</p>

              {/* 🆘 HELP BUTTON */}
              <button
                className="order-help-btn"
                onClick={() => handleOrderHelp(order)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Help with this Order
              </button>
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default Orders;