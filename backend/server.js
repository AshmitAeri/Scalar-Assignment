require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

const SECRET = "secretkey";

/* ==============================
   AUTH MIDDLEWARE
============================== */
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(403).json({ error: "No token provided" });

  try {
    const verified = jwt.verify(token, SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

/* ==============================
   BASIC ROUTE
============================== */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* ==============================
   REGISTER
============================== */
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (email, password) VALUES ($1,$2)",
      [email, hashedPassword]
    );

    res.json({ message: "User registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

/* ==============================
   LOGIN (JWT)
============================== */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.rows[0].password);

    if (!valid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
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
   PLACE ORDER (PROTECTED)
============================== */
app.post("/orders", verifyToken, async (req, res) => {
  const { name, address, phone, cart, paymentMethod } = req.body;

  try {
    let total = 0;
    cart.forEach((item) => {
      total += item.price * (item.quantity || 1);
    });

    const userId = req.user.id;

    const order = await pool.query(
      "INSERT INTO orders (customer_name, address, phone, total, user_id) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [name, address, phone, total, userId]
    );

    const orderId = order.rows[0].id;

    await pool.query(
      "INSERT INTO order_status (order_id, status) VALUES ($1,$2)",
      [orderId, "Pending"]
    );

    setTimeout(async () => {
      try {
        await pool.query(
          "UPDATE order_status SET status = $1 WHERE order_id = $2",
          ["Delivered", orderId]
        );
      } catch (err) {
        console.error(err);
      }
    }, 60000);

    await pool.query(
      "INSERT INTO payments (order_id, payment_method, payment_status, refund_status) VALUES ($1,$2,$3,$4)",
      [orderId, paymentMethod, "Pending", "Not Requested"]
    );

    for (let item of cart) {
      const qty = parseInt(item.quantity) || 1;

      await pool.query(
        "INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1,$2,$3)",
        [orderId, item.id, qty]
      );

      await pool.query(
        "UPDATE inventory SET stock = stock - $1 WHERE product_id = $2 AND stock >= $1",
        [qty, item.id]
      );
    }

    res.json({ message: "Order placed successfully 🎉", orderId });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error placing order");
  }
});

/* ==============================
   GET ORDERS (PROTECTED)
============================== */
app.get("/orders", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT o.id, o.customer_name, o.address, o.phone, o.total, o.created_at,
      p.payment_method, s.status,
      json_agg(
        json_build_object(
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'name', pr.name,
          'price', pr.price
        )
      ) AS cart
      FROM orders o
      LEFT JOIN payments p ON o.id = p.order_id
      LEFT JOIN order_status s ON o.id = s.order_id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products pr ON oi.product_id = pr.id
      WHERE o.user_id = $1
      GROUP BY o.id, p.payment_method, s.status
      ORDER BY o.id DESC
    `, [userId]);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

/* ==============================
   UPDATE STATUS
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
   SERVER START + MIGRATIONS
============================== */
const PORT = process.env.PORT || 5001;

// Auto-migrate: add user_id column to orders if missing
const runMigrations = async () => {
  try {
    await pool.query(`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id)
    `);
    console.log("✅ Migrations complete");
  } catch (err) {
    console.error("⚠️ Migration warning:", err.message);
  }
};

runMigrations().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
  });
});