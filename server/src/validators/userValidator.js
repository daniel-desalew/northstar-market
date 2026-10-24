const { z } = require('zod')

const profileSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
})

module.exports = { profileSchema }