import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../api/ordersApi.js";
import { getProducts } from "../api/productsApi.js";
import AdminShell from "../components/AdminShell.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const adminSections = [
  {
    title: "Add a product",
    description: "Create a new furniture listing and upload its image.",
    link: "/admin/products/add",
    action: "Add product",
  },
  {
    title: "Update products",
    description: "Edit product details and replace product images.",
    link: "/admin/products/manage",
    action: "Update products",
  },
  {
    title: "Delete products",
    description: "Review product listings and remove selected products.",
    link: "/admin/products/delete",
    action: "Delete products",
  },
  {
    title: "Stock tracking",
    description: "Review inventory and identify low or out-of-stock items.",
    link: "/admin/products/stock",
    action: "Track stock",
  },
  {
    title: "Customer orders",
    description: "Review orders, payment details, and delivery status.",
    link: "/admin/orders",
    action: "View orders",
  },
];

function AdminPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    lowStock: 0,
    outOfStock: 0,
    awaitingFulfillment: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;

    let active = true;

    Promise.all([getProducts(), getOrders()])
      .then(([productsResponse, ordersResponse]) => {
        const products = Array.isArray(productsResponse) ? productsResponse : [];
        const orders = Array.isArray(ordersResponse) ? ordersResponse : [];

        if (!active) return;

        setStats({
          products: products.length,
          orders: orders.length,
          lowStock: products.filter((product) => {
            const stock = Number(product.stock || 0);
            return stock > 0 && stock <= 5;
          }).length,
          outOfStock: products.filter(
            (product) => Number(product.stock || 0) <= 0
          ).length,
          awaitingFulfillment: orders.filter((order) =>
            ["PLACED", "CONFIRMED"].includes(
              String(order.status || "").toUpperCase()
            )
          ).length,
        });
      })
      .catch((error) => {
        if (active) {
          setStatsError(error.message || "Could not load dashboard summary.");
        }
      })
      .finally(() => {
        if (active) setLoadingStats(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  const statCards = [
    { label: "Products", value: stats.products, link: "/admin/products/manage" },
    { label: "Customer orders", value: stats.orders, link: "/admin/orders" },
    { label: "Low stock", value: stats.lowStock, link: "/admin/products/stock" },
    { label: "Out of stock", value: stats.outOfStock, link: "/admin/products/stock" },
    { label: "Awaiting fulfillment", value: stats.awaitingFulfillment, link: "/admin/orders" },
  ];

  return (
    <AdminShell title="Admin dashboard">
      {statsError && <p className="auth-error" role="alert">{statsError}</p>}

      <section className="admin-dashboard-stats" aria-label="Store summary">
        {statCards.map((card) => (
          <Link className="admin-stat-card" to={card.link} key={card.label}>
            <span>{card.label}</span>
            <strong>{loadingStats ? "—" : card.value}</strong>
          </Link>
        ))}
      </section>

      <section className="admin-dashboard-grid" aria-label="Store management">
        {adminSections.map((section) => (
          <article className="admin-dashboard-card" key={section.link}>
            <h2>{section.title}</h2>
            <p>{section.description}</p>
            <Link className="admin-action-link" to={section.link}>
              {section.action} <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}

export default AdminPage;
