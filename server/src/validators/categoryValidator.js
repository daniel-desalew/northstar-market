const { z } = require('zod')

const categorySchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(500).optional(),
  image: z.string().trim().max(500).optional(),
})

module.exports = { categorySchema }
