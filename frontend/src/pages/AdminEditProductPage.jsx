import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProducts, updateProduct, uploadProductImage } from "../api/productsApi.js";
import AdminProductForm from "../components/AdminProductForm.jsx";
import AdminShell from "../components/AdminShell.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function AdminEditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;

    let active = true;

    getProducts()
      .then((products) => {
        const found = products.find((item) => String(item.id) === id);
        if (active) {
          setProduct(found || null);
          if (!found) setError("Product not found.");
        }
      })
      .catch((err) => {
        if (active) setError(err.message || "Could not load the product.");
      })
      .finally(() => {
        if (active) setLoadingProduct(false);
      });

    return () => {
      active = false;
    };
  }, [id, user]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!product) return;

    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);
    const imageFile = formData.get("imageFile");
    const updatedProduct = {
      name: formData.get("name"),
      category: formData.get("category"),
      description: formData.get("description"),
      material: formData.get("material"),
      dimensions: formData.get("dimensions"),
      careInstructions: formData.get("careInstructions"),
      assemblyInfo: formData.get("assemblyInfo"),
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      imageUrl: product.imageUrl || "",
    };

    try {
      setSubmitting(true);

      if (imageFile instanceof File && imageFile.size > 0) {
        const uploadResult = await uploadProductImage(imageFile);
        updatedProduct.imageUrl = uploadResult.imageUrl;
      }

      const savedProduct = await updateProduct(product.id, updatedProduct);
      setProduct(savedProduct);
      setSuccess("Product updated successfully.");
    } catch (err) {
      setError(err.message || "Could not update the product.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminShell title="Update product">
      {loadingProduct && <p>Loading product...</p>}
      {error && <p className="auth-error" role="alert">{error}</p>}
      {success && <p className="admin-success" role="status">{success}</p>}
      {!loadingProduct && product && (
        <AdminProductForm
          key={product.id}
          initialProduct={product}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/products/manage")}
          submitting={submitting}
        />
      )}
    </AdminShell>
  );
}

export default AdminEditProductPage;
