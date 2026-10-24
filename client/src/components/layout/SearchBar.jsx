import { Search } from 'lucide-react'
import { useState } from 'react'
import { categories } from '../../data/sampleProducts.js'

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState(
    () => new URLSearchParams(window.location.search).get('q') ?? '',
  )
  const [category, setCategory] = useState(
    () => new URLSearchParams(window.location.search).get('category') ?? 'All',
  )

  function handleSubmit(event) {
    event.preventDefault()
    onSearch(query, category)
  }

  return (
    <form className="search-form" role="search" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="store-search-category">
        Search category
      </label>
      <select
        id="store-search-category"
        aria-label="Search category"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
        <option value="All">All</option>
        {categories.map((item) => (
          <option key={item.name} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
      <label className="sr-only" htmlFor="store-search">
        Search products
      </label>
      <input
        id="store-search"
        type="search"
        placeholder="Search products..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button type="submit" aria-label="Search">
        <Search size={19} />
      </button>
    </form>
  )
}

export default SearchBar