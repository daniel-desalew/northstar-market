const { z } = require('zod')

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      product: z.string().regex(
        /^(?:[a-f\d]{24}|[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i,
        'Product ID must be a valid identifier.',
      ),
      quantity: z.coerce.number().int().min(1).max(100),
    }),
  ).min(1).max(50),
  shippingAddress: z.object({
    fullName: z.string().trim().min(1).max(100),
    street: z.string().trim().min(1).max(200),
    street2: z.string().trim().max(200).optional(),
    city: z.string().trim().min(1).max(100),
    state: z.string().trim().max(100).optional(),
    postalCode: z.string().trim().min(1).max(20),
    country: z.string().trim().min(1).max(100),
    phone: z.string().trim().max(30).optional(),
  }),
})

const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
})

module.exports = { createOrderSchema, updateOrderStatusSchema }