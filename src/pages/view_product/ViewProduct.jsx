import React, { useEffect, useState } from 'react';
import { Button, Image } from 'antd';
import Rating from 'react-rating-stars-component';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addReviewApi, addToCartApi, getReviewsApi, getSingleProduct, getUserProfileApi } from '../../apis/Api';
import Footer from '../../components/Footer';
import './ViewProduct.css';

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(1);
  const [averageRating, setAverageRating] = useState(0);
  const [user, setUser] = useState({
    fullName: '',
    phoneNumber: '',
    address: ''
  });

  useEffect(() => {
    getSingleProduct(id)
      .then((res) => {
        setProduct(res.data.product);
      })
      .catch((error) => {
        console.error(error);
      });
    fetchReviews();
    fetchUserProfile();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const res = await getReviewsApi(id);
      setReviews(res.data.reviews);
      calculateAverageRating(res.data.reviews);
    } catch (err) {
      toast.error("Failed to fetch reviews");
    }
  };

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) {
      setAverageRating(0);
      return;
    }
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    setAverageRating(totalRating / reviews.length);
  };

  const fetchUserProfile = () => {
    getUserProfileApi()
      .then((res) => {
        setUser({
          ...user,
          fullName: `${res.data.firstName} ${res.data.lastName}`,
          phoneNumber: res.data.phone
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAddToCart = async () => {
    try {
      const total = quantity * product.productPrice;
      await addToCartApi({
        productId: product._id,
        quantity: quantity,
        total: total
      });
      toast.success("Added to cart successfully!");
    } catch (error) {
      toast.error("Failed to add to cart.");
      throw error;
    }
  };

  const handleProceedToPayment = async () => {
    try {
      await handleAddToCart();
      navigate('/my_cart');
    } catch (error) {
      console.error('Error proceeding to payment:', error);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const submitReview = async () => {
    if (!rating || !newReview) {
      toast.error("Please provide both rating and comment");
      return;
    }
    try {
      const res = await addReviewApi({ productId: id, rating, comment: newReview });
      toast.success(res.data.message);
      setRating(1);
      setNewReview('');
      fetchReviews();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to submit review");
      }
    }
  };

  if (!product) {
    return <div className="vp-loading">Loading...</div>;
  }

  return (
    <div className="vp-wrapper">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick />
      <div className="vp-container">
        <div className="vp-product-card">
          <div className="vp-product-image">
            <Image
              src={`https://localhost:5000/products/${product.productImage}`}
              alt={product.productName}
              preview={false}
            />
          </div>
          <div className="vp-product-info">
            <h1 className="vp-title">{product.productName}</h1>
            <p className="vp-price">Rs {product.productPrice}</p>
            <p className="vp-description">{product.productDescription}</p>
            <div className="vp-meta">
              
              <span>Date Added: {new Date(product.createdAt).toLocaleDateString()}</span>
              <span>Views: {product.views}</span>
            </div>
            <div className="vp-actions">
              <div className="vp-quantity-controls">
                <Button onClick={decreaseQuantity} type="primary">-</Button>
                <span className="vp-quantity">{quantity}</span>
                <Button onClick={increaseQuantity} type="primary">+</Button>
              </div>
              <div className="vp-cart-buttons">
                <Button onClick={handleAddToCart} type="primary" className="vp-add-to-cart">Add to Cart</Button>
                <Button onClick={handleProceedToPayment} type="primary" className="vp-buy-now">Buy Now</Button>
              </div>
            </div>
          </div>
        </div>
        <div className="vp-reviews-section">
          <div className="vp-review-form">
            <h2>Leave a Review</h2>
            <textarea
              className="vp-review-textarea"
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Share your thoughts about this product..."
              rows="4"
            />
            <div className="vp-review-rating">
              <label>Rating:</label>
              <select value={rating} onChange={(e) => setRating(parseInt(e.target.value, 10))}>
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} ★</option>
                ))}
              </select>
            </div>
            <Button onClick={submitReview} type="primary" className="vp-submit-review">Submit Review</Button>
          </div>
          <div className="vp-reviews-list">
            <h2>Customer Reviews</h2>
            <div className="vp-average-rating">
              Average Rating: {averageRating.toFixed(1)} ★
            </div>
            {reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              reviews.map((rev, index) => (
                <div key={index} className="vp-review-item">
                  <p className="vp-review-user">
                    <strong>{rev.userId.firstName} {rev.userId.lastName}</strong>
                  </p>
                  <p className="vp-review-rating">
                    <strong>Rating:</strong> {rev.rating} ★
                  </p>
                  <p className="vp-review-comment">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewProduct;
