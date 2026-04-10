import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { AppProvider } from "./context/AppContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx"; // ✅ FIXED

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </AppProvider>
  </React.StrictMode>
);