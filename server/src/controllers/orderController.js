const asyncHandler = require('../utils/asyncHandler')
const orderService = require('../services/orderService')

const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user._id, req.body)
  res.status(201).json({ order })
})

const getMyOrders = asyncHandler(async (req, res) => {
  res.json(await orderService.listUserOrders(req.user._id, req.query))
})

const getMyOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getUserOrder(req.user._id, req.params.id)
  res.json({ order })
})

const getAdminOrders = asyncHandler(async (req, res) => {
  res.json(await orderService.listAllOrders(req.query))
})

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.changeOrderStatus(req.params.id, req.body.status)
  res.json({ order })
})

module.exports = {
  createOrder,
  getAdminOrders,
  getMyOrder,
  getMyOrders,
  updateOrderStatus,
}