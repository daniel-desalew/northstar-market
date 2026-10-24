const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    street: { type: String, required: true, trim: true, maxlength: 200 },
    street2: { type: String, trim: true, maxlength: 200, default: '' },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    state: { type: String, trim: true, maxlength: 100, default: '' },
    postalCode: { type: String, required: true, trim: true, maxlength: 20 },
    country: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, trim: true, maxlength: 30, default: '' },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
)

addressSchema.index({ user: 1, isDefault: -1, createdAt: -1 })

module.exports = mongoose.model('Address', addressSchema)