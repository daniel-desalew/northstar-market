require('dotenv').config()

const fs = require('node:fs/promises')
const path = require('node:path')
const { MongoClient } = require('mongodb')
const { Pool } = require('pg')

function id(value) {
  return value == null ? null : String(value)
}

function date(value) {
  return value ? new Date(value) : new Date()
}

async function upsert(client, table, columns, values, jsonColumns = []) {
  const placeholders = values.map((_, index) =>
    jsonColumns.includes(index) ? `$${index + 1}::jsonb` : `$${index + 1}`,
  )
  const updates = columns
    .filter((column) => column !== 'id')
    .map((column) => `${column} = EXCLUDED.${column}`)
  await client.query(
    `INSERT INTO ${table} (${columns.join(', ')})
     VALUES (${placeholders.join(', ')})
     ON CONFLICT (id) DO UPDATE SET ${updates.join(', ')}`,
    values.map((value, index) => jsonColumns.includes(index) ? JSON.stringify(value) : value),
  )
}

async function migrateCollection(mongo, postgres, collection, migrateDocument) {
  let count = 0
  for await (const document of mongo.collection(collection).find({})) {
    await migrateDocument(document)
    count += 1
  }
  console.info(`Migrated ${count} ${collection}.`)
}

async function migrate() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI must point to the source MongoDB database.')
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL must point to the target Neon PostgreSQL database.')

  const mongoClient = new MongoClient(process.env.MONGODB_URI)
  const postgres = new Pool({ connectionString: process.env.DATABASE_URL })
  try {
    await mongoClient.connect()
    const schema = await fs.readFile(path.join(__dirname, '..', 'config', 'schema.sql'), 'utf8')
    await postgres.query(schema)
    const mongo = mongoClient.db()
    const client = await postgres.connect()
    try {
      await client.query('BEGIN')
      await migrateCollection(mongo, client, 'users', (doc) => upsert(client, 'users', [
        'id', 'name', 'email', 'password_hash', 'role', 'is_active', 'created_at', 'updated_at',
      ], [
        id(doc._id), doc.name, doc.email, doc.passwordHash, doc.role || 'customer',
        doc.isActive !== false, date(doc.createdAt), date(doc.updatedAt || doc.createdAt),
      ]))
      await migrateCollection(mongo, client, 'categories', (doc) => upsert(client, 'categories', [
        'id', 'name', 'slug', 'description', 'image', 'is_active', 'created_at', 'updated_at',
      ], [
        id(doc._id), doc.name, doc.slug, doc.description || '', doc.image || '',
        doc.isActive !== false, date(doc.createdAt), date(doc.updatedAt || doc.createdAt),
      ]))
      await migrateCollection(mongo, client, 'products', (doc) => upsert(client, 'products', [
        'id', 'name', 'description', 'category_id', 'price', 'original_price', 'image',
        'stock', 'rating', 'review_count', 'featured', 'is_active', 'created_at', 'updated_at',
      ], [
        id(doc._id), doc.name, doc.description, id(doc.category), Number(doc.price),
        doc.originalPrice == null ? null : Number(doc.originalPrice), Array.isArray(doc.image) ? doc.image : [],
        Number(doc.stock), Number(doc.rating || 0), Number(doc.reviewCount || 0),
        Boolean(doc.featured), doc.isActive !== false, date(doc.createdAt), date(doc.updatedAt || doc.createdAt),
      ]))
      await migrateCollection(mongo, client, 'addresses', (doc) => upsert(client, 'addresses', [
        'id', 'user_id', 'full_name', 'street', 'street2', 'city', 'state', 'postal_code',
        'country', 'phone', 'is_default', 'created_at', 'updated_at',
      ], [
        id(doc._id), id(doc.user), doc.fullName, doc.street, doc.street2 || '', doc.city,
        doc.state || '', doc.postalCode, doc.country, doc.phone || '', Boolean(doc.isDefault),
        date(doc.createdAt), date(doc.updatedAt || doc.createdAt),
      ]))
      await migrateCollection(mongo, client, 'carts', (doc) => upsert(client, 'carts', [
        'id', 'user_id', 'items', 'created_at', 'updated_at',
      ], [
        id(doc._id), id(doc.user),
        (doc.items || []).map((item) => ({ product: id(item.product), quantity: item.quantity })),
        date(doc.createdAt), date(doc.updatedAt || doc.createdAt),
      ], [2]))
      await migrateCollection(mongo, client, 'orders', (doc) => upsert(client, 'orders', [
        'id', 'user_id', 'items', 'shipping_address', 'subtotal', 'shipping_price', 'total_price',
        'status', 'payment_status', 'payment_provider', 'payment_intent_id', 'created_at', 'updated_at',
      ], [
        id(doc._id), id(doc.user),
        (doc.items || []).map((item) => ({
          product: id(item.product),
          name: item.name,
          image: item.image || '',
          price: Number(item.price),
          quantity: Number(item.quantity),
        })),
        doc.shippingAddress || {}, Number(doc.subtotal), Number(doc.shippingPrice || 0),
        Number(doc.totalPrice), doc.status || 'pending', doc.paymentStatus || 'unpaid',
        doc.paymentProvider || null, doc.paymentIntentId || null,
        date(doc.createdAt), date(doc.updatedAt || doc.createdAt),
      ], [2, 3]))
      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
    console.info('MongoDB data migration completed. MongoDB was not modified.')
  } finally {
    await Promise.all([mongoClient.close(), postgres.end()])
  }
}

migrate().catch((error) => {
  console.error('MongoDB to PostgreSQL migration failed:', error)
  process.exitCode = 1
})
