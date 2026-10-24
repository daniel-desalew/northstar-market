import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../../components/common/Loader.jsx'
import { deleteProduct, getProducts } from '../../services/productService.js'
import { formatPrice } from '../../utils/formatPrice.js'

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getProducts({ limit: 100 })
      .then((result) => { if (active) setProducts(result.products ?? result) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  async function handleDelete(id) {
    if (!window.confirm('Delete this product? This cannot be undone.')) return
    setError('')
    try {
      await deleteProduct(id)
      setProducts((current) => current.filter((product) => (product._id ?? product.id) !== id))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <div className="page-shell page-content">
      <header className="page-title page-title-row">
        <div><span className="eyebrow">Store management</span><h1>Products</h1></div>
        <Link className="ui-button ui-button--primary" to="/admin/products/new">Add product</Link>
      </header>
      {error && <p className="form-error" role="alert">{error}</p>}
      {loading ? <Loader label="Loading products" /> : products.length === 0 ? (
        <p className="empty-state">The server returned no products. Check the API connection and permissions.</p>
      ) : (
        <div className="table-scroll"><table className="data-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead><tbody>
          {products.map((product) => {
            const id = product._id ?? product.id
            return <tr key={id}><td>{product.name}</td><td>{product.category?.name ?? product.category}</td><td>{formatPrice(product.price)}</td><td>{product.stock}</td><td className="table-actions"><Link to={`/admin/products/${encodeURIComponent(id)}/edit`}>Edit</Link><button type="button" onClick={() => handleDelete(id)}>Delete</button></td></tr>
          })}
        </tbody></table></div>
      )}
    </div>
  )
}

export default AdminProducts