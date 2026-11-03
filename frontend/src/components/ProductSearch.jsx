function ProductSearch({ value, onChange, className = "" }) {
  return (
    <label className={`product-search ${className}`.trim()}>
      <span className="product-search__label">Search furniture</span>

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="e.g., chair, table, sofa"
      />
    </label>
  );
}

export default ProductSearch;
