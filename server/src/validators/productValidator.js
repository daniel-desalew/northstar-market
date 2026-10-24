const { z } = require('zod')

const productSchema = z.object({
  name: z.string().trim().min(1).max(180),
  description: z.string().trim().min(1).max(5000),
  category: z.string().trim().min(1),
  price: z.coerce.number().finite().nonnegative(),
  originalPrice: z.coerce.number().finite().nonnegative().optional(),
  image: z.union([
    z.string().url(),
    z.array(z.string().url()).max(10),
  ]).optional(),
  stock: z.coerce.number().int().nonnegative(),
  featured: z.boolean().optional(),
})

module.exports = { productSchema }