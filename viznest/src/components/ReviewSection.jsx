import React, { useState } from 'react';
import { Star, User, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ReviewSection = ({ product, onSubmitReview }) => {
  const { user } = useAuth(); // Auto-fill name if logged in
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [name, setName] = useState(user?.name || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newReview = {
      id: Date.now(),
      user: name || 'Anonymous',
      rating,
      comment,
      date: new Date().toLocaleDateString()
    };

    onSubmitReview(newReview);
    setComment(''); // Reset form
    if (!user) setName('');
  };

  // Safe fallback if no reviews exist yet
  const reviews = product.reviewsList || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <MessageSquare className="text-indigo-600"/> Customer Reviews ({reviews.length})
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT: REVIEW LIST */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No reviews yet. Be the first to write one!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs">
                      {review.user.charAt(0)}
                    </div>
                    <span className="font-bold text-gray-900">{review.user}</span>
                  </div>
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>
                <div className="flex text-yellow-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
              </div>
            ))
          )}
        </div>

        {/* RIGHT: ADD REVIEW FORM */}
        <div className="bg-gray-50 p-6 rounded-xl h-fit">
          <h3 className="font-bold text-gray-900 mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Star Rating Input */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <Star size={24} fill="currentColor" />
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-gray-400"/>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
            </div>

            {/* Comment Input */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Review</label>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="3"
                placeholder="How was the product quality?"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2">
              <Send size={18}/> Submit Review
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ReviewSection;