import { useState } from 'react'
import ProductFilters from '../components/products/ProductFilters.jsx'
import ProductGrid from '../components/products/ProductGrid.jsx'
import ProductSort from '../components/products/ProductSort.jsx'
import { useProducts } from '../hooks/useProducts.js'

function Products() {
  const [sort, setSort] = useState('popular')
  const { products, filters, setFilters } = useProducts({ sort })

  return (
    <div className="page-shell page-content">
      <header className="page-title">
        <span className="eyebrow">The full collection</span>
        <h1>Shop all products</h1>
        <p>Browse our sample catalog of everyday favorites.</p>
      </header>
      <div className="catalog-toolbar">
        <ProductFilters filters={filters} onChange={setFilters} />
        <ProductSort value={sort} onChange={setSort} />
      </div>
      <ProductGrid products={products} emptyMessage="No products match those filters." />
    </div>
  )
}

export default Products