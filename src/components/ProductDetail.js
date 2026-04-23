import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetail.css";

function ProductDetail({ addToCart, addToWishlist }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  // ⭐ Reviews state
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");

  // Fetch product
  useEffect(() => {
    const API = process.env.REACT_APP_API_URL || "http://localhost:5001";
    fetch(`${API}/products`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find(
          (item) => item.id === parseInt(id)
        );
        setProduct(found);
      })
      .catch((err) => console.error(err));
  }, [id]);

  // ✅ Add review
  const addReview = () => {
    if (newReview.trim() === "") return;

    const review = {
      text: newReview,
      date: new Date().toLocaleString()
    };

    setReviews([review, ...reviews]);
    setNewReview("");
  };

  if (!product) {
    return <h2 style={{ padding: "20px" }}>Loading...</h2>;
  }

  return (
    <div className="product-detail">

      {/* LEFT: IMAGE */}
      <div className="product-left">
        <img src={product.img} alt={product.name} />
      </div>

      {/* RIGHT: DETAILS */}
      <div className="product-right">
        <h2>{product.name}</h2>

        <h3 className="price">₹{product.price}</h3>

        {/* ⭐ Rating */}
        <p className="rating">
          {"⭐".repeat(Math.round(product.rating))} ({product.rating})
        </p>

        {/* 📄 Description */}
        <p className="description">{product.description}</p>

        {/* 🔥 BUTTONS */}
        <div className="detail-buttons">
          <button onClick={() => addToCart(product)}>
            Add to Cart
          </button>

          <button
            className="wishlist-btn"
            onClick={() => addToWishlist(product)}
          >
            ❤️ Wishlist
          </button>
        </div>

        {/* ⭐ REVIEWS SECTION */}
        <div className="reviews">

          <h3>Customer Reviews</h3>

          {/* INPUT */}
          <textarea
            placeholder="Write your review..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          />

          <button onClick={addReview}>
            Submit Review
          </button>

          {/* LIST */}
          {reviews.length === 0 ? (
            <p>No reviews yet</p>
          ) : (
            reviews.map((r, i) => (
              <div key={i} className="review-item">
                <p>{r.text}</p>
                <small>{r.date}</small>
              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}

export default ProductDetail;