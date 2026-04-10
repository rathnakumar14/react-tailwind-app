import { createContext, useContext, useState } from "react";

// ✅ EXPORT CONTEXT (IMPORTANT FIX)
export const NotificationContext = createContext();

// ✅ PROVIDER
export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // 🔥 SHOW TOAST
  const showToast = (message, type = "info") => {
    const id = Date.now() + Math.random();

    const newToast = { id, message, type };

    // Limit max 5 toasts
    setToasts((prev) => [...prev.slice(-4), newToast]);

    // Auto remove after 3 sec
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  // ❌ REMOVE TOAST
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showToast }}>
      {children}

      {/* 🔔 TOAST UI */}
      <div className="fixed top-5 right-5 space-y-3 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded shadow-lg text-white flex justify-between items-center gap-3 min-w-62.5
              ${
                toast.type === "success"
                  ? "bg-green-500"
                  : toast.type === "error"
                  ? "bg-red-500"
                  : toast.type === "warning"
                  ? "bg-yellow-500"
                  : "bg-blue-500"
              }`}
          >
            <span>{toast.message}</span>

            <button
              onClick={() => removeToast(toast.id)}
              className="font-bold ml-2"
            >
              ✖
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

// ✅ CUSTOM HOOK
export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }

  return context;
};