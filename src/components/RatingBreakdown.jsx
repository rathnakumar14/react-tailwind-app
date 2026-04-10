const RatingBreakdown = ({ feedbacks }) => {
  const total = feedbacks.length;

  const getCount = (star) =>
    feedbacks.filter((f) => f.rating === star).length;

  return (
    <div className="mt-2 space-y-1">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = getCount(star);
        const percent = total ? (count / total) * 100 : 0;

        return (
          <div key={star} className="flex items-center gap-2 text-sm">
            <span className="w-6">{star}★</span>

            <div className="flex-1 bg-gray-200 h-2 rounded">
              <div
                className="bg-yellow-400 h-2 rounded"
                style={{ width: `${percent}%` }}
              />
            </div>

            <span>{count}</span>
          </div>
        );
      })}
    </div>
  );
};

export default RatingBreakdown;