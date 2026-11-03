import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import HomePage from "./pages/HomePage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx";
import ProductDetailsPage from "./pages/ProductDetailsPage.jsx";
import CategoryProductsPage from "./pages/CategoryProductsPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import MyOrdersPage from "./pages/MyOrdersPage.jsx";
import AdminAddProductPage from "./pages/AdminAddProductPage.jsx";
import AdminManageProductsPage from "./pages/AdminManageProductsPage.jsx";
import AdminEditProductPage from "./pages/AdminEditProductPage.jsx";
import AdminStockPage from "./pages/AdminStockPage.jsx";
import AdminOrdersPage from "./pages/AdminOrdersPage.jsx";
import AdminDeleteProductsPage from "./pages/AdminDeleteProductsPage.jsx";
import InformationPage from "./pages/InformationPage.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
// import "./App.css";

function ScrollToDestination() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (hash) {
        const targetId = decodeURIComponent(hash.slice(1));
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }

      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <ScrollToDestination />
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            <Route path="/category/:category" element={<CategoryProductsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/help" element={<InformationPage />} />
            <Route path="/sitemap" element={<InformationPage />} />
            <Route path="/legal/:document" element={<InformationPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/products/add" element={<AdminAddProductPage />} />
            <Route path="/admin/products/manage" element={<AdminManageProductsPage />} />
            <Route path="/admin/products/delete" element={<AdminDeleteProductsPage />} />
            <Route path="/admin/products/stock" element={<AdminStockPage />} />
            <Route path="/admin/products/:id/edit" element={<AdminEditProductPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route
              path="*"
              element={
                <main className="not-found">
                  <h1>Page not available</h1>
                  <a href="/">Return to Home Page</a>
                </main>
              }
            />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
    
  );
}

export default App;

