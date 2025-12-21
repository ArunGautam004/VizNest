import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ReviewSection = ({ product, onAddReview }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newReview = {
      id: Date.now(),
      user: user?.name || 'Guest',
      rating,
      comment,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    onAddReview(newReview);
    setComment('');
  };

  const reviews = product.reviewsList || [];

  return (
    <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-8">Customer Reviews ({reviews.length})</h2>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6 max-h-96 overflow-y-auto">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reviews yet. Be the first!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex justify-between mb-2">
                  <span className="font-bold">{review.user}</span>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <div className="flex mb-2">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} size={16} className={i <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Your Rating</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((star) => (
                <button type="button" key={star} onClick={() => setRating(star)}>
                  <Star size={28} className={star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="5"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Share your experience..."
              required
            />
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2">
            <Send size={18} /> Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewSection;