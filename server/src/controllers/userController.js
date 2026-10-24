const asyncHandler = require('../utils/asyncHandler')
const User = require('../models/User')
const ApiError = require('../utils/ApiError')

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('_id name email role createdAt').lean()
  if (!user) throw new ApiError(404, 'User not found.')
  res.json({ user })
})

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { name: req.body.name, email: req.body.email } },
    { new: true, runValidators: true, select: '_id name email role createdAt' },
  ).lean()
  if (!user) throw new ApiError(404, 'User not found.')
  res.json({ user })
})

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select('_id name email role createdAt')
    .sort({ createdAt: -1 })
    .limit(200)
    .lean()
  res.json({ users })
})

module.exports = { getProfile, getUsers, updateProfile }