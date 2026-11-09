const asyncHandler = require('../utils/asyncHandler')
const { query } = require('../config/db')
const ApiError = require('../utils/ApiError')

const USER_COLUMNS = `id AS "_id", name, email, role, created_at AS "createdAt"`

const getProfile = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT ${USER_COLUMNS} FROM users WHERE id = $1`,
    [req.user._id],
  )
  if (!result.rowCount) throw new ApiError(404, 'User not found.')
  res.json({ user: result.rows[0] })
})

const updateProfile = asyncHandler(async (req, res) => {
  try {
    const result = await query(
      `UPDATE users SET name = $1, email = $2, updated_at = NOW()
       WHERE id = $3 RETURNING ${USER_COLUMNS}`,
      [req.body.name, req.body.email.trim().toLowerCase(), req.user._id],
    )
    if (!result.rowCount) throw new ApiError(404, 'User not found.')
    res.json({ user: result.rows[0] })
  } catch (error) {
    if (error.code === '23505') throw new ApiError(409, 'An account with this email already exists.')
    throw error
  }
})

const getUsers = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT ${USER_COLUMNS} FROM users ORDER BY created_at DESC LIMIT 200`,
  )
  res.json({ users: result.rows })
})

module.exports = { getProfile, getUsers, updateProfile }
