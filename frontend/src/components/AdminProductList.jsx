function AdminProductList({
  products,
  onEdit,
  onDelete,
  deletingId,
  showEdit = true,
  showDelete = true,
}) {
  if (products.length === 0) {
    return <p className="admin-empty">No products found.</p>;
  }

  return (
    <div className="admin-product-list">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.category || "Uncategorized"}</td>
              <td>₹{Number(product.price).toLocaleString("en-IN")}</td>
              <td>{product.stock}</td>
              <td className="admin-product-list__actions">
                {showEdit && (
                  <button type="button" onClick={() => onEdit(product)}>
                    Edit
                  </button>
                )}
                {showDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(product.id)}
                    disabled={deletingId === product.id}
                  >
                    {deletingId === product.id ? "Deleting..." : "Delete"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProductList;
