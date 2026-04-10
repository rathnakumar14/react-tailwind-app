import { useState } from "react";
import Rating from "./Rating";

const FeedbackForm = ({ id, setFeedbacks }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (rating === 0 || comment.trim() === "") {
      setError("Please give rating and feedback");
      return;
    }

    const newFeedback = { rating, comment };

    setFeedbacks((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), newFeedback],
    }));

    setRating(0);
    setComment("");
    setError("");
  };

  return (
    <div className="mt-3">

      <Rating rating={rating} setRating={setRating} />

      <textarea
        placeholder="Give a feedback..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="border p-2 rounded w-full mt-2"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleSubmit}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded mt-2"
      >
        Submit
      </button>
    </div>
  );
};

export default FeedbackForm;