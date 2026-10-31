const mongoose = require('mongoose')

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    courseInterest: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },
    claimed: {
      type: Boolean,
      default: false,
      required: true,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
  },
  { timestamps: true },
)

leadSchema.index({ claimed: 1, createdAt: 1 })
leadSchema.index({ claimedBy: 1, updatedAt: -1 })

module.exports = mongoose.model('Lead', leadSchema)
