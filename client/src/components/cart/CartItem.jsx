import { Minus, Plus, Trash2 } from 'lucide-react'
import { formatPrice } from '../../utils/formatPrice.js'

function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <article className="cart-item">
      <img src={item.image} alt={item.name} />
      <div className="cart-item-info">
        <span className="product-category">{item.category}</span>
        <h3>{item.name}</h3>
        <p className={item.stock > 0 ? 'stock-available' : 'stock-unavailable'}>
          {item.stock > 0 ? 'In stock' : 'Currently unavailable'}
        </p>
        <div className="quantity-control" aria-label={`Quantity for ${item.name}`}>
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={item.quantity <= 1}
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          >
            <Minus size={14} />
          </button>
          <span aria-live="polite">{item.quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={item.quantity >= item.stock}
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          >
            <Plus size={14} />
          </button>
        </div>
        <button className="remove-item" type="button" onClick={() => onRemove(item.id)}>
          <Trash2 size={14} /> Remove
        </button>
      </div>
      <strong className="cart-item-price">{formatPrice(item.price * item.quantity)}</strong>
    </article>
  )
}

export default CartItem