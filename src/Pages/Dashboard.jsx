import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Dashboard = () => {
  const { cards, loading, error } = useContext(AppContext);
  const { isLoggedIn, setIsLoggedIn } = useContext(AppContext);

  const recentCards = cards.slice(0, 6);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Total Cards */}
      <div className="mb-6 p-4 bg-blue-400 rounded">
        <h2 className="text-xl font-semibold">
          Total Cards: {cards.length}
        </h2>
      </div>

      {/* Recent Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Recent Cards</h2>

        {recentCards.length === 0 ? (
          <p>No recent cards</p>
        ) : (
          <ul className="space-y-2">
            {recentCards.map((card) => (
              <li
                key={card.id}
                className="p-3 bg-gray-100 rounded shadow"
              >
                {card.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;