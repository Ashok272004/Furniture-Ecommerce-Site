import { useEffect, useState } from "react";
import { resolveImageUrl } from "../api/imageUrl.js";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 5 * 1024 * 1024;

function AdminProductForm({
  onSubmit,
  submitting,
  initialProduct,
  onCancel,
}) {
  const editing = Boolean(initialProduct);

  const [previewUrl, setPreviewUrl] = useState(() =>
    initialProduct?.imageUrl
      ? resolveImageUrl(initialProduct.imageUrl)
      : ""
  );
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    setImageError("");

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setImageError("Choose a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > maxFileSize) {
      setImageError("Image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
  }

  return (
    <form className="admin-product-form" onSubmit={onSubmit}>
      <label>
        Product name
        <input
          name="name"
          required
          maxLength={150}
          defaultValue={initialProduct?.name || ""}
        />
      </label>

      <label>
        Category
        <input
          name="category"
          required
          placeholder="Seating, Tables, Storage"
          defaultValue={initialProduct?.category || ""}
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={initialProduct?.description || ""}
        />
      </label>

      <label>
        Material
        <input
          name="material"
          maxLength={255}
          placeholder="Example: Solid acacia wood"
          defaultValue={initialProduct?.material || ""}
        />
      </label>

      <label>
        Dimensions
        <input
          name="dimensions"
          maxLength={255}
          placeholder="Example: W 120 × D 60 × H 75 cm"
          defaultValue={initialProduct?.dimensions || ""}
        />
      </label>

      <label>
        Care instructions
        <textarea
          name="careInstructions"
          rows={3}
          maxLength={1000}
          placeholder="Add product care guidance"
          defaultValue={initialProduct?.careInstructions || ""}
        />
      </label>

      <label>
        Assembly information
        <textarea
          name="assemblyInfo"
          rows={3}
          maxLength={1000}
          placeholder="Add assembly information, if required"
          defaultValue={initialProduct?.assemblyInfo || ""}
        />
      </label>

      <label>
        Price
        <input
          name="price"
          type="number"
          min="0.01"
          step="0.01"
          required
          defaultValue={initialProduct?.price ?? ""}
        />
      </label>

      <label>
        Stock quantity
        <input
          name="stock"
          type="number"
          min="0"
          step="1"
          required
          defaultValue={initialProduct?.stock ?? ""}
        />
      </label>

      <label>
        Product image
        <input
          name="imageFile"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required={!editing}
          onChange={handleImageChange}
        />
      </label>

      {imageError && (
        <p className="auth-error" role="alert">
          {imageError}
        </p>
      )}

      {previewUrl && (
        <div className="admin-product-form__preview">
          <span>Image preview</span>
          <img
            src={previewUrl}
            alt={initialProduct?.name || "Selected product"}
          />
        </div>
      )}

      <button type="submit" disabled={submitting || Boolean(imageError)}>
        {submitting
          ? "Saving product..."
          : editing
            ? "Update product"
            : "Add product"}
      </button>

      {editing && (
        <button type="button" onClick={onCancel}>
          Cancel edit
        </button>
      )}
    </form>
  );
}

export default AdminProductForm;
