const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: Number.isInteger,
    },
  },
  { _id: false },
)

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
      validate: {
        validator(items) {
          const productIds = items.map((item) => String(item.product))
          return productIds.length === new Set(productIds).size
        },
        message: 'A product can only appear once in a cart.',
      },
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Cart', cartSchema)