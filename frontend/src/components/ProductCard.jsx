import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { resolveImageUrl } from "../api/imageUrl.js";
function ProductCard({ product }) {
  const { addToCart } = useCart();
  const outOfStock = Number(product.stock) <= 0;

  return (
    <article className="product-card">
      <div className="product-card__image">
        <Link
          className="product-card__image-link"
          to={`/products/${product.id}`}
          aria-label={`${product.name} view details`}
        >
          {product.imageUrl ? (
            <img src={resolveImageUrl(product.imageUrl)} alt={product.name} />
          ) : (
            <div className="product-card__placeholder">Furniture</div>
          )}
        </Link>

        <button
          className="product-card__quick-add"
          type="button"
          onClick={() => addToCart(product)}
          disabled={outOfStock}
          aria-label={`${product.name} add to cart`}
        >
          +
        </button>
      </div>

      <div className="product-card__details">
        <div>
          <Link to={`/products/${product.id}`} className="product-card__title-link">
            <h3>{product.name}</h3>
          </Link>
          <p>{product.description}</p>
          <span className={outOfStock ? "stock-label stock-label--out" : "stock-label"}>
            {outOfStock ? "Out of stock" : `In stock: ${product.stock}`}
          </span>
        </div>

        <strong>₹{Number(product.price).toLocaleString("en-IN")}</strong>
      </div>

      <button
        className="product-card__add-button"
        type="button"
        onClick={() => addToCart(product)}
        disabled={outOfStock}
      >
        {outOfStock ? "Out of stock" : "Add to cart"}
        {!outOfStock && <span>↗</span>}
      </button>
    </article>
  );
}

export default ProductCard;