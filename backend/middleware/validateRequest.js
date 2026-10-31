const { validationResult } = require('express-validator')

function validateRequest(req, res, next) {
  const errors = validationResult(req)
  if (errors.isEmpty()) return next()

  return res.status(400).json({
    success: false,
    message: 'Please check the submitted fields.',
    errors: errors.array().map(({ path, msg }) => ({ field: path, message: msg })),
  })
}

module.exports = validateRequest
