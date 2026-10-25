import { ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import ProductFilters from '../components/products/ProductFilters.jsx'
import ProductGrid from '../components/products/ProductGrid.jsx'
import ProductSort from '../components/products/ProductSort.jsx'
import { artsCraftDepartments } from '../data/artsCraftDepartments.js'
import { computerDepartments } from '../data/computerDepartments.js'
import { electronicsDepartments, smartHomeDepartments } from '../data/electronicsDepartments.js'
import { homeKitchenDepartments } from '../data/homeKitchenDepartments.js'
import { fashionDepartments } from '../data/fashionDepartments.js'
import { categories } from '../data/sampleProducts.js'
import { useProducts } from '../hooks/useProducts.js'

const booksVideoList = [
  { id: 'aqz-KE-bpKQ', title: 'Big Buck Bunny', provider: 'Blender Open Movie' },
  { id: 'TLkA0RELQ1g', title: 'Elephants Dream', provider: 'Blender Open Movie' },
  { id: 'eRsGyueVLvQ', title: 'Sintel', provider: 'Blender Open Movie' },
]

function getAmazonSearchUrl(product) {
  return product.amazonUrl ?? `https://www.amazon.com/s?k=${encodeURIComponent(product.name)}`
}

function Category() {
  const { categoryName } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const decodedName = decodeURIComponent(categoryName)
  const category = categories.find((item) => item.name === decodedName)
  const [sort, setSort] = useState('popular')
  const [activeDepartmentName, setActiveDepartmentName] = useState('')
  const [activeProductName, setActiveProductName] = useState('')
  const [activeVideoId, setActiveVideoId] = useState('')
  const [activeBookVideoId, setActiveBookVideoId] = useState(booksVideoList[0].id)
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

  const activeBookVideo = booksVideoList.find((video) => video.id === activeBookVideoId) ?? booksVideoList[0]

  if (decodedName === 'Books') {
    return (
      <div className="page-shell page-content books-category-page">
        <header className="books-hero" aria-label="Books department hero">
          <div className="books-hero-copy">
            <span className="eyebrow">Department</span>
            <h1>Books</h1>
            <p>{products.length} products in this department.</p>
          </div>
        </header>

        <section className="books-video-section" aria-label="Book videos">
          <aside className="books-video-panel" aria-label="Book videos">
            <div className="books-video-panel-header">
              <span className="eyebrow">Video picks</span>
              <h3>Book inspiration</h3>
            </div>
            <div className="books-video-list" role="tablist" aria-label="Select a book video">
              {booksVideoList.map((video, index) => (
                <button
                  key={video.id}
                  type="button"
                  className={video.id === activeBookVideo.id ? 'is-current' : ''}
                  onClick={() => setActiveBookVideoId(video.id)}
                  aria-pressed={video.id === activeBookVideo.id}
                >
                  <span>{index + 1}</span>
                  <img
                    className="books-video-thumbnail"
                    src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                    alt=""
                    loading="lazy"
                  />
                  <span className="books-video-copy">
                    <strong>{video.title}</strong>
                    <small>{video.provider}</small>
                  </span>
                </button>
              ))}
            </div>
            <div className="books-video-frame">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeBookVideo.id}?rel=0&playsinline=1`}
                title={`${activeBookVideo.title} — ${activeBookVideo.provider}`}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </aside>
        </section>

        <div className="catalog-toolbar">
          <ProductFilters filters={filters} onChange={setFilters} />
          <ProductSort value={sort} onChange={setSort} />
        </div>
        <ProductGrid products={products} emptyMessage="No books are listed in this category yet." />
      </div>
    )
  }

  const departmentList = decodedName === 'Computers'
    ? computerDepartments
    : decodedName === 'Electronics'
      ? electronicsDepartments
      : decodedName === 'Arts & Crafts'
        ? artsCraftDepartments
        : decodedName === 'Home & Kitchen'
          ? homeKitchenDepartments
          : decodedName === 'Fashion'
            ? fashionDepartments
      : null

  if (departmentList) {
    const requestedDepartmentName = searchParams.get('department')
    const activeDepartment = departmentList.find((department) => department.name === requestedDepartmentName)
      ?? departmentList.find((department) => department.name === activeDepartmentName)
      ?? departmentList[0]
    const selectedProductIndex = activeDepartment.products.findIndex((product) => product.name === activeProductName)
    const activeProductIndex = selectedProductIndex < 0 ? 0 : selectedProductIndex
    const activeProduct = activeDepartment.products[activeProductIndex]
    const isElectronics = decodedName === 'Electronics'
    const isComputers = decodedName === 'Computers'
    const isArtsCrafts = decodedName === 'Arts & Crafts'
    const isHomeKitchen = decodedName === 'Home & Kitchen'
    const isFashion = decodedName === 'Fashion'
    const departmentVideos = [
      ...(activeDepartment.videoId
        ? [{
            videoId: activeDepartment.videoId,
            videoTitle: activeDepartment.videoTitle,
            videoProvider: activeDepartment.videoProvider,
          }]
        : []),
      ...(activeDepartment.additionalVideos ?? []),
    ]
    const activeVideo = departmentVideos.find((video) => video.videoId === activeVideoId) ?? departmentVideos[0]
    const isSmartHome = isElectronics && activeDepartment.group === 'Smart Home'
    const sidebarDepartments = isSmartHome ? smartHomeDepartments : departmentList
    const electronicsVideoDepartments = isElectronics
      ? departmentList.filter((department) => department.videoId)
      : []

    return (
      <div className="page-shell page-content electronics-department-page">
        <header className="page-title electronics-page-title">
          <span className="eyebrow">Department</span>
          <h1>{category.name}</h1>
          <p>Browse {category.name.toLowerCase()} categories and example products inside this project.</p>
        </header>
        <div className={`electronics-department-layout ${isElectronics && !isSmartHome ? 'has-video-sidebar' : ''} ${(isComputers || isArtsCrafts || isHomeKitchen || isFashion) ? 'has-computer-sidebar' : ''} ${isSmartHome ? 'has-smart-home-sidebar' : ''}`}>
          {(isComputers || isSmartHome || isArtsCrafts || isHomeKitchen || isFashion) && (
            <aside className="electronics-department-sidebar" aria-label={`${isSmartHome ? 'Smart Home' : isArtsCrafts ? 'Arts & Crafts' : isHomeKitchen ? 'Home and Kitchen' : isFashion ? "Men's Fashion" : 'Computers'} categories`}>
              <h2>{isSmartHome ? 'Smart Home' : isArtsCrafts ? 'Arts & Crafts' : isHomeKitchen ? 'Home and Kitchen' : isFashion ? "Men's Fashion" : 'Computers'}</h2>
              <nav>{sidebarDepartments.map((department) => <button className={activeDepartment === department ? 'is-current' : ''} type="button" key={department.name} onClick={() => {
                setActiveDepartmentName(department.name)
                setActiveProductName('')
                setActiveVideoId('')
                setSearchParams((params) => {
                  const nextParams = new URLSearchParams(params)
                  nextParams.set('department', department.name)
                  return nextParams
                }, { replace: true })
              }} aria-current={activeDepartment === department ? 'page' : undefined}><ChevronRight className="electronics-department-arrow" size={17} strokeWidth={2} aria-hidden="true" /><span>{department.name}</span></button>)}</nav>
            </aside>
          )}
          {isElectronics && !isSmartHome && (
            <aside className="electronics-video-sidebar" aria-label="Electronics videos">
              <h2>Electronics videos <span>{electronicsVideoDepartments.length}</span></h2>
              <nav className="electronics-video-list" aria-label="Choose an Electronics video">
                {electronicsVideoDepartments.map((department, index) => (
                  <button
                    className={activeDepartment === department ? 'is-current' : ''}
                    type="button"
                    key={department.name}
                    onClick={() => {
                      setActiveDepartmentName(department.name)
                      setActiveProductName('')
                      setSearchParams((params) => {
                        const nextParams = new URLSearchParams(params)
                        nextParams.set('department', department.name)
                        return nextParams
                      }, { replace: true })
                    }}
                    aria-current={activeDepartment === department ? 'true' : undefined}
                  >
                    <span className="electronics-video-list-number">{index + 1}</span>
                    <span className="electronics-video-list-copy">
                      <strong>{department.videoTitle}</strong>
                      <small>{department.name} · {department.videoProvider}</small>
                    </span>
                  </button>
                ))}
              </nav>
            </aside>
          )}
          <main className="electronics-department-main">
            <section className="electronics-department-intro">
              <span className="electronics-department-icon" aria-hidden="true">{activeDepartment.icon}</span>
              <div><span className="eyebrow">{activeDepartment.group ?? (activeDepartment.name === 'Service Plans' ? 'Service plan reference' : 'Amazon.com category reference')}</span><h2>{activeDepartment.name}</h2><p>{activeDepartment.description}</p></div>
            </section>
            {activeVideo && (
              <section className="electronics-reference-video" aria-label={`${activeDepartment.name} product video`}>
                <div className="electronics-reference-video-heading">
                  <div>
                    <span className="eyebrow">{departmentVideos.length > 1 ? `Video ${departmentVideos.indexOf(activeVideo) + 1} of ${departmentVideos.length}` : 'Featured video'}</span>
                    <h3>{activeVideo.videoTitle}</h3>
                  </div>
                  <span>{activeVideo.videoProvider}</span>
                </div>
                <div className="electronics-reference-video-frame">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId}`}
                    title={`${activeVideo.videoTitle} — ${activeVideo.videoProvider}`}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                {departmentVideos.length > 1 && (
                  <nav className="department-video-choices" aria-label={`${activeDepartment.name} videos`}>
                    {departmentVideos.map((video, index) => (
                      <button
                        className={video.videoId === activeVideo.videoId ? 'is-current' : ''}
                        type="button"
                        key={video.videoId}
                        onClick={() => setActiveVideoId(video.videoId)}
                        aria-pressed={video.videoId === activeVideo.videoId}
                      >
                        <span>{index + 1}</span>
                        <span><strong>{video.videoTitle}</strong><small>{video.videoProvider}</small></span>
                      </button>
                    ))}
                  </nav>
                )}
              </section>
            )}
            <div className="electronics-reference-heading"><h3>Featured product examples</h3><span>{activeDepartment.products.length} items</span></div>
            <div className={`electronics-reference-grid ${activeDepartment.products.some((product) => product.image) ? 'has-product-images' : ''}`}>{activeDepartment.products.map((product, index) => <button className={`electronics-reference-card ${product.image ? 'has-image' : ''} ${activeProductIndex === index ? 'is-selected' : ''}`} type="button" key={product.name} onClick={() => setActiveProductName(product.name)} aria-pressed={activeProductIndex === index}>
              {product.image ? <span className="electronics-reference-product-image"><img src={product.image} alt={product.imageAlt} loading="lazy" /><small>{product.badge}</small></span> : <span className="electronics-reference-card-icon" aria-hidden="true">{activeDepartment.icon}</span>}
              <span className="electronics-reference-card-copy">{activeDepartment.name === 'Service Plans' && <span className="electronics-reference-plan-badge">{product.badge}</span>}<small>{activeDepartment.name === 'Service Plans' ? 'PROTECTION PLAN' : 'AMAZON.COM PRODUCT REFERENCE'}</small><strong>{product.name}</strong><span>{product.detail}</span>{product.specs && <span className="electronics-reference-specs">{product.specs.map((spec) => <span key={spec}>{spec}</span>)}</span>}<span className="electronics-reference-action">View item details <span aria-hidden="true">›</span></span></span>
              <span className="electronics-reference-chevron" aria-hidden="true">›</span>
            </button>)}</div>
            <article className={`electronics-reference-detail ${activeProduct.image ? 'has-image' : ''}`}>{activeProduct.image && <img className="electronics-reference-detail-image" src={activeProduct.image} alt={activeProduct.imageAlt} loading="lazy" />}<div><span className="eyebrow">{activeDepartment.name === 'Service Plans' ? 'Selected plan' : 'Selected item'}</span><h3>{activeProduct.name}</h3><p>{activeProduct.detail}</p>{activeProduct.specs && <div className="electronics-reference-specs">{activeProduct.specs.map((spec) => <span key={spec}>{spec}</span>)}</div>}<a className="electronics-reference-amazon-link" href={getAmazonSearchUrl(activeProduct)} target="_blank" rel="noreferrer">Find on Amazon <span aria-hidden="true">↗</span></a><small>{activeDepartment.name === 'Service Plans' ? 'Coverage, eligibility, service fees, and exclusions depend on the provider’s full plan terms.' : 'Product examples and video are for reference. Amazon listings, prices, and availability can change.'}</small></div></article>
            <p className="electronics-source-note">{activeDepartment.name === 'Service Plans' ? 'Plan examples are shown for reference only. Coverage is provider-specific, and this project does not sell plans or process claims.' : `These ${category.name.toLowerCase()} examples are displayed in your project and are not connected to live Amazon inventory or checkout.`}</p>
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
