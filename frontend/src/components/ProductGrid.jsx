import ProductCard from "./ProductCard.jsx";

function ProductGrid({ products, loading, error }) {
  if (loading) {
    return <p className="products-status">Loading products…</p>;
  }

  if (error) {
    return <p className="products-status products-status--error">{error}</p>;
  }

  if (products.length === 0) {
    return <p className="products-status">No products found.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;