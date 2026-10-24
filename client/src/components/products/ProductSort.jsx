import { PRODUCT_SORT_OPTIONS } from '../../types/index.js'

function ProductSort({ value, onChange }) {
  return (
    <label className="sort-control">
      Sort by
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {PRODUCT_SORT_OPTIONS.map((option) => (
          <option value={option.value} key={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  )
}

export default ProductSort