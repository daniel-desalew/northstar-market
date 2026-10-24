import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductFilters from '../components/products/ProductFilters.jsx'
import ProductGrid from '../components/products/ProductGrid.jsx'
import ProductSort from '../components/products/ProductSort.jsx'
import { electronicsDepartments } from '../data/electronicsDepartments.js'
import { categories } from '../data/sampleProducts.js'
import { useProducts } from '../hooks/useProducts.js'

function Category() {
  const { categoryName } = useParams()
  const decodedName = decodeURIComponent(categoryName)
  const category = categories.find((item) => item.name === decodedName)
  const [sort, setSort] = useState('popular')
  const [activeElectronicsDepartment, setActiveElectronicsDepartment] = useState(0)
  const [activeElectronicsProduct, setActiveElectronicsProduct] = useState(0)
  const { products: allProducts, filters, setFilters } = useProducts({ sort })
  const products = useMemo(
    () => allProducts.filter((product) => product.category === decodedName),
    [allProducts, decodedName],
  )

  if (!category) {
    return (
      <div className="page-shell page-content">
        <h1>Category not found</h1>
        <Link className="text-link" to="/products">Browse all products</Link>
      </div>
    )
  }

  if (decodedName === 'Electronics') {
    const activeDepartment = electronicsDepartments[activeElectronicsDepartment]
    const activeProduct = activeDepartment.products[activeElectronicsProduct]

    return (
      <div className="page-shell page-content electronics-department-page">
        <header className="page-title electronics-page-title">
          <span className="eyebrow">Department</span>
          <h1>Electronics</h1>
          <p>Browse Amazon.com electronics categories and example products inside this project.</p>
        </header>
        <div className="electronics-department-layout">
          <aside className="electronics-department-sidebar" aria-label="Electronics categories">
            <h2>Electronics</h2>
            <nav>{electronicsDepartments.map((department, index) => <button className={activeElectronicsDepartment === index ? 'is-current' : ''} type="button" key={department.name} onClick={() => { setActiveElectronicsDepartment(index); setActiveElectronicsProduct(0) }} aria-current={activeElectronicsDepartment === index ? 'page' : undefined}><span>{department.name}</span><span aria-hidden="true">›</span></button>)}</nav>
          </aside>
          <main className="electronics-department-main">
            <section className="electronics-department-intro">
              <span className="electronics-department-icon" aria-hidden="true">{activeDepartment.icon}</span>
              <div><span className="eyebrow">{activeDepartment.name === 'Service Plans' ? 'Service plan reference' : 'Amazon.com category reference'}</span><h2>{activeDepartment.name}</h2><p>{activeDepartment.description}</p></div>
            </section>
            <div className="electronics-reference-heading"><h3>Featured product examples</h3><span>{activeDepartment.products.length} items</span></div>
            <div className={`electronics-reference-grid ${activeDepartment.products.some((product) => product.image) ? 'has-product-images' : ''}`}>{activeDepartment.products.map((product, index) => <button className={`electronics-reference-card ${product.image ? 'has-image' : ''} ${activeElectronicsProduct === index ? 'is-selected' : ''}`} type="button" key={product.name} onClick={() => setActiveElectronicsProduct(index)} aria-pressed={activeElectronicsProduct === index}>
              {product.image ? <span className="electronics-reference-product-image"><img src={product.image} alt={product.imageAlt} loading="lazy" /><small>{product.badge}</small></span> : <span className="electronics-reference-card-icon" aria-hidden="true">{activeDepartment.icon}</span>}
              <span className="electronics-reference-card-copy">{activeDepartment.name === 'Service Plans' && <span className="electronics-reference-plan-badge">{product.badge}</span>}<small>{activeDepartment.name === 'Service Plans' ? 'PROTECTION PLAN' : 'AMAZON.COM PRODUCT REFERENCE'}</small><strong>{product.name}</strong><span>{product.detail}</span>{product.specs && <span className="electronics-reference-specs">{product.specs.map((spec) => <span key={spec}>{spec}</span>)}</span>}<span className="electronics-reference-action">View item details <span aria-hidden="true">›</span></span></span>
              <span className="electronics-reference-chevron" aria-hidden="true">›</span>
            </button>)}</div>
            <article className={`electronics-reference-detail ${activeProduct.image ? 'has-image' : ''}`}>{activeProduct.image && <img className="electronics-reference-detail-image" src={activeProduct.image} alt={activeProduct.imageAlt} loading="lazy" />}<div><span className="eyebrow">{activeDepartment.name === 'Service Plans' ? 'Selected plan' : 'Selected item'}</span><h3>{activeProduct.name}</h3><p>{activeProduct.detail}</p>{activeProduct.specs && <div className="electronics-reference-specs">{activeProduct.specs.map((spec) => <span key={spec}>{spec}</span>)}</div>}{activeProduct.amazonUrl && <a className="electronics-reference-amazon-link" href={activeProduct.amazonUrl} target="_blank" rel="noreferrer">Find on Amazon <span aria-hidden="true">↗</span></a>}<small>{activeDepartment.name === 'Service Plans' ? 'Coverage, eligibility, service fees, and exclusions depend on the provider’s full plan terms.' : 'Product image from the manufacturer. Amazon search results show current listings, prices, and availability.'}</small></div></article>
            <p className="electronics-source-note">{activeDepartment.name === 'Service Plans' ? 'Plan examples are shown for reference only. Coverage is provider-specific, and this project does not sell plans or process claims.' : 'These examples are displayed in your project. Product names follow Amazon.com Electronics listings; this page is not connected to Amazon inventory or checkout.'}</p>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell page-content">
      <header className="page-title">
        <span className="eyebrow">Department</span>
        <h1>{category.name}</h1>
        <p>{products.length} products in this department.</p>
      </header>
      <div className="catalog-toolbar">
        <ProductFilters filters={filters} onChange={setFilters} />
        <ProductSort value={sort} onChange={setSort} />
      </div>
      <ProductGrid products={products} emptyMessage="No products are listed in this category yet." />
    </div>
  )
}

export default Category
