import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import banner1 from "./components/images/banner1.png";

import Navbar from "./components/Navbar";
import Categories from "./components/Categories";
import Products from "./components/Products";
import Cart from "./components/Cart";
import ProductDetail from "./components/ProductDetail";
import Checkout from "./components/Checkout";
import Success from "./components/Success";
import Wishlist from "./components/Wishlist";
import Login from "./components/Login";
import Orders from "./components/Orders";   // ✅ added

import "./App.css";

function App() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);

  const addToCart = (item) => {
  const existing = cart.find((c) => c.id === item.id);

  if (existing) {
    const updatedCart = cart.map((c) =>
      c.id === item.id
        ? {
            ...c,
            quantity: Math.min((c.quantity || 1) + 1, 5)
          }
        : c
    );
    setCart(updatedCart);
  } else {
    setCart([...cart, { ...item, quantity: 1 }]);
  }
};

  const removeFromCart = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const addToWishlist = (item) => {
    if (!wishlist.find((w) => w.id === item.id)) {
      setWishlist([...wishlist, item]);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  return (
    <BrowserRouter>

      {/* 🔝 NAVBAR */}
      <Navbar
        cartCount={cart.length}
        wishlistCount={wishlist.length}
        setSearch={setSearch}
        setCategory={setCategory}
        user={user}
      />

      <Routes>

        {/* 🏠 HOME */}
        <Route
          path="/"
          element={
            <>
              {search.trim() === "" && (
                <Categories setCategory={setCategory} />
              )}

              <div className="home-layout">

                <div className="left-section">
                  <Products
                    addToCart={addToCart}
                    addToWishlist={addToWishlist}
                    search={search}
                    category={category}
                    setCategory={setCategory}
                  />
                </div>

                {search.trim() === "" && (
                  <div className="right-section">
                    <div className="mini-banner">
                      <img src={banner1} alt="banner" />
                      <h4>Shop Fashion</h4>

                      <button
                        onClick={() => {
                          setCategory("Fashion");
                          setSearch("");
                        }}
                      >
                        Explore
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </>
          }
        />

        {/* 📦 PRODUCT DETAIL */}
        <Route
          path="/product/:id"
          element={
            <ProductDetail
              addToCart={addToCart}
              addToWishlist={addToWishlist}
            />
          }
        />

        {/* 🛒 CART */}
        <Route
  path="/cart"
  element={
    <Cart
      cart={cart}
      setCart={setCart}   // ✅ ADD THIS
      removeFromCart={removeFromCart}
    />
  }
/>

        {/* ❤️ WISHLIST */}
        <Route
          path="/wishlist"
          element={
            <Wishlist
              wishlist={wishlist}
              removeFromWishlist={removeFromWishlist}
              addToCart={addToCart}
            />
          }
        />

        {/* 🔐 LOGIN */}
        <Route
          path="/login"
          element={<Login setUser={setUser} />}
        />

        {/* 📦 ORDERS (NEW FEATURE) */}
        <Route
          path="/orders"
          element={<Orders />}
        />

        {/* 💳 CHECKOUT */}
        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              setCart={setCart}
              user={user}
            />
          }
        />

        {/* 🎉 SUCCESS */}
        <Route path="/success" element={<Success />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;