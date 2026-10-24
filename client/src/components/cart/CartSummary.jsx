import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/formatPrice.js'

function CartSummary({ subtotal, itemCount, checkout = true }) {
  const shipping = subtotal === 0 || subtotal >= 50 ? 0 : 5.99
  const total = subtotal + shipping

  return (
    <aside className="cart-summary">
      <h2>Order summary</h2>
      <div><span>Items ({itemCount})</span><strong>{formatPrice(subtotal)}</strong></div>
      <div><span>Shipping</span><strong>{shipping ? formatPrice(shipping) : 'FREE'}</strong></div>
      <div className="summary-total"><span>Estimated total</span><strong>{formatPrice(total)}</strong></div>
      {shipping > 0 && <p className="summary-note">Add {formatPrice(50 - subtotal)} more for free shipping.</p>}
      {checkout && (
        <Link className="ui-button ui-button--primary summary-checkout" to="/checkout">
          Continue to checkout
        </Link>
      )}
      <p className="summary-note">Taxes are calculated at checkout.</p>
    </aside>
  )
}

export default CartSummary