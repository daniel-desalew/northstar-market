import { Link } from 'react-router-dom'

function AdminDashboard() {
  return (
    <div className="page-shell page-content">
      <header className="page-title"><span className="eyebrow">Store management</span><h1>Admin dashboard</h1><p>Manage catalog and customer activity.</p></header>
      <div className="admin-links">
        <Link to="/admin/products"><strong>Products</strong><span>Create and update catalog items</span></Link>
        <Link to="/admin/categories"><strong>Categories</strong><span>Manage product departments</span></Link>
        <Link to="/admin/orders"><strong>Orders</strong><span>Review and update order status</span></Link>
        <Link to="/admin/users"><strong>Users</strong><span>View registered customers</span></Link>
      </div>
    </div>
  )
}

export default AdminDashboard