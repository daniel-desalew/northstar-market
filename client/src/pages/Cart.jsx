import { Link } from 'react-router-dom'
import CartItem from '../components/cart/CartItem.jsx'
import CartSummary from '../components/cart/CartSummary.jsx'
import { useCart } from '../hooks/useCart.js'

function Cart() {
  const { items, subtotal, itemCount, setQuantity, removeItem } = useCart()

  return (
    <div className="page-shell page-content">
      <header className="page-title">
        <span className="eyebrow">Your selection</span>
        <h1>Your shopping cart</h1>
      </header>
      {items.length === 0 ? (
        <section className="empty-cart">
          <h2>Your cart is waiting for something lovely.</h2>
          <p>Explore the sample collection and add a few favorites.</p>
          <Link className="ui-button ui-button--primary" to="/products">Continue shopping</Link>
        </section>
      ) : (
        <div className="cart-layout">
          <section className="cart-list" aria-label="Cart items">
            <p>{itemCount} item{itemCount === 1 ? '' : 's'} in your cart</p>
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={setQuantity}
                onRemove={removeItem}
              />
            ))}
          </section>
          <CartSummary subtotal={subtotal} itemCount={itemCount} />
        </div>
      )}
    </div>
  )
}

export default Cart