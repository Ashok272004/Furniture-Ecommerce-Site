import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/productsApi.js";
import AdminProductList from "../components/AdminProductList.jsx";
import AdminShell from "../components/AdminShell.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function AdminManageProductsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;

    let active = true;

    getProducts()
      .then((data) => {
        if (active) setProducts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (active) setError(err.message || "Could not load products.");
      })
      .finally(() => {
        if (active) setLoadingProducts(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  return (
    <AdminShell title="Update products">
      <section className="admin-products-section">
        <p className="admin-section-description">
          Choose Edit to update a product on its own page.
        </p>
        {error && <p className="auth-error" role="alert">{error}</p>}
        {success && <p className="admin-success" role="status">{success}</p>}
        {loadingProducts ? (
          <p>Loading products...</p>
        ) : (
          <AdminProductList
            products={products}
            onEdit={(product) => navigate(`/admin/products/${product.id}/edit`)}
            showDelete={false}
          />
        )}
      </section>
    </AdminShell>
  );
}

export default AdminManageProductsPage;
