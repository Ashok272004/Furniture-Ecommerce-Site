import { useEffect, useState } from "react";
import { deleteProduct, getProducts } from "../api/productsApi.js";
import AdminProductList from "../components/AdminProductList.jsx";
import AdminShell from "../components/AdminShell.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function AdminDeleteProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
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
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  async function handleDelete(productId) {
    if (!window.confirm("Delete this product? This action cannot be undone.")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      setDeletingId(productId);
      await deleteProduct(productId);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productId)
      );
      setSuccess("Product deleted successfully.");
    } catch (err) {
      setError(err.message || "Could not delete the product.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminShell title="Delete products">
      {error && <p className="auth-error" role="alert">{error}</p>}
      {success && <p className="admin-success" role="status">{success}</p>}
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <AdminProductList
          products={products}
          onEdit={() => {}}
          onDelete={handleDelete}
          deletingId={deletingId}
          showEdit={false}
        />
      )}
    </AdminShell>
  );
}

export default AdminDeleteProductsPage;
