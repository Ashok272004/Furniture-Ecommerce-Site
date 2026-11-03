import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../api/productsApi.js";
import AdminShell from "../components/AdminShell.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function AdminStockPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;

    let active = true;

    getProducts()
      .then((data) => {
        if (active) setProducts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (active) setError(err.message || "Could not load stock.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  const stockCounts = useMemo(() => ({
    total: products.length,
    low: products.filter((product) => product.stock > 0 && product.stock <= 5).length,
    out: products.filter((product) => product.stock <= 0).length,
  }), [products]);

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => Number(a.stock) - Number(b.stock)),
    [products]
  );

  return (
    <AdminShell title="Stock tracking">
      <div className="admin-stock-summary">
        <article><span>Products</span><strong>{stockCounts.total}</strong></article>
        <article><span>Low stock (5 or fewer)</span><strong>{stockCounts.low}</strong></article>
        <article><span>Out of stock</span><strong>{stockCounts.out}</strong></article>
      </div>

      {error && <p className="auth-error" role="alert">{error}</p>}
      {loading ? (
        <p>Loading stock...</p>
      ) : sortedProducts.length === 0 ? (
        <p className="admin-empty">No products found.</p>
      ) : (
        <div className="admin-stock-table">
          <table>
            <thead>
              <tr><th>Product</th><th>Category</th><th>Available stock</th><th>Inventory status</th></tr>
            </thead>
            <tbody>
              {sortedProducts.map((product) => {
                const stock = Number(product.stock || 0);
                const status = stock <= 0 ? "Out of stock" : stock <= 5 ? "Low stock" : "In stock";
                const statusClass = stock <= 0 ? "out" : stock <= 5 ? "low" : "available";

                return (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category || "Uncategorized"}</td>
                    <td>{stock}</td>
                    <td><span className={`admin-stock-badge admin-stock-badge--${statusClass}`}>{status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}

export default AdminStockPage;
