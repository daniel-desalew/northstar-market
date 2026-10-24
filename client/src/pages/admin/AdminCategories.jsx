import { useEffect, useState } from 'react'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'
import Loader from '../../components/common/Loader.jsx'
import { createCategory, deleteCategory, getCategories } from '../../services/categoryService.js'

function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadCategories() {
    try {
      const result = await getCategories()
      setCategories(result.categories ?? result)
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    getCategories()
      .then((result) => { if (active) setCategories(result.categories ?? result) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError('')
    try {
      await createCategory({ name: name.trim() })
      setName('')
      await loadCategories()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this category?')) return
    try {
      await deleteCategory(id)
      setCategories((current) => current.filter((category) => (category._id ?? category.id) !== id))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <div className="page-shell page-content">
      <header className="page-title"><span className="eyebrow">Store management</span><h1>Categories</h1></header>
      {error && <p className="form-error" role="alert">{error}</p>}
      <form className="form-card compact-form" onSubmit={handleSubmit}>
        <h2>Add a category</h2><Input label="Category name" name="name" required value={name} onChange={(event) => setName(event.target.value)} />
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add category'}</Button>
      </form>
      {loading ? <Loader label="Loading categories" /> : (
        <div className="admin-list">
          {categories.map((category) => {
            const id = category._id ?? category.id
            return <div className="admin-list-row" key={id}><span>{category.name}</span><button type="button" onClick={() => handleDelete(id)}>Delete</button></div>
          })}
          {categories.length === 0 && <p className="empty-state">The API returned no categories.</p>}
        </div>
      )}
    </div>
  )
}

export default AdminCategories