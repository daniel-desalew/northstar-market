import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Loader from '../components/common/Loader.jsx'
import { getOrder } from '../services/orderService.js'
import { formatPrice } from '../utils/formatPrice.js'

function OrderDetails() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getOrder(orderId)
      .then((result) => { if (active) setOrder(result.order ?? result) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [orderId])

  if (loading) return <div className="page-shell page-content"><Loader label="Loading order" /></div>
  if (error) return <div className="page-shell page-content"><p className="form-error" role="alert">{error}</p><Link to="/orders">Back to orders</Link></div>
  if (!order) return <div className="page-shell page-content"><h1>Order not found</h1><Link to="/orders">Back to orders</Link></div>

  const items = order.items ?? []
  return (
    <div className="page-shell page-content">
      <Link className="back-link" to="/orders">← Your orders</Link>
      <header className="page-title"><span className="eyebrow">Order details</span><h1>Order {order._id ?? order.id}</h1><p>Status: <strong className="capitalize">{order.status}</strong></p></header>
      <section className="form-card">
        <h2>Items</h2>
        {items.map((item, index) => (
          <div className="order-line" key={item._id ?? item.product?._id ?? index}>
            <span>{item.name ?? item.product?.name ?? 'Product'} × {item.quantity}</span>
            <strong>{formatPrice((item.price ?? item.product?.price ?? 0) * item.quantity)}</strong>
          </div>
        ))}
        <div className="order-line summary-total"><span>Total</span><strong>{formatPrice(order.totalPrice ?? order.total ?? 0)}</strong></div>
      </section>
    </div>
  )
}

export default OrderDetails