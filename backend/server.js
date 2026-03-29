const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors({
  origin: "*"
}));
app.use(express.json());

/* ==============================
   BASIC ROUTE
============================== */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* ==============================
   GET PRODUCTS
============================== */
app.get("/products", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, COALESCE(i.stock, 0) AS stock
      FROM products p
      LEFT JOIN inventory i ON p.id = i.product_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

/* ==============================
   PLACE ORDER
============================== */
app.post("/orders", async (req, res) => {
  const { name, address, phone, cart, paymentMethod } = req.body;

  try {
    let total = 0;
    cart.forEach((item) => {
      total += item.price;
    });

    // 1️⃣ Insert into orders
    const order = await pool.query(
      "INSERT INTO orders (customer_name, address, phone, total) VALUES ($1,$2,$3,$4) RETURNING *",
      [name, address, phone, total]
    );

    const orderId = order.rows[0].id;

    // 2️⃣ Insert status (START AS PENDING)
    await pool.query(
      "INSERT INTO order_status (order_id, status) VALUES ($1,$2)",
      [orderId, "Pending"]
    );

    // 🔥 AUTO DELIVERY AFTER 60 SECONDS
    setTimeout(async () => {
      try {
        await pool.query(
          "UPDATE order_status SET status = $1 WHERE order_id = $2",
          ["Delivered", orderId]
        );
        console.log(`Order ${orderId} delivered ✅`);
      } catch (err) {
        console.error(err);
      }
    }, 60000);

    // 3️⃣ Insert payment
    await pool.query(
      "INSERT INTO payments (order_id, payment_method, payment_status, refund_status) VALUES ($1,$2,$3,$4)",
      [orderId, paymentMethod, "Pending", "Not Requested"]
    );

    // 4️⃣ Insert items
    for (let item of cart) {
  const qty = parseInt(item.quantity) || 1;

  // insert order item with correct quantity
  await pool.query(
    "INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1,$2,$3)",
    [orderId, item.id, qty]
  );

  // reduce stock correctly
  await pool.query(
    "UPDATE inventory SET stock = stock - $1 WHERE product_id = $2 AND stock >= $1",
    [qty, item.id]
  );
}

    res.json({
      message: "Order placed successfully 🎉",
      orderId: orderId,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error placing order");
  }
});

/* ==============================
   GET ALL ORDERS
============================== */
app.get("/orders", async (req, res) => {
  try {
    const result = await pool.query(`
  SELECT o.id, o.customer_name, o.address, o.phone, o.total, o.created_at, p.payment_method, s.status, json_agg(json_build_object('product_id', oi.product_id, 'quantity', oi.quantity, 'name', pr.name, 'price', pr.price)) AS cart FROM orders o LEFT JOIN payments p ON o.id = p.order_id LEFT JOIN order_status s ON o.id = s.order_id LEFT JOIN order_items oi ON o.id = oi.order_id LEFT JOIN products pr ON oi.product_id = pr.id GROUP BY o.id, o.customer_name, o.address, o.phone, o.total, o.created_at, p.payment_method, s.status ORDER BY o.id DESC;
`);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

/* ==============================
   UPDATE ORDER STATUS (OPTIONAL)
============================== */
app.put("/orders/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query(
      "UPDATE order_status SET status = $1 WHERE order_id = $2",
      [status, id]
    );

    res.json({ message: "Status updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

/* ==============================
   SERVER START
============================== */
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});