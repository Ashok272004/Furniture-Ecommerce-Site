import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./styles/global.css";
import "./styles/navbar.css";
import "./styles/hero.css";
import "./styles/product.css";
import "./styles/footer.css";
import "./styles/cart.css";
import "./styles/checkout.css";
import "./styles/search.css";
import "./styles/product-details.css";
import "./styles/auth.css";
import "./styles/admin.css";
import "./styles/themes.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
