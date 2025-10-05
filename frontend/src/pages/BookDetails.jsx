import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const fetchBookDetails = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/books/${id}`);
      setBook(data);
    } catch (error) {
      console.error('Failed to fetch book details', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/books/${id}/reviews`, { rating, reviewText });
      setRating(0);
      setReviewText('');
      fetchBookDetails(); // Refresh reviews
    } catch (error) {
      console.error('Failed to submit review', error);
      alert(error.response?.data?.message || 'Error submitting review');
    }
  };
  
  const handleDeleteBook = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
        try {
            await api.delete(`/books/${id}`);
            navigate('/');
        } catch (error) {
            console.error('Failed to delete book', error);
        }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
        try {
            await api.delete(`/reviews/${reviewId}`);
            fetchBookDetails(); // Refresh reviews
        } catch (error) {
            console.error('Failed to delete review', error);
        }
    }
  };


  if (loading) return <p>Loading...</p>;
  if (!book) return <p>Book not found.</p>;

  return (
    <div className="container mx-auto mt-10">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
        <p className="text-xl text-gray-700 mb-4">by {book.author}</p>
        <p className="text-md text-gray-500 mb-4">{book.genre} - Published in {book.year}</p>
        <p className="mb-6">{book.description}</p>
        <p className="font-semibold text-lg">Average Rating: {book.avgRating.toFixed(1)} / 5</p>

        {user && user._id === book.addedBy && (
            <div className="mt-4">
                <button onClick={handleDeleteBook} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete Book</button>
            </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {user && (
          <form onSubmit={handleReviewSubmit} className="mb-8 p-4 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Write a Review</h3>
            <div className="mb-2">
              <label>Rating:</label>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="ml-2 p-1 border rounded" required>
                <option value={0} disabled>Select Rating</option>
                <option value={1}>1 - Poor</option>
                <option value={2}>2 - Fair</option>
                <option value={3}>3 - Good</option>
                <option value={4}>4 - Very Good</option>
                <option value={5}>5 - Excellent</option>
              </select>
            </div>
            <div className="mb-2">
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Your review..."
                className="w-full p-2 border rounded"
                rows="4"
                required
              ></textarea>
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Submit Review</button>
          </form>
        )}
        <div className="space-y-4">
          {book.reviews.length > 0 ? (
            book.reviews.map((review) => (
              <div key={review._id} className="border p-4 rounded-lg bg-gray-50 relative">
                <p className="font-bold">{review.user.name}</p>
                <p>Rating: {review.rating} / 5</p>
                <p className="mt-2">{review.reviewText}</p>
                {user && user._id === review.userId && (
                    <button onClick={() => handleDeleteReview(review._id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                        Delete
                    </button>
                )}
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;