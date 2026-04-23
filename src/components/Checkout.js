import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout({ cart, setCart, user }) {

  // ✅ Hooks FIRST (important)
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });

  // ✅ LOGIN CHECK (after hooks)
  if (!user) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Please login to continue</h2>

        <button
          onClick={() => navigate("/login")}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            background: "#2874f0",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  // 🔄 Form handlers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const total = cart.reduce(
  (sum, item) => sum + item.price * (item.quantity || 1),
  0
);

  // 🧾 Place Order
  const placeOrder = async () => {
    if (!form.name || !form.address || !form.phone) {
      alert("Please fill all shipping details");
      return;
    }

    if (paymentMethod === "UPI" && !upiId) {
      alert("Please enter UPI ID");
      return;
    }

    if (paymentMethod === "Card") {
      if (!card.number || !card.name || !card.expiry || !card.cvv) {
        alert("Please fill all card details");
        return;
      }
    }

    const API = process.env.REACT_APP_API_URL || "http://localhost:5001";
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({
  name: form.name,
  address: form.address,
  phone: form.phone,
  cart: cart.map(item => ({
    ...item,
    quantity: item.quantity || 1
  })),
  paymentMethod: paymentMethod
})
      });

      const data = await res.json();

      setCart([]);
      navigate("/success", { state: { orderId: data.orderId } });

    } catch (err) {
      console.error(err);
      alert("Order failed");
    }
  };

  return (
    <div className="checkout">
      <h2>Checkout 🧾</h2>

      <div className="checkout-container">

        {/* 📝 FORM */}
        <div className="checkout-form">
          <h3>Shipping Details</h3>

          <input name="name" placeholder="Name" onChange={handleChange} />
          <input name="address" placeholder="Address" onChange={handleChange} />
          <input name="phone" placeholder="Phone" onChange={handleChange} />
        </div>

        {/* 🛒 SUMMARY */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>

          {cart.map((item, i) => (
  <div key={i}>
    {item.name} x {item.quantity || 1} - ₹
    {item.price * (item.quantity || 1)}
  </div>
))}

          <h3>Total: ₹{total}</h3>

          {/* 💳 PAYMENT */}
          <h3>Select Payment Method</h3>

          <label>
            <input
              type="radio"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            COD
          </label>

          <label>
            <input
              type="radio"
              value="UPI"
              checked={paymentMethod === "UPI"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            UPI
          </label>

          <label>
            <input
              type="radio"
              value="Card"
              checked={paymentMethod === "Card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Card
          </label>

          {/* 🔥 Conditional Inputs */}
          {paymentMethod === "UPI" && (
            <input
              placeholder="Enter UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          )}

          {paymentMethod === "Card" && (
            <div>
              <input name="number" placeholder="Card Number" onChange={handleCardChange} />
              <input name="name" placeholder="Card Holder Name" onChange={handleCardChange} />
              <input name="expiry" placeholder="Expiry (MM/YY)" onChange={handleCardChange} />
              <input name="cvv" placeholder="CVV" onChange={handleCardChange} />
            </div>
          )}

          {/* 🧾 ORDER BUTTON */}
          <button onClick={placeOrder}>
            Place Order
          </button>

        </div>
      </div>
    </div>
  );
}

export default Checkout;