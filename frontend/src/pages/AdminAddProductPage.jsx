import { useState } from "react";
import { createProduct, uploadProductImage } from "../api/productsApi.js";
import AdminProductForm from "../components/AdminProductForm.jsx";
import AdminShell from "../components/AdminShell.jsx";

function AdminAddProductPage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formKey, setFormKey] = useState(0);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const imageFile = formData.get("imageFile");

    const product = {
      name: formData.get("name"),
      category: formData.get("category"),
      description: formData.get("description"),
      material: formData.get("material"),
      dimensions: formData.get("dimensions"),
      careInstructions: formData.get("careInstructions"),
      assemblyInfo: formData.get("assemblyInfo"),
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      imageUrl: "",
    };

    try {
      setSubmitting(true);

      if (imageFile instanceof File && imageFile.size > 0) {
        const uploadResult = await uploadProductImage(imageFile);
        product.imageUrl = uploadResult.imageUrl;
      }

      await createProduct(product);
      setSuccess("Product added successfully.");
      form.reset();
      setFormKey((currentKey) => currentKey + 1);
    } catch (err) {
      setError(err.message || "Could not add the product.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminShell title="Add a product">
      {error && <p className="auth-error" role="alert">{error}</p>}
      {success && <p className="admin-success" role="status">{success}</p>}
      <AdminProductForm
        key={formKey}
        initialProduct={null}
        onSubmit={handleSubmit}
        onCancel={() => {}}
        submitting={submitting}
      />
    </AdminShell>
  );
}

export default AdminAddProductPage;
