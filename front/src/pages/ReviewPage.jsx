import React, { useState } from "react";

const ReviewPage = () => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [likedReviews, setLikedReviews] = useState([]);

  const handleRating = (rating) => {
    setSelectedRating(rating);
  };

  const toggleLike = (index) => {
    setLikedReviews((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const reviews = [
    {
      name: "John Doe",
      description: "The journey was excellent! The team is super professional.",
      rating: 5,
    },
    {
      name: "Jane Smith",
      description: "Found some minor issues, but overall a good experience.",
      rating: 3,
    },
    {
      name: "Alan Brown",
      description: "The risk management needs improvement.",
      rating: 1,
    },
    {
      name: "Emily Clark",
      description: "Perfect service, highly recommended!",
      rating: 5,
    },
    {
      name: "Chris Lee",
      description: "The ride was smooth, but the app could use improvements.",
      rating: 2,
    },
  ];

  return (
    <div className="bg-gray-900 text-gray-100 font-sans min-h-screen p-5">
      <div className="flex flex-col md:flex-row">
        {/* Review Form Section */}
        <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg mr-4">
          <h2 className="text-2xl font-bold mb-4">Share Your Review</h2>
          <form>
            <label htmlFor="risk" className="block text-lg mb-2">
              Review Type
            </label>
            <select
              id="risk"
              className="w-full p-3 bg-gray-700 text-gray-200 rounded mb-4"
            >
              <option value="none">Positive</option>
              <option value="minor">Negative</option>
            </select>

            <label htmlFor="journey" className="block text-lg mb-2">
              Review Description
            </label>
            <textarea
              id="journey"
              className="w-full p-3 bg-gray-700 text-gray-200 rounded mb-4"
              rows="4"
              placeholder="Share your experience"
              required
            ></textarea>

            <label htmlFor="rating" className="block text-lg mb-2">
              Rate Us:
            </label>
            <div className="flex mb-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <span
                  key={rating}
                  className={`star text-2xl cursor-pointer ${
                    selectedRating >= rating
                      ? "text-yellow-400"
                      : "text-gray-500"
                  }`}
                  onClick={() => handleRating(rating)}
                >
                  &#9733;
                </span>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-gray-600 p-3 text-white rounded hover:bg-gray-500"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Previous Reviews Section */}
        <div className="w-full md:w-2/5 bg-opacity-50 bg-white bg-blur-md p-6 rounded-lg shadow-lg mt-6 md:mt-0 previous-reviews">
          <h3 className="text-xl font-bold text-center mb-4">
            Previous Reviews
          </h3>
          <div className="review-container">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="review-item bg-gray-800 p-4 rounded mb-4"
              >
                <h4 className="text-lg font-semibold">{review.name}</h4>
                <p className="text-sm mb-2">{review.description}</p>
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star text-2xl ${
                          star <= review.rating
                            ? "text-yellow-400"
                            : "text-gray-500"
                        }`}
                      >
                        &#9733;
                      </span>
                    ))}
                  </div>
                  <button
                    className={`like-btn ml-4 text-lg ${
                      likedReviews.includes(index)
                        ? "text-pink-400"
                        : "text-gray-400"
                    }`}
                    onClick={() => toggleLike(index)}
                  >
                    Like
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
