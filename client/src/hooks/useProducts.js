import { useMemo, useState } from 'react'
import { sampleProducts } from '../data/sampleProducts.js'

export function useProducts({ category = 'All', search = '', sort = 'popular' } = {}) {
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '' })

  const products = useMemo(() => {
    const filtered = sampleProducts.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category
      const matchesSearch = `${product.name} ${product.category}`
        .toLowerCase()
        .includes(search.trim().toLowerCase())
      const matchesMin = filters.minPrice === '' || product.price >= Number(filters.minPrice)
      const matchesMax = filters.maxPrice === '' || product.price <= Number(filters.maxPrice)
      return matchesCategory && matchesSearch && matchesMin && matchesMax
    })

    return [...filtered].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'rating') return b.rating - a.rating
      return b.reviewCount - a.reviewCount
    })
  }, [category, filters, search, sort])

  return { products, filters, setFilters, loading: false, error: '' }
}