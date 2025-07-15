import React, { useState } from "react";
import { getalltenderquery, reviewTender } from "../../api/tender";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const StarRating = ({ tenderId }) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [loadingReview, setLoadingReview] = useState(false);
  const { refetch: refetchTenders } = getalltenderquery();
  const showToast = (message, type = "error") => {
    toast[type](message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const handleStarClick = (rating) => setSelectedRating(rating);

  const handleReviewClick = async () => {
    setLoadingReview(true);
    try {
      await reviewTender(tenderId, { rating: selectedRating });
      refetchTenders();
      showToast("Tender Reviewed Successfully", "success");
    } catch (error) {
      toast.error("Error reviewing tender");
    } finally {
      setLoadingReview(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-2">
      <div className="mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`text-2xl ${
              star <= selectedRating ? "text-yellow-500" : "text-gray-300"
            } focus:outline-none`}
            onClick={() => handleStarClick(star)}
          >
            ★
          </button>
        ))}
      </div>
      <button
        onClick={handleReviewClick}
        className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600"
        disabled={loadingReview}
      >
        {loadingReview ? "Reviewing..." : "Review"}
      </button>
    </div>
  );
};

export default StarRating;
