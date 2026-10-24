import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../components/common/Loader.jsx'
import { getMyOrders } from '../services/orderService.js'
import { formatPrice } from '../utils/formatPrice.js'

function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getMyOrders()
      .then((result) => { if (active) setOrders(result.orders ?? result) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return (
    <div className="page-shell page-content">
      <header className="page-title"><span className="eyebrow">Your account</span><h1>Your orders</h1></header>
      {loading && <Loader label="Loading orders" />}
      {error && <p className="form-error" role="alert">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <div className="empty-cart"><h2>No orders yet</h2><p>Orders placed with your account will appear here.</p><Link className="ui-button ui-button--primary" to="/products">Start shopping</Link></div>
      )}
      {!loading && orders.length > 0 && (
        <div className="order-list">
          {orders.map((order) => {
            const id = order._id ?? order.id
            return (
              <article className="order-card" key={id}>
                <div><span className="product-category">Order</span><strong>{id}</strong></div>
                <div><span className="product-category">Placed</span><strong>{new Date(order.createdAt).toLocaleDateString()}</strong></div>
                <div><span className="product-category">Status</span><strong className="capitalize">{order.status ?? 'pending'}</strong></div>
                <div><span className="product-category">Total</span><strong>{formatPrice(order.totalPrice ?? order.total ?? 0)}</strong></div>
                <Link className="text-link" to={`/orders/${encodeURIComponent(id)}`}>Details</Link>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyOrders