function ProductSort({ value, onChange, className = "" }) {
  return (
    <label className={`product-sort ${className}`.trim()}>
      <span>Sort by</span>

      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="featured">Featured</option>
        <option value="price-low-high">Price: Low to High</option>
        <option value="price-high-low">Price: High to Low</option>
        <option value="name-a-z">Name: A to Z</option>
      </select>
    </label>
  );
}

export default ProductSort;
