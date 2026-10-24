import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/products/ProductGrid.jsx'
import ProductSort from '../components/products/ProductSort.jsx'
import { sampleProducts } from '../data/sampleProducts.js'

function SearchResults() {
  const [params] = useSearchParams()
  const [sort, setSort] = useState('popular')
  const query = params.get('q')?.trim() ?? ''
  const category = params.get('category') ?? 'All'

  const products = useMemo(() => {
    const matching = sampleProducts.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category
      return matchesCategory && `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase())
    })
    return matching.sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'rating') return b.rating - a.rating
      return b.reviewCount - a.reviewCount
    })
  }, [category, query, sort])

  return (
    <div className="page-shell page-content">
      <header className="page-title">
        <span className="eyebrow">Search</span>
        <h1>{query ? `Results for “${query}”` : 'Browse products'}</h1>
        <p>{products.length} matching sample products{category !== 'All' ? ` in ${category}` : ''}.</p>
      </header>
      <div className="catalog-toolbar">
        <Link className="text-link" to="/products">Clear search</Link>
        <ProductSort value={sort} onChange={setSort} />
      </div>
      <ProductGrid products={products} emptyMessage="No matches found. Try a different search." />
    </div>
  )
}

export default SearchResults