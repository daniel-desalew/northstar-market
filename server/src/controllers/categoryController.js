const asyncHandler = require('../utils/asyncHandler')
const categoryService = require('../services/categoryService')

const listCategories = asyncHandler(async (req, res) => {
  res.json({ categories: await categoryService.listCategories() })
})

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body)
  res.status(201).json({ category })
})

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.archiveCategory(req.params.id)
  res.json({ message: 'Category archived.', category })
})

module.exports = { createCategory, deleteCategory, listCategories }