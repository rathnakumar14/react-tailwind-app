import { useContext, memo, useMemo, useCallback } from "react";
import { AppContext } from "../context/AppContext";
import FeedbackForm from "./FeedbackForm";
import FeedbackList from "./FeedbackList";
import RatingBreakdown from "./RatingBreakdown";

function Card({
  id,
  title,
  body,
  image,
  openModal,
  onEdit,
  onDelete,
  feedbacks,
  setFeedbacks
}) {
  const { role } = useContext(AppContext);

  // ✅ Memoized feedbacks
  const cardFeedbacks = useMemo(() => {
    return feedbacks[id] || [];
  }, [feedbacks, id]);

  // ⭐ Memoized average rating
  const avgRating = useMemo(() => {
    if (cardFeedbacks.length === 0) return 0;

    const total = cardFeedbacks.reduce(
      (acc, item) => acc + item.rating,
      0
    );

    return (total / cardFeedbacks.length).toFixed(1);
  }, [cardFeedbacks]);

  // ✅ Handlers optimized
  const handleView = useCallback(() => {
    openModal({ id, title, body, image });
  }, [id, title, body, image, openModal]);

  const handleEditClick = useCallback(() => {
    onEdit({ id, title, body, image });
  }, [id, title, body, image, onEdit]);

  const handleDeleteClick = useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);

  return (
    <div className="bg-white dark:bg-slate-800 text-black dark:text-white shadow rounded-xl p-4 space-y-3 transition">

      {/* 🖼 IMAGE */}
      <img
        src={image}
        alt={title}
        className="w-full h-40 object-cover rounded-lg"
      />

      {/* 📌 TITLE */}
      <h2 className="text-xl font-semibold">{title}</h2>

      {/* 📝 DESCRIPTION */}
      <p className="text-gray-600 dark:text-gray-300">{body}</p>

      {/* 🔘 ACTION BUTTONS */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleView}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
        >
          View
        </button>

        {role === "admin" && (
          <>
            <button
              onClick={handleEditClick}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition"
            >
              Edit
            </button>

            <button
              onClick={handleDeleteClick}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
            >
              Delete
            </button>
          </>
        )}
      </div>

      {/* ⭐ RATING SUMMARY */}
      <div>
        <p className="text-sm font-semibold">
          ⭐ {avgRating} ({cardFeedbacks.length} feedbacks)
        </p>
      </div>

      {/* 📊 RATING BREAKDOWN */}
      <RatingBreakdown feedbacks={cardFeedbacks} />

      {/* 📝 FEEDBACK FORM */}
      <FeedbackForm id={id} setFeedbacks={setFeedbacks} />

      {/* 📋 FEEDBACK LIST */}
      <FeedbackList
        feedbacks={cardFeedbacks}
        id={id}
        setFeedbacks={setFeedbacks}
      />
    </div>
  );
}

// ✅ Prevent unnecessary re-renders
export default memo(Card);