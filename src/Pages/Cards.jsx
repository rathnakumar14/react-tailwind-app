import Card from "../components/Card";
import {
  useState,
  useEffect,
  useContext,
  useRef,
  useMemo,
  useCallback
} from "react";
import Modal from "../components/modal";
import { AppContext } from "../context/AppContext";
import { useNotification } from "../context/NotificationContext";
import {
  getCards,
  createCard,
  updateCard,
  deleteCard
} from "../Services/Api";

const Cards = () => {

  const { theme, role, cards, setCards } = useContext(AppContext);
  const { showToast } = useNotification();

  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [feedbacks, setFeedbacks] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(3);
  const [selectedCard, setSelectedCard] = useState(null);
  const [editId, setEditId] = useState(null);
  const [sortOrder, setSortOrder] = useState("");

  const [notification, setNotification] = useState(false);

  const prevCardsRef = useRef([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: ""
  });

  // 🔍 CHANGE DETECTION
  const hasNewData = (oldData, newData) => {
    const oldIds = oldData.map(c => c.id);
    const newIds = newData.map(c => c.id);
    return newIds.some(id => !oldIds.includes(id));
  };

  // 📡 FETCH CARDS
  const fetchCards = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);
      else setIsFetching(true);

      const data = await getCards();

      const updated = data.slice(0, 6).map(item => ({
        ...item,
        image: `https://picsum.photos/300/200?random=${item.id}`
      }));

      if (prevCardsRef.current.length === 0) {
        setCards(updated);
      } else if (hasNewData(prevCardsRef.current, updated)) {
        setNotification(true);
        setCards(updated);
        showToast("New data available 🚀", "info");
      }

      prevCardsRef.current = updated;

    } catch (err) {
      setError(err.message);
      showToast("Failed to fetch cards ❌", "error");
    } finally {
      if (showLoader) setLoading(false);
      else setIsFetching(false);
    }
  }, [setCards, showToast]);

  // 🚀 INITIAL LOAD
  useEffect(() => {
    fetchCards(true);
  }, [fetchCards]);

  // 🔁 POLLING (optimized interval)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCards();
    }, 2000); // 🔥 improved (20 sec)

    return () => clearInterval(interval);
  }, [fetchCards]);

  // 🔔 AUTO HIDE TOP BAR
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // 🔄 REFRESH
  const handleRefresh = useCallback(() => {
    fetchCards(true);
    setNotification(false);
    showToast("Cards refreshed 🔄", "info");
  }, [fetchCards, showToast]);

  // ❌ DELETE
  const handleDelete = useCallback(async (id) => {
    try {
      await deleteCard(id);
      setCards(prev => prev.filter(card => card.id !== id));
      showToast("Card deleted 🗑️", "warning");
    } catch (err) {
      setError(err.message);
      showToast("Delete failed ❌", "error");
    }
  }, [setCards, showToast]);

  // ✏️ EDIT
  const handleEdit = useCallback((card) => {
    setFormData({
      title: card.title,
      description: card.body,
      image: card.image
    });
    setEditId(card.id);
  }, []);

  // ➕ CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ VALIDATION (ADDED)
    if (!formData.title || !formData.description) {
      showToast("Please fill all fields ❌", "error");
      return;
    }

    try {
      if (editId) {
        const updatedCard = await updateCard(editId, {
          title: formData.title,
          body: formData.description,
          image: formData.image
        });

        setCards(cards.map(card =>
          card.id === editId
            ? { ...updatedCard, image: formData.image }
            : card
        ));

        setEditId(null);
        showToast("Card updated ✏️", "success");

      } else {
        const newCard = await createCard({
          title: formData.title,
          body: formData.description,
          image: formData.image
        });

        const newData = [{ ...newCard, image: formData.image }, ...cards];

        setCards(newData);
        setNotification(true);
        prevCardsRef.current = newData;

        showToast("New card added 🎉", "success");
      }

      setFormData({
        title: "",
        description: "",
        image: ""
      });

    } catch (err) {
      setError(err.message);
      showToast("Operation failed ❌", "error");
    }
  };

  // 🔍 SEARCH
  useEffect(() => {
    setIsSearching(true);

    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setIsSearching(false);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const filteredCards = useMemo(() => {
    return cards.filter(card =>
      card.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [cards, debouncedSearch]);

  const sortedCards = useMemo(() => {
    return [...filteredCards].sort((a, b) => {
      if (sortOrder === "asc") return a.title.localeCompare(b.title);
      if (sortOrder === "desc") return b.title.localeCompare(a.title);
      return 0;
    });
  }, [filteredCards, sortOrder]);

  const currentCards = useMemo(() => {
    const indexOfLast = currentPage * cardsPerPage;
    const indexOfFirst = indexOfLast - cardsPerPage;
    return sortedCards.slice(indexOfFirst, indexOfLast);
  }, [sortedCards, currentPage, cardsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(sortedCards.length / cardsPerPage);
  }, [sortedCards, cardsPerPage]);

  if (loading) return <h2 className="text-center mt-10">Loading...</h2>;
  if (error) return <h2 className="text-center text-red-500">{error}</h2>;

  return (
    <div className={`min-h-screen px-4 py-10 ${
      theme === "dark" ? "bg-slate-900 text-white" : "bg-gray-100 text-black"
    }`}>

      {/* 🔔 TOP BAR */}
      {notification && (
        <div className="fixed top-0 left-0 w-full bg-green-500 text-white p-3 text-center z-50 flex justify-center items-center gap-4 shadow-md">
          🚀 New data available!
          <button
            onClick={handleRefresh}
            className="bg-white text-green-600 px-4 py-1 rounded-md font-semibold hover:bg-gray-200"
          >
            Refresh
          </button>
        </div>
      )}

      <h1 className="text-4xl font-bold text-center mb-6">
        Cards Section
      </h1>

      {/* REFRESH */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleRefresh}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg"
        >
          Refresh Data
        </button>
      </div>

      {/* FORM */}
      {role === "admin" && (
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-auto mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e)=>setFormData({...formData, title:e.target.value})}
              className="border p-2 rounded-md"
            />

            <input
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={(e)=>setFormData({...formData, description:e.target.value})}
              className="border p-2 rounded-md"
            />

            <input
              type="text"
              placeholder="Image URL"
              value={formData.image}
              onChange={(e)=>setFormData({...formData, image:e.target.value})}
              className="border p-2 rounded-md"
            />

            <button className="bg-blue-600 text-white p-2 rounded-md">
              {editId ? "Update Card" : "Add Card"}
            </button>

          </form>
        </div>
      )}

      {/* SEARCH + SORT */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="border px-4 py-2 rounded-md w-64"
        />

        {isSearching && (
          <span className="text-blue-500 text-sm">Searching...</span>
        )}

        <select
          value={sortOrder}
          onChange={(e)=>setSortOrder(e.target.value)}
          className="border px-4 py-2 rounded-md"
        >
          <option value="">Sort By</option>
          <option value="asc">A → Z</option>
          <option value="desc">Z → A</option>
        </select>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {currentCards.length > 0 ? (
          currentCards.map(card => (
            <Card
              key={card.id}
              {...card}
              openModal={setSelectedCard}
              onEdit={handleEdit}
              onDelete={handleDelete}
              feedbacks={feedbacks}
              setFeedbacks={setFeedbacks}
            />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No cards found 😢
          </p>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-6 mt-10">
        <button
          onClick={() => setCurrentPage(p => p - 1)}
          disabled={currentPage === 1}
          className="px-5 py-2 text-white bg-blue-500 rounded disabled:bg-gray-400"
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(p => p + 1)}
          disabled={currentPage === totalPages}
          className="px-5 py-2 text-white bg-blue-500 rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>

      {/* MODAL */}
      {selectedCard && (
        <Modal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}

    </div>
  );
};

export default Cards;