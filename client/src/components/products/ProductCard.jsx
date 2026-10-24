import { Heart, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore.js'
import { useWishlistStore } from '../../store/wishlistStore.js'
import RatingStars from './RatingStars.jsx'

function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem)
  const productIsSaved = useWishlistStore((state) =>
    state.productIds.includes(product.id),
  )
  const toggleProduct = useWishlistStore((state) => state.toggleProduct)
  const [feedback, setFeedback] = useState('')

  function handleAddToCart() {
    const existingItem = useCartStore
      .getState()
      .items.find((item) => item.id === product.id)

    if (existingItem?.quantity >= product.stock) {
      setFeedback('Stock limit reached')
      window.setTimeout(() => setFeedback(''), 1400)
      return
    }

    addItem(product)
    setFeedback('Added to cart')
    window.setTimeout(() => setFeedback(''), 1400)
  }

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img className="product-image" src={product.image} alt={product.name} loading="lazy" />
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button
          className="wishlist-button"
          type="button"
          aria-label={productIsSaved ? `Remove ${product.name} from saved items` : `Save ${product.name}`}
          aria-pressed={productIsSaved}
          onClick={() => toggleProduct(product.id)}
        >
          <Heart size={17} fill={productIsSaved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">
          <Link to={`/products/${encodeURIComponent(product.id)}`}>{product.name}</Link>
        </h3>
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        <p className="product-price">
          <strong>${product.price.toFixed(2)}</strong>
          {product.originalPrice > product.price && (
            <del>${product.originalPrice.toFixed(2)}</del>
          )}
        </p>
        <button
          className="add-cart-button"
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock < 1}
        >
          <ShoppingBag size={15} aria-hidden="true" />
          {product.stock < 1 ? 'Out of stock' : feedback || 'Add to cart'}
        </button>
      </div>
    </article>
  )
}

export default ProductCard