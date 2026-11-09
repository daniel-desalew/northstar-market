const { getPool, query } = require('../config/db')
const ApiError = require('../utils/ApiError')
const { requireValidId } = require('../utils/identifiers')

const FREE_SHIPPING_THRESHOLD = 50
const STANDARD_SHIPPING_PRICE = 5.99
function orderColumns(table = '', includeUser = true) {
  const column = (name) => `${table ? `${table}.` : ''}${name}`
  return [
    `${column('id')} AS "_id"`,
    includeUser ? `${column('user_id')} AS "user"` : null,
    `${column('items')}`,
    `${column('shipping_address')} AS "shippingAddress"`,
    `${column('subtotal')}::float8 AS subtotal`,
    `${column('shipping_price')}::float8 AS "shippingPrice"`,
    `${column('total_price')}::float8 AS "totalPrice"`,
    `${column('status')}`,
    `${column('payment_status')} AS "paymentStatus"`,
    `${column('payment_provider')} AS "paymentProvider"`,
    `${column('payment_intent_id')} AS "paymentIntentId"`,
    `${column('created_at')} AS "createdAt"`,
    `${column('updated_at')} AS "updatedAt"`,
  ].filter(Boolean).join(', ')
}

async function createOrder(userId, { items, shippingAddress }) {
  const quantities = new Map()
  for (const item of items) {
    requireValidId(item.product, 'product')
    quantities.set(item.product, (quantities.get(item.product) || 0) + item.quantity)
  }

  const client = await getPool().connect()
  try {
    await client.query('BEGIN')
    const productIds = [...quantities.keys()]
    const { rows: products } = await client.query(
      `SELECT id, name, price::float8 AS price, image, stock FROM products
       WHERE id = ANY($1::text[]) AND is_active = TRUE FOR UPDATE`,
      [productIds],
    )
    const productsById = new Map(products.map((product) => [product.id, product]))
    if (productsById.size !== productIds.length) {
      throw new ApiError(409, 'One or more products are no longer available.')
    }

    const orderItems = []
    for (const [productId, quantity] of quantities) {
      const product = productsById.get(productId)
      if (product.stock < quantity) {
        throw new ApiError(409, `Insufficient stock for "${product.name}".`)
      }
      if (product.price < 0 || !Number.isFinite(product.price)) {
        throw new ApiError(409, `Product "${product.name}" has an invalid price.`)
      }
      const stockUpdate = await client.query(
        `UPDATE products SET stock = stock - $1, updated_at = NOW()
         WHERE id = $2 AND is_active = TRUE AND stock >= $1`,
        [quantity, productId],
      )
      if (stockUpdate.rowCount !== 1) {
        throw new ApiError(409, `Stock changed while ordering "${product.name}". Please retry.`)
      }
      orderItems.push({
        product: productId,
        name: product.name,
        image: product.image[0] || '',
        price: product.price,
        quantity,
      })
    }

    const subtotal = orderItems.reduce((total, item) => total + item.price * item.quantity, 0)
    const shippingPrice = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_PRICE
    const result = await client.query(
      `INSERT INTO orders
         (user_id, items, shipping_address, subtotal, shipping_price, total_price)
       VALUES ($1, $2::jsonb, $3::jsonb, $4, $5, $6)
       RETURNING ${orderColumns()}`,
      [userId, JSON.stringify(orderItems), JSON.stringify(shippingAddress), subtotal, shippingPrice, subtotal + shippingPrice],
    )
    await client.query('COMMIT')
    return result.rows[0]
  } catch (error) {
    try {
      await client.query('ROLLBACK')
    } catch (rollbackError) {
      console.error('Order transaction rollback failed:', rollbackError)
    }
    throw error
  } finally {
    client.release()
  }
}

async function listUserOrders(userId, { page = 1, limit = 20 } = {}) {
  const currentPage = Math.max(1, Number.parseInt(page, 10) || 1)
  const pageSize = Math.min(50, Math.max(1, Number.parseInt(limit, 10) || 20))
  const offset = (currentPage - 1) * pageSize
  const [orders, count] = await Promise.all([
    query(
      `SELECT ${orderColumns()} FROM orders WHERE user_id = $1
       ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [userId, pageSize, offset],
    ),
    query('SELECT COUNT(*)::int AS total FROM orders WHERE user_id = $1', [userId]),
  ])
  const total = count.rows[0].total
  return {
    orders: orders.rows,
    pagination: { page: currentPage, limit: pageSize, total, pages: Math.ceil(total / pageSize) },
  }
}

async function getUserOrder(userId, orderId) {
  requireValidId(orderId, 'order')
  const result = await query(
    `SELECT ${orderColumns()} FROM orders WHERE id = $1 AND user_id = $2`,
    [orderId, userId],
  )
  if (!result.rowCount) throw new ApiError(404, 'Order not found.')
  return result.rows[0]
}

async function listAllOrders({ page = 1, limit = 50 } = {}) {
  const currentPage = Math.max(1, Number.parseInt(page, 10) || 1)
  const pageSize = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 50))
  const offset = (currentPage - 1) * pageSize
  const [orders, count] = await Promise.all([
    query(
      `SELECT ${orderColumns('o', false)}, json_build_object(
         '_id', u.id, 'name', u.name, 'email', u.email
       ) AS user
       FROM orders o JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC LIMIT $1 OFFSET $2`,
      [pageSize, offset],
    ),
    query('SELECT COUNT(*)::int AS total FROM orders'),
  ])
  const total = count.rows[0].total
  return {
    orders: orders.rows,
    pagination: { page: currentPage, limit: pageSize, total, pages: Math.ceil(total / pageSize) },
  }
}

async function changeOrderStatus(orderId, status) {
  requireValidId(orderId, 'order')
  const result = await query(
    `UPDATE orders SET status = $1, updated_at = NOW()
     WHERE id = $2 RETURNING ${orderColumns()}`,
    [status, orderId],
  )
  if (!result.rowCount) throw new ApiError(404, 'Order not found.')
  return result.rows[0]
}

module.exports = {
  changeOrderStatus,
  createOrder,
  getUserOrder,
  listAllOrders,
  listUserOrders,
}
