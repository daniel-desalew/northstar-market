const mongoose = require('mongoose')
const Order = require('../models/Order')
const Product = require('../models/Product')
const ApiError = require('../utils/ApiError')

const FREE_SHIPPING_THRESHOLD = 50
const STANDARD_SHIPPING_PRICE = 5.99

async function createOrder(userId, { items, shippingAddress }) {
  const quantities = new Map()
  for (const item of items) {
    quantities.set(item.product, (quantities.get(item.product) ?? 0) + item.quantity)
  }

  const session = await mongoose.startSession()
  let createdOrder

  try {
    await session.withTransaction(async () => {
      const productIds = [...quantities.keys()]
      const products = await Product.find({
        _id: { $in: productIds },
        isActive: true,
      }).session(session)
      const productsById = new Map(products.map((product) => [String(product._id), product]))

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

        const stockUpdate = await Product.updateOne(
          { _id: product._id, isActive: true, stock: { $gte: quantity } },
          { $inc: { stock: -quantity } },
          { session },
        )
        if (stockUpdate.modifiedCount !== 1) {
          throw new ApiError(409, `Stock changed while ordering "${product.name}". Please retry.`)
        }

        orderItems.push({
          product: product._id,
          name: product.name,
          image: product.image[0] ?? '',
          price: product.price,
          quantity,
        })
      }

      const subtotal = orderItems.reduce((total, item) => total + item.price * item.quantity, 0)
      const shippingPrice = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_PRICE
      const [order] = await Order.create(
        [{
          user: userId,
          items: orderItems,
          shippingAddress,
          subtotal,
          shippingPrice,
          totalPrice: subtotal + shippingPrice,
        }],
        { session },
      )
      createdOrder = order
    })
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (error.code === 20 || error.codeName === 'IllegalOperation') {
      throw new ApiError(
        503,
        'Order placement requires MongoDB transactions. Use MongoDB Atlas or a local replica set.',
      )
    }
    throw error
  } finally {
    await session.endSession()
  }

  return createdOrder
}

async function listUserOrders(userId, { page = 1, limit = 20 } = {}) {
  const currentPage = Math.max(1, Number.parseInt(page, 10) || 1)
  const pageSize = Math.min(50, Math.max(1, Number.parseInt(limit, 10) || 20))
  const filter = { user: userId }
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Order.countDocuments(filter),
  ])
  return {
    orders,
    pagination: {
      page: currentPage,
      limit: pageSize,
      total,
      pages: Math.ceil(total / pageSize),
    },
  }
}

async function getUserOrder(userId, orderId) {
  if (!mongoose.isValidObjectId(orderId)) throw new ApiError(400, 'Invalid order identifier.')
  const order = await Order.findOne({ _id: orderId, user: userId }).lean()
  if (!order) throw new ApiError(404, 'Order not found.')
  return order
}

async function listAllOrders({ page = 1, limit = 50 } = {}) {
  const currentPage = Math.max(1, Number.parseInt(page, 10) || 1)
  const pageSize = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 50))
  const [orders, total] = await Promise.all([
    Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Order.countDocuments(),
  ])
  return {
    orders,
    pagination: { page: currentPage, limit: pageSize, total, pages: Math.ceil(total / pageSize) },
  }
}

async function changeOrderStatus(orderId, status) {
  if (!mongoose.isValidObjectId(orderId)) throw new ApiError(400, 'Invalid order identifier.')
  const order = await Order.findByIdAndUpdate(
    orderId,
    { $set: { status } },
    { new: true, runValidators: true },
  )
  if (!order) throw new ApiError(404, 'Order not found.')
  return order
}

module.exports = {
  changeOrderStatus,
  createOrder,
  getUserOrder,
  listAllOrders,
  listUserOrders,
}