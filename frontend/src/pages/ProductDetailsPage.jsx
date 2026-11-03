import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../api/productsApi.js";
import { useCart } from "../context/CartContext.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { resolveImageUrl } from "../api/imageUrl.js";

function ProductDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const specifications = product
    ? [
        ["Material", product.material],
        ["Dimensions", product.dimensions],
        ["Care", product.careInstructions],
        ["Assembly", product.assemblyInfo],
      ].filter(([, value]) => value?.trim())
    : [];

  useEffect(() => {
    getProductById(id)
      .then(setProduct)
      .catch((err) => {
        console.error(err);
        setError("Product not found.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <Navbar />

      <main className="product-details">
        <Link className="product-details__back" to="/">
          ← Back to shop
        </Link>

        {loading && <p>Loading product…</p>}
        {error && <p role="alert">{error}</p>}

        {product && (
          <section className="product-details__content">
            <div className="product-details__image">
              {product.imageUrl ? (
                <img src={resolveImageUrl(product.imageUrl)} alt={product.name} />
              ) : (
                <span>Furniture</span>
              )}
            </div>

            <div className="product-details__info">
              {product.category && (
                <p className="eyebrow">{product.category}</p>
              )}
              <h1>{product.name}</h1>
              <strong className="product-details__price">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </strong>
              <p className="product-details__description">
                {product.description}
              </p>

              {specifications.length > 0 && (
                <section className="product-details__specifications" aria-labelledby="product-specifications-title">
                  <h2 id="product-specifications-title">Product details</h2>
                  <dl>
                    {specifications.map(([label, value]) => (
                      <div className="product-details__specification" key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              <p>Stock: {product.stock}</p>

              <button
                className="product-details__add"
                type="button"
                disabled={Number(product.stock) <= 0}
                onClick={() => addToCart(product)}
              >
                {Number(product.stock) <= 0 ? "Out of stock" : "Add to cart"}
              </button>

              <aside className="product-details__shopping-info" aria-label="Payment and order information">
                <div>
                  <span aria-hidden="true">01</span>
                  <p><strong>Payment options</strong>Cash on Delivery or Razorpay online checkout.</p>
                </div>
                <div>
                  <span aria-hidden="true">02</span>
                  <p><strong>Order updates</strong>View your order status in <Link to="/my-orders">My Orders</Link>.</p>
                </div>
              </aside>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

export default ProductDetailsPage;
