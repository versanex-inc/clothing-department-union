"use client";
import React, { useState, useEffect } from "react";

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/getReviews");
        const data = await res.json();
        if (data.reviews) setReviews(data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/getReviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: true }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviews(reviews.map((r) => (r._id === id ? { ...r, approved: true } : r)));
        setMessage("Review approved successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error approving review:", error);
      setMessage("Failed to approve review.");
    }
  };

  const handleDecline = async (id) => {
    try {
      const res = await fetch(`/api/getReviews/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReviews(reviews.filter((r) => r._id !== id));
        setMessage("Review declined successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error declining review:", error);
      setMessage("Failed to decline review.");
    }
  };

  return (
    <section className="w-full py-12 bg-black text-white min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center mb-10 uppercase tracking-wider animate-fade-in text-gray-100">
          Manage Reviews
        </h1>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600 mx-auto"></div>
              <p className="text-gray-200 mt-4">Loading...</p>
            </div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg p-6 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-300"
              >
                <div className="flex justify-center mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-base sm:text-lg text-gray-200 text-center mb-2">
                  "{review.quote}"
                </p>
                <p className="text-sm sm:text-base font-medium uppercase tracking-tight text-gray-100 text-center mb-4">
                  - {review.name}
                </p>
                <div className="flex justify-center gap-4">
                  {!review.approved && (
                    <>
                      <button
                        onClick={() => handleApprove(review._id)}
                        className="px-4 py-2 bg-green-600 rounded text-white hover:bg-green-700 transition-all duration-300"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDecline(review._id)}
                        className="px-4 py-2 bg-red-600 rounded text-white hover:bg-red-700 transition-all duration-300"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {review.approved && (
                    <span className="text-green-400">Approved</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-200 text-center">No reviews to manage.</p>
        )}
        {message && <p className="mt-4 text-center text-sm text-gray-200">{message}</p>}
      </div>
    </section>
  );
};

export default ManageReviews;