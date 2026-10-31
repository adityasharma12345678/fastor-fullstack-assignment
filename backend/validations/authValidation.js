const { body } = require('express-validator')
const validateRequest = require('../middleware/validateRequest')

function emailValidation() {
  return body('email')
    .trim()
    .isEmail()
    .withMessage('Enter a valid email address.')
    .normalizeEmail()
}

function registerValidation() {
  return [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),
    emailValidation(),
    body('password')
      .isString()
      .isLength({ min: 8, max: 128 })
      .withMessage('Password must be between 8 and 128 characters.'),
    validateRequest,
  ]
}

function loginValidation() {
  return [
    emailValidation(),
    body('password').isString().notEmpty().withMessage('Password is required.'),
    validateRequest,
  ]
}

module.exports = { loginValidation, registerValidation }
