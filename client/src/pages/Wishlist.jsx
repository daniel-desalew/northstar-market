import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductGrid from '../components/products/ProductGrid.jsx'
import { sampleProducts } from '../data/sampleProducts.js'
import { useWishlistStore } from '../store/wishlistStore.js'

function Wishlist() {
  const productIds = useWishlistStore((state) => state.productIds)
  const products = sampleProducts.filter((product) => productIds.includes(product.id))

  return (
    <div className="page-shell page-content">
      <header className="page-title">
        <span className="eyebrow"><Heart size={14} /> Saved for later</span>
        <h1>Your wishlist</h1>
        <p>Saved items are stored in this browser.</p>
      </header>
      {products.length ? (
        <ProductGrid products={products} />
      ) : (
        <div className="empty-cart">
          <h2>Your wishlist is empty</h2>
          <p>Tap the heart on a product to save it here.</p>
          <Link className="ui-button ui-button--primary" to="/products">Explore products</Link>
        </div>
      )}
    </div>
  )
}

export default Wishlist