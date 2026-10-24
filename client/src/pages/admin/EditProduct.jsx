import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'
import Loader from '../../components/common/Loader.jsx'
import { getProduct, updateProduct } from '../../services/productService.js'

function EditProduct() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    getProduct(productId)
      .then((result) => {
        if (!active) return
        const item = result.product ?? result
        setProduct({
          name: item.name ?? '',
          description: item.description ?? '',
          category: item.category?._id ?? item.category ?? '',
          price: item.price ?? '',
          stock: item.stock ?? '',
          image: Array.isArray(item.image) ? item.image[0] ?? '' : item.image ?? '',
        })
      })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [productId])

  function update(event) {
    setProduct((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      await updateProduct(productId, {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
        image: product.image ? [product.image] : [],
      })
      navigate('/admin/products')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="page-shell page-content"><Loader label="Loading product" /></div>
  if (!product) return <div className="page-shell page-content"><p className="form-error" role="alert">{error || 'Product not found.'}</p><Link to="/admin/products">Back to products</Link></div>

  return (
    <div className="page-shell page-content">
      <Link className="back-link" to="/admin/products">← Products</Link>
      <form className="form-card admin-form" onSubmit={handleSubmit}>
        <span className="eyebrow">Store management</span><h1>Edit product</h1>
        <Input label="Product name" name="name" required value={product.name} onChange={update} />
        <label className="form-field">Description<textarea name="description" rows="4" required value={product.description} onChange={update} /></label>
        <Input label="Category ID or name" name="category" required value={product.category} onChange={update} />
        <div className="form-row">
          <Input label="Price" name="price" type="number" min="0" step="0.01" required value={product.price} onChange={update} />
          <Input label="Stock" name="stock" type="number" min="0" step="1" required value={product.stock} onChange={update} />
        </div>
        <Input label="Image URL" name="image" type="url" value={product.image} onChange={update} />
        {error && <p className="form-error" role="alert">{error}</p>}
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save product'}</Button>
      </form>
    </div>
  )
}

export default EditProduct