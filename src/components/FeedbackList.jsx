const FeedbackList = ({ feedbacks, id, setFeedbacks }) => {

  const handleDelete = (index) => {
    setFeedbacks(prev => {
      const updated = [...(prev[id] || [])];
      updated.splice(index, 1);

      return {
        ...prev,
        [id]: updated
      };
    });
  };

  if (!feedbacks.length) {
    return <p className="text-gray-500 text-sm">No feedback yet</p>;
  }

  return (
    <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">

      {feedbacks.map((item, index) => (
        <div
          key={index}
          className="border-b pb-2 flex justify-between items-start"
        >
          <div>
            {/* ⭐ Stars */}
            <div className="text-yellow-500 text-sm">
              {"★".repeat(item.rating)}
              {"☆".repeat(5 - item.rating)}
            </div>

            {/* 💬 Comment */}
            <p className="text-sm">{item.comment}</p>
          </div>

          {/* ❌ Delete */}
          <button
            onClick={() => handleDelete(index)}
            className="text-red-500 text-xs"
          >
            Delete
          </button>
        </div>
      ))}

    </div>
  );
};

export default FeedbackList;