import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/productsApi.js";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Footer from "../components/Footer.jsx";
import { resolveImageUrl } from "../api/imageUrl.js";

const featuredFurnitureCategories = [
  "Seating",
  "Tables",
  "Storage",
  "Beds & Bedroom",
  "Desks & Office",
  "TV & Media Units",
  "Outdoor Furniture",
  "Lighting & Decor",
];

const homeFaqs = [
  ["How do I browse a furniture category?", "Choose a category card to open its own page. There, you can search and sort the products in that category."],
  ["Which payment options can I use?", "Choose Cash on Delivery or Razorpay online checkout during checkout."],
  ["Where can I track my order?", "Sign in and open My Orders to see your order status and items."],
  ["Where can I find product measurements and care details?", "Open a product page. Material, dimensions, care, and assembly information appear when they have been added for that item."],
];

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => {
        console.error(err);
        setError("Could not load products. Please check that the backend is running.");
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  const allCategoryNames = [
    ...featuredFurnitureCategories,
    ...categories.filter((category) => !featuredFurnitureCategories.includes(category)),
  ];

  const categoryCards = allCategoryNames.map((category) => {
    const categoryProducts = products.filter((product) => product.category === category);
    const imageProduct = categoryProducts.find((product) => product.imageUrl);

    return {
      name: category,
      count: categoryProducts.length,
      available: categoryProducts.length > 0,
      image: imageProduct ? resolveImageUrl(imageProduct.imageUrl) : "",
    };
  });

  return (
    <>
      <Navbar />

      <main className="home-page">
        <Hero />

        <section className="shop-categories" aria-labelledby="shop-categories-title">
            <div className="shop-categories__heading">
              <div>
                <p className="eyebrow">A PLACE FOR EVERY PIECE</p>
                <h2 id="shop-categories-title">Shop by <em>category.</em></h2>
              </div>
              <p>Explore furniture for lounging, dining, working, and making the most of every space.</p>
            </div>

            {error && <p className="products-status products-status--error">{error}</p>}

            <div className="shop-categories__grid">
              {categoryCards.map((category, index) => (
                <Link
                  className="shop-category-card"
                  to={`/category/${encodeURIComponent(category.name)}`}
                  key={category.name}
                  aria-disabled={!category.available}
                  style={{
                    "--category-fallback": [
                      "linear-gradient(135deg, #7f8974, #39483e)",
                      "linear-gradient(135deg, #a18c72, #514536)",
                      "linear-gradient(135deg, #7a8587, #384649)",
                      "linear-gradient(135deg, #a27d72, #503b3c)",
                      "linear-gradient(135deg, #828b74, #414638)",
                      "linear-gradient(135deg, #867b70, #433b37)",
                      "linear-gradient(135deg, #71817b, #34463f)",
                      "linear-gradient(135deg, #8c806e, #493f35)",
                    ][index % 8],
                    ...(category.image ? { "--category-image": `url("${category.image}")` } : {}),
                  }}
                  onClick={(event) => {
                    if (!category.available) {
                      event.preventDefault();
                    }
                  }}
                >
                  <span className="shop-category-card__number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="shop-category-card__content">
                    <span>{loading ? "Loading products..." : category.available ? `${category.count} ${category.count === 1 ? "piece" : "pieces"}` : "Coming soon"}</span>
                    <strong>{category.name}</strong>
                    <span className="shop-category-card__link">{category.available ? "Explore category" : loading ? "Please wait" : "Adding more soon"} <span aria-hidden="true">{category.available ? "↗" : loading ? "…" : "· · ·"}</span></span>
                  </span>
                </Link>
              ))}
            </div>
        </section>

        <section className="about-section" id="about" aria-labelledby="about-title">
          <div className="about-section__intro">
            <p className="eyebrow">ABOUT FURNINEST</p>
            <h2 id="about-title">A more comfortable <em>kind of home.</em></h2>
            <p className="about-section__copy">
              At FurniNest, we believe the right furniture makes everyday life feel a little better.
              We bring together thoughtfully selected pieces for living rooms, bedrooms, and workspaces,
              making it easier to create a home that feels comfortable, useful, and truly yours.
            </p>
            <p className="about-section__copy about-section__copy--secondary">
              From discovering a piece to placing your order, we keep the experience simple so you can
              focus on making your space your own.
            </p>
          </div>

          <div className="about-section__values">
            <article className="about-value">
              <span className="about-value__number">01</span>
              <div>
                <h3>Thoughtful design</h3>
                <p>Furniture selected to bring warmth and character to your space.</p>
              </div>
            </article>
            <article className="about-value">
              <span className="about-value__number">02</span>
              <div>
                <h3>Everyday comfort</h3>
                <p>Practical pieces made to fit the rhythm of daily living.</p>
              </div>
            </article>
            <article className="about-value">
              <span className="about-value__number">03</span>
              <div>
                <h3>Easy shopping</h3>
                <p>A clear, convenient way to find the right piece for your home.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="home-faq" id="faq" aria-labelledby="home-faq-title">
          <div className="home-faq__intro">
            <p className="eyebrow">A LITTLE HELP</p>
            <h2 id="home-faq-title">Good to <em>know.</em></h2>
            <p>Quick answers to help you choose, order, and follow your furniture.</p>
            <Link to="/help">Visit the Help Center <span aria-hidden="true">↗</span></Link>
          </div>

          <div className="home-faq__list">
            {homeFaqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

export default HomePage;




