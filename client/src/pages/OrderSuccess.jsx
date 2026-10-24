import { CheckCircle2 } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

function OrderSuccess() {
  const location = useLocation()
  const orderId = location.state?.orderId

  return (
    <section className="page-shell page-content success-card">
      <CheckCircle2 size={44} aria-hidden="true" />
      <h1>Order received</h1>
      {orderId ? <p>Your order reference is <strong>{orderId}</strong>.</p> : <p>Your order has been submitted.</p>}
      <p>Order details are available in your account once the server confirms them.</p>
      <Link className="ui-button ui-button--primary" to="/orders">View my orders</Link>
      <Link className="text-link" to="/products">Continue shopping</Link>
    </section>
  )
}

export default OrderSuccess