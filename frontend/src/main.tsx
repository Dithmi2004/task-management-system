import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";

createRoot(
  document.getElementById("root")!
).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          closeOnClick
          pauseOnHover
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
