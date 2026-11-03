import { Link } from "react-router-dom";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function AdminShell({ title, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <main className="admin-page">Checking your account...</main>;
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <>
        <Navbar />
        <main className="admin-page">
          <h1>Admin access required</h1>
          <p>Sign in with an admin account to manage the store.</p>
          <Link className="admin-action-link" to="/login">
            Login
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="admin-page">
        <p className="eyebrow">STORE MANAGEMENT</p>
        <h1>{title}</h1>

        <nav className="admin-subnav" aria-label="Admin pages">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/products/add">Add product</Link>
          <Link to="/admin/products/manage">Update products</Link>
          <Link to="/admin/products/delete">Delete products</Link>
          <Link to="/admin/products/stock">Stock tracking</Link>
          <Link to="/admin/orders">Orders</Link>
        </nav>

        {children}
      </main>
      <Footer />
    </>
  );
}

export default AdminShell;
