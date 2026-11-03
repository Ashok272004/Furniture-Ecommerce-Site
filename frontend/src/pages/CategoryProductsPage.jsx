import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProducts } from "../api/productsApi.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ProductSearch from "../components/ProductSearch.jsx";
import ProductSort from "../components/ProductSort.jsx";
import ProductGrid from "../components/ProductGrid.jsx";

function CategoryProductsPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getProducts()
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch((err) => {
        console.error(err);
        if (active) setError("Could not load products. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [category]);

  const categoryProducts = useMemo(() => {
    const normalizedCategory = category?.trim().toLowerCase();
    return products.filter(
      (product) => product.category?.trim().toLowerCase() === normalizedCategory
    );
  }, [products, category]);

  const availableCategories = useMemo(
    () => [...new Set(products.map((product) => product.category).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [products]
  );
  const selectedCategory = availableCategories.find(
    (item) => item.trim().toLowerCase() === category?.trim().toLowerCase()
  ) || category;

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = categoryProducts.filter(
      (product) =>
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
    );

    return [...filtered].sort((a, b) => {
      if (sortBy === "price-low-high") return Number(a.price) - Number(b.price);
      if (sortBy === "price-high-low") return Number(b.price) - Number(a.price);
      if (sortBy === "name-a-z") return a.name.localeCompare(b.name);
      return 0;
    });
  }, [categoryProducts, search, sortBy]);

  return (
    <>
      <Navbar />

      <main className="category-page">
        <Link className="category-page__back" to="/">
          ← All categories
        </Link>

        <header className="category-page__heading">
          <p className="eyebrow">THE FURNINEST COLLECTION</p>
          <h1>{selectedCategory}</h1>
          <p>Find the right piece to make your space feel like home.</p>
        </header>

        {error ? (
          <p className="products-status products-status--error" role="alert">{error}</p>
        ) : (
          <>
            <div className="category-page__tools">
              <p>{loading ? "Loading furniture..." : `${categoryProducts.length} ${categoryProducts.length === 1 ? "piece" : "pieces"}`}</p>
              <div className="category-page__controls">
                <label className="category-page__category-picker">
                  <span>Category</span>
                  <select
                    value={selectedCategory}
                    onChange={(event) => navigate(`/category/${encodeURIComponent(event.target.value)}`)}
                    disabled={availableCategories.length === 0}
                  >
                    {availableCategories.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>

                <ProductSearch className="category-page__product-search" value={search} onChange={setSearch} />
                <ProductSort className="category-page__product-sort" value={sortBy} onChange={setSortBy} />
              </div>
            </div>

            <ProductGrid
              products={visibleProducts}
              loading={loading}
              error=""
            />
          </>
        )}
      </main>

      <Footer />
    </>
  );
}

export default CategoryProductsPage;
