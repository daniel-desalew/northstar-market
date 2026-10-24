import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'
import { createProduct } from '../../services/productService.js'

const emptyProduct = { name: '', description: '', category: '', price: '', stock: '', image: '' }

function CreateProduct() {
  const navigate = useNavigate()
  const [product, setProduct] = useState(emptyProduct)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createProduct({
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
        image: product.image ? [product.image] : [],
      })
      navigate('/admin/products')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  function update(event) {
    setProduct((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  return (
    <div className="page-shell page-content">
      <Link className="back-link" to="/admin/products">← Products</Link>
      <form className="form-card admin-form" onSubmit={handleSubmit}>
        <span className="eyebrow">Store management</span><h1>Create product</h1>
        <Input label="Product name" name="name" required value={product.name} onChange={update} />
        <label className="form-field">Description<textarea name="description" rows="4" required value={product.description} onChange={update} /></label>
        <Input label="Category ID or name" name="category" required value={product.category} onChange={update} />
        <div className="form-row">
          <Input label="Price" name="price" type="number" min="0" step="0.01" required value={product.price} onChange={update} />
          <Input label="Stock" name="stock" type="number" min="0" step="1" required value={product.stock} onChange={update} />
        </div>
        <Input label="Image URL" name="image" type="url" value={product.image} onChange={update} />
        {error && <p className="form-error" role="alert">{error}</p>}
        <Button type="submit" disabled={loading}>{loading ? 'Saving…' : 'Create product'}</Button>
      </form>
    </div>
  )
}

export default CreateProduct