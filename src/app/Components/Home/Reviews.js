"use client";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useRouter } from "next/navigation";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", quote: "", rating: 0 });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/getReviews?approved=true");
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.quote || !newReview.rating || newReview.rating < 1 || newReview.rating > 5) {
      setMessage("Please fill all fields and select a rating between 1 and 5.");
      return;
    }

    try {
      const res = await fetch("/api/addReview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });
      const data = await res.json();
      if (res.ok) {
        setNewReview({ name: "", quote: "", rating: 0 });
        setShowForm(false);
        setMessage("Review submitted for approval!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setMessage("Failed to submit review.");
    }
  };

  const settings = {
    dots: false,
    infinite: reviews.length > 3,
    autoplay: reviews.length > 3,
    speed: 1000,
    slidesToShow: Math.min(reviews.length, 3),
    slidesToScroll: 1,
    arrows: false,
    autoplaySpeed: 3000,
    lazyLoad: "ondemand",
    cssEase: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    customPaging: () => (
      <div className="w-3 h-3 rounded-full bg-gray-500 hover:bg-red-600 transition-all duration-300" />
    ),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(reviews.length, 1),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(reviews.length, 2),
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="w-full py-12 bg-black text-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-8 sm:mb-10 uppercase tracking-wider animate-fade-in text-gray-100">
          Customer Reviews
        </h2>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-200 mt-4 uppercase tracking-wide text-sm">Loading Reviews...</p>
            </div>
          </div>
        ) : reviews.length > 0 ? (
          <Slider {...settings}>
            {reviews.map((review, index) => (
              <div key={review._id || index} className="px-2">
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg p-6 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all duration-300">
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
                    &quot;{review.quote}&quot;
                  </p>
                  <p className="text-sm sm:text-base font-medium uppercase tracking-tight text-gray-100 text-center">
                    - {review.name}
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-gray-200 text-center">No reviews available.</p>
        )}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded text-gray-200 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all duration-300"
          >
            Add Your Review
          </button>
          <button
            onClick={() => router.push("/reviews")}
            className="px-6 py-2 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded text-gray-200 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all duration-300"
          >
            See All Reviews
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="w-full max-w-2xl p-6 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-200 hover:text-white transition-colors duration-300"
              >
                ✕
              </button>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-center mb-4 uppercase tracking-wide text-gray-100">
              Share Your Feedback
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={newReview.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                required
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
              <textarea
                name="quote"
                value={newReview.quote}
                onChange={handleInputChange}
                placeholder="Your Review"
                required
                rows="3"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
              <select
                name="rating"
                value={newReview.rating}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
              >
                <option value="0">Select Rating</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
              <button
                type="submit"
                className="w-full px-6 py-2 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded text-gray-200 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all duration-300"
              >
                Submit Review
              </button>
            </form>
            {message && (
              <p className="mt-3 text-center text-sm text-gray-200">{message}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Reviews;