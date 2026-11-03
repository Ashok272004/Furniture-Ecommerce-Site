function CategoryFilter({ categories, value, onChange }) {
  return (
    <label className="category-filter">
      <span>Category</span>

      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="All">All furniture</option>

        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </label>
  );
}

export default CategoryFilter;