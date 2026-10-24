import { useEffect, useState } from 'react'
import Loader from '../../components/common/Loader.jsx'
import { getAllOrders, updateOrderStatus } from '../../services/orderService.js'
import { ORDER_STATUSES } from '../../utils/constants.js'
import { formatPrice } from '../../utils/formatPrice.js'

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getAllOrders()
      .then((result) => { if (active) setOrders(result.orders ?? result) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  async function changeStatus(orderId, status) {
    setError('')
    try {
      await updateOrderStatus(orderId, status)
      setOrders((current) => current.map((order) =>
        (order._id ?? order.id) === orderId ? { ...order, status } : order,
      ))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <div className="page-shell page-content">
      <header className="page-title"><span className="eyebrow">Store management</span><h1>Orders</h1></header>
      {error && <p className="form-error" role="alert">{error}</p>}
      {loading ? <Loader label="Loading orders" /> : (
        <div className="table-scroll"><table className="data-table"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead><tbody>
          {orders.map((order) => {
            const id = order._id ?? order.id
            return <tr key={id}><td>{id}</td><td>{order.user?.name ?? order.user?.email ?? 'Customer'}</td><td>{formatPrice(order.totalPrice ?? order.total ?? 0)}</td><td><select aria-label={`Status for order ${id}`} value={order.status ?? 'pending'} onChange={(event) => changeStatus(id, event.target.value)}>{ORDER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select></td></tr>
          })}
        </tbody></table>{orders.length === 0 && <p className="empty-state">The API returned no orders.</p>}</div>
      )}
    </div>
  )
}

export default AdminOrders