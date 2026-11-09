const { query } = require('../config/db')
const ApiError = require('../utils/ApiError')
const { isValidId, requireValidId } = require('../utils/identifiers')
const slugify = require('../utils/slugify')

const MAX_PAGE_SIZE = 50
const PRODUCT_COLUMNS = `p.id AS "_id", p.name, p.description,
  json_build_object('_id', c.id, 'name', c.name, 'slug', c.slug) AS category,
  p.price::float8 AS price, p.original_price::float8 AS "originalPrice",
  p.image, p.stock, p.rating::float8 AS rating, p.review_count AS "reviewCount",
  p.featured, p.is_active AS "isActive", p.created_at AS "createdAt",
  p.updated_at AS "updatedAt"`

async function findCategory(value) {
  const result = await query(
    `SELECT id, name, slug FROM categories
     WHERE is_active = TRUE AND ${isValidId(value) ? 'id = $1' : 'slug = $1'}
     LIMIT 1`,
    [isValidId(value) ? value : slugify(value)],
  )
  return result.rows[0]
}

async function listProducts(queryParams) {
  const minPrice = queryParams.minPrice === undefined ? undefined : Number(queryParams.minPrice)
  const maxPrice = queryParams.maxPrice === undefined ? undefined : Number(queryParams.maxPrice)
  if (minPrice !== undefined && (!Number.isFinite(minPrice) || minPrice < 0)) {
    throw new ApiError(400, 'minPrice must be a non-negative number.')
  }
  if (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0)) {
    throw new ApiError(400, 'maxPrice must be a non-negative number.')
  }
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    throw new ApiError(400, 'minPrice cannot be greater than maxPrice.')
  }

  const page = Math.max(1, Number.parseInt(queryParams.page, 10) || 1)
  const requestedLimit = Number.parseInt(queryParams.limit, 10) || 12
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, requestedLimit))
  const conditions = ['p.is_active = TRUE']
  const values = []
  const addCondition = (sql, value) => {
    values.push(value)
    conditions.push(sql.replace('?', `$${values.length}`))
  }

  if (queryParams.category) {
    const category = await findCategory(queryParams.category)
    if (!category) return { products: [], pagination: { page, limit, total: 0, pages: 0 } }
    addCondition('p.category_id = ?', category.id)
  }
  if (minPrice !== undefined) addCondition('p.price >= ?', minPrice)
  if (maxPrice !== undefined) addCondition('p.price <= ?', maxPrice)
  if (queryParams.search && typeof queryParams.search === 'string') {
    const search = `%${queryParams.search.trim().slice(0, 100)}%`
    values.push(search)
    const parameter = `$${values.length}`
    conditions.push(`(p.name ILIKE ${parameter} OR p.description ILIKE ${parameter})`)
  }
  if (queryParams.featured === 'true') conditions.push('p.featured = TRUE')

  const sortOptions = {
    popular: 'p.featured DESC, p.review_count DESC, p.created_at DESC',
    'price-asc': 'p.price ASC, p.id ASC',
    'price-desc': 'p.price DESC, p.id ASC',
    rating: 'p.rating DESC, p.review_count DESC',
    newest: 'p.created_at DESC',
  }
  const where = conditions.join(' AND ')
  const countResult = await query(
    `SELECT COUNT(*)::int AS total FROM products p WHERE ${where}`,
    values,
  )
  const total = countResult.rows[0].total
  const offset = (page - 1) * limit
  const productValues = [...values, limit, offset]
  const result = await query(
    `SELECT ${PRODUCT_COLUMNS} FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE ${where}
     ORDER BY ${sortOptions[queryParams.sort] || sortOptions.popular}
     LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    productValues,
  )
  return { products: result.rows, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }
}

async function getProductById(id) {
  requireValidId(id, 'product')
  const result = await query(
    `SELECT ${PRODUCT_COLUMNS} FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE p.id = $1 AND p.is_active = TRUE`,
    [id],
  )
  if (!result.rowCount) throw new ApiError(404, 'Product not found.')
  return result.rows[0]
}

async function resolveCategory(value) {
  const category = await findCategory(value)
  if (!category) throw new ApiError(400, 'Select an existing active category.')
  return category
}

async function createProduct(data) {
  const category = await resolveCategory(data.category)
  const image = Array.isArray(data.image) ? data.image : data.image ? [data.image] : []
  const result = await query(
    `INSERT INTO products
       (name, description, category_id, price, original_price, image, stock, featured)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id`,
    [data.name, data.description, category.id, data.price, data.originalPrice ?? null, image, data.stock, data.featured ?? false],
  )
  return getProductById(result.rows[0].id)
}

async function updateProduct(id, data) {
  requireValidId(id, 'product')
  const category = data.category ? await resolveCategory(data.category) : undefined
  const updates = {
    name: data.name,
    description: data.description,
    category_id: category?.id,
    price: data.price,
    original_price: data.originalPrice,
    image: data.image === undefined ? undefined : Array.isArray(data.image) ? data.image : data.image ? [data.image] : [],
    stock: data.stock,
    featured: data.featured,
  }
  const columns = {
    name: 'name',
    description: 'description',
    category_id: 'category_id',
    price: 'price',
    original_price: 'original_price',
    image: 'image',
    stock: 'stock',
    featured: 'featured',
  }
  const values = []
  const assignments = []
  for (const [field, value] of Object.entries(updates)) {
    if (value === undefined) continue
    values.push(value)
    assignments.push(`${columns[field]} = $${values.length}`)
  }
  if (!assignments.length) return getProductById(id)
  values.push(id)
  const result = await query(
    `UPDATE products SET ${assignments.join(', ')}, updated_at = NOW()
     WHERE id = $${values.length} AND is_active = TRUE`,
    values,
  )
  if (!result.rowCount) throw new ApiError(404, 'Product not found.')
  return getProductById(id)
}

async function archiveProduct(id) {
  requireValidId(id, 'product')
  const result = await query(
    `UPDATE products SET is_active = FALSE, updated_at = NOW()
     WHERE id = $1 AND is_active = TRUE
     RETURNING id AS "_id", name, description, category_id AS category,
       price::float8 AS price, original_price::float8 AS "originalPrice", image,
       stock, rating::float8 AS rating, review_count AS "reviewCount", featured,
       is_active AS "isActive", created_at AS "createdAt", updated_at AS "updatedAt"`,
    [id],
  )
  if (!result.rowCount) throw new ApiError(404, 'Product not found.')
  return result.rows[0]
}

module.exports = { archiveProduct, createProduct, getProductById, listProducts, updateProduct }
