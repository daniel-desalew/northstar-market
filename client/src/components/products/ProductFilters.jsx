function ProductFilters({ filters, onChange }) {
  return (
    <form className="product-filters" onSubmit={(event) => event.preventDefault()}>
      <label>
        Minimum price
        <input
          type="number"
          min="0"
          step="0.01"
          value={filters.minPrice}
          onChange={(event) => onChange({ ...filters, minPrice: event.target.value })}
        />
      </label>
      <label>
        Maximum price
        <input
          type="number"
          min="0"
          step="0.01"
          value={filters.maxPrice}
          onChange={(event) => onChange({ ...filters, maxPrice: event.target.value })}
        />
      </label>
      <button type="button" onClick={() => onChange({ minPrice: '', maxPrice: '' })}>
        Clear filters
      </button>
    </form>
  )
}

export default ProductFilters