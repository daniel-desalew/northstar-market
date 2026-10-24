const asyncHandler = require('../utils/asyncHandler')
const productService = require('../services/productService')

const listProducts = asyncHandler(async (req, res) => {
  res.json(await productService.listProducts(req.query))
})

const getProduct = asyncHandler(async (req, res) => {
  res.json({ product: await productService.getProductById(req.params.id) })
})

const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body)
  res.status(201).json({ product })
})

const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body)
  res.json({ product })
})

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await productService.archiveProduct(req.params.id)
  res.json({ message: 'Product archived.', product })
})

module.exports = { createProduct, deleteProduct, getProduct, listProducts, updateProduct }