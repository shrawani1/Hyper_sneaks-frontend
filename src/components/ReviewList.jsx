// // components/ReviewsList.js
// import React from 'react';

// const ReviewsList = ({ reviews }) => {
//   return (
//     <div className="reviews-list">
//       {reviews.map((review) => (
//         <div key={review._id} className="card p-3 mb-3">
//           <h5>{review.user.firstName} {review.user.lastName}</h5>
//           <p>Rating: {review.rating}</p>
//           <p>{review.comment}</p>
//           <small>{new Date(review.createdAt).toLocaleDateString()}</small>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ReviewsList;
