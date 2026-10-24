import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductGallery from '../components/products/ProductGallery.jsx'
import RatingStars from '../components/products/RatingStars.jsx'
import { sampleProducts } from '../data/sampleProducts.js'
import { useCartStore } from '../store/cartStore.js'
import { formatPrice } from '../utils/formatPrice.js'

function ProductDetails() {
  const { productId } = useParams()
  const product = sampleProducts.find((item) => item.id === productId)
  const addItem = useCartStore((state) => state.addItem)
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')

  if (!product) {
    return (
      <div className="page-shell page-content">
        <h1>Product not found</h1>
        <Link className="text-link" to="/products">Return to products</Link>
      </div>
    )
  }

  function handleAdd() {
    const current = useCartStore.getState().items.find((item) => item.id === product.id)
    if ((current?.quantity ?? 0) + quantity > product.stock) {
      setMessage('The selected quantity exceeds available sample stock.')
      return
    }
    for (let index = 0; index < quantity; index += 1) addItem(product)
    setMessage('Added to your cart.')
  }

  return (
    <div className="page-shell page-content">
      <Link className="back-link" to="/products"><ArrowLeft size={15} /> All products</Link>
      <section className="product-detail">
        <ProductGallery images={[product.image]} name={product.name} />
        <div className="detail-copy">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          <p className="detail-price">{formatPrice(product.price)}</p>
          <p className="detail-description">
            {product.description || `Carefully selected for everyday use, this ${product.category.toLowerCase()} favorite combines thoughtful details with dependable quality.`}
          </p>
          <p className="stock-available">{product.stock} available in sample inventory</p>
          <label className="quantity-select">
            Quantity
            <select value={quantity} onChange={(event) => setQuantity(Number(event.target.value))}>
              {Array.from({ length: Math.min(product.stock, 10) }, (_, index) => index + 1).map((amount) => (
                <option key={amount} value={amount}>{amount}</option>
              ))}
            </select>
          </label>
          <button className="ui-button ui-button--primary" type="button" onClick={handleAdd}>
            <ShoppingBag size={16} /> Add to cart
          </button>
          {message && <p className="form-success" role="status">{message}</p>}
        </div>
      </section>
      <section className="section">
        <h2>You might also like</h2>
        <div className="related-grid">
          {sampleProducts.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3).map((item) => (
            <Link key={item.id} className="related-product" to={`/products/${item.id}`}>
              <img src={item.image} alt="" />
              <span>{item.name}</span>
              <strong>{formatPrice(item.price)}</strong>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ProductDetails
