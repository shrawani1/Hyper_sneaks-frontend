// // components/ReviewForm.js
// import React, { useState } from 'react';
// import { addReviewApi } from '../apis/Api';

// const ReviewForm = ({ productId, fetchReviews }) => {
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const reviewData = { productId, rating, comment };
//     addReviewApi(reviewData)
//       .then(() => {
//         alert('Review added successfully');
//         fetchReviews();
//       })
//       .catch((error) => {
//         console.error('Failed to add review:', error.response ? error.response.data : error.message);
//         alert('Failed to add review');
//       });
// };


//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="form-group">
//         <label>Rating</label>
//         <select value={rating} onChange={(e) => setRating(e.target.value)} className="form-control">
//           <option value="0">Select Rating</option>
//           {[...Array(5)].map((_, i) => (
//             <option key={i + 1} value={i + 1}>
//               {i + 1}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div className="form-group">
//         <label>Comment</label>
//         <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="form-control"></textarea>
//       </div>
//       <button type="submit" className="btn btn-primary">Submit Review</button>
//     </form>
//   );
// };

// export default ReviewForm;
