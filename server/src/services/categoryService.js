const { query } = require('../config/db')
const ApiError = require('../utils/ApiError')
const { requireValidId } = require('../utils/identifiers')
const slugify = require('../utils/slugify')

const CATEGORY_COLUMNS = `id AS "_id", name, slug, description, image,
  is_active AS "isActive", created_at AS "createdAt", updated_at AS "updatedAt"`

async function listCategories() {
  const result = await query(
    `SELECT ${CATEGORY_COLUMNS} FROM categories WHERE is_active = TRUE ORDER BY name`,
  )
  return result.rows
}

async function createCategory(data) {
  try {
    const result = await query(
      `INSERT INTO categories (name, slug, description, image)
       VALUES ($1, $2, $3, $4)
       RETURNING ${CATEGORY_COLUMNS}`,
      [data.name, slugify(data.name), data.description || '', data.image || ''],
    )
    return result.rows[0]
  } catch (error) {
    if (error.code === '23505') throw new ApiError(409, 'A category with this name already exists.')
    throw error
  }
}

async function archiveCategory(id) {
  requireValidId(id, 'category')
  const activeProducts = await query(
    'SELECT 1 FROM products WHERE category_id = $1 AND is_active = TRUE LIMIT 1',
    [id],
  )
  if (activeProducts.rowCount) {
    throw new ApiError(409, 'Archive or move this category’s products before archiving it.')
  }
  const result = await query(
    `UPDATE categories SET is_active = FALSE, updated_at = NOW()
     WHERE id = $1 AND is_active = TRUE
     RETURNING ${CATEGORY_COLUMNS}`,
    [id],
  )
  if (!result.rowCount) throw new ApiError(404, 'Category not found.')
  return result.rows[0]
}

module.exports = { archiveCategory, createCategory, listCategories }
