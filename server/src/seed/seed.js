require('dotenv').config()

const { closeDatabase, connectDatabase, query } = require('../config/db')
const { categories, products } = require('./sampleProducts')
const slugify = require('../utils/slugify')

async function seed() {
  await connectDatabase()
  const categoryIds = new Map()

  for (const data of categories) {
    const result = await query(
      `INSERT INTO categories (name, slug, description, image, is_active)
       VALUES ($1, $2, $3, $4, TRUE)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name, description = EXCLUDED.description,
         image = EXCLUDED.image, is_active = TRUE, updated_at = NOW()
       RETURNING id`,
      [data.name, slugify(data.name), data.description, data.image],
    )
    categoryIds.set(data.name, result.rows[0].id)
  }

  for (const data of products) {
    const values = [
      data.name,
      data.description,
      categoryIds.get(data.category),
      data.price,
      data.originalPrice,
      data.image,
      data.stock,
      data.rating,
      data.reviewCount,
      data.featured,
    ]
    const existing = await query('SELECT id FROM products WHERE name = $1 ORDER BY created_at LIMIT 1', [data.name])
    if (existing.rowCount) {
      await query(
        `UPDATE products SET
           description = $1, category_id = $2, price = $3, original_price = $4,
           image = $5, stock = $6, rating = $7, review_count = $8,
           featured = $9, is_active = TRUE, updated_at = NOW()
         WHERE id = $10`,
        [...values.slice(1), existing.rows[0].id],
      )
    } else {
      await query(
        `INSERT INTO products
           (name, description, category_id, price, original_price, image, stock, rating, review_count, featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        values,
      )
    }
  }

  console.info(`Seeded ${categories.length} categories and ${products.length} products. Existing unrelated records were not deleted.`)
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exitCode = 1
  })
  .finally(closeDatabase)
