import ProductCard from './ProductCard.jsx'

function ProductGrid({ products, emptyMessage = 'No products found.' }) {
  if (products.length === 0) {
    return <p className="empty-state">{emptyMessage}</p>
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid