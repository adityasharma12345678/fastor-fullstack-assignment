const { body, param } = require('express-validator')
const validateRequest = require('../middleware/validateRequest')

function createLeadValidation() {
  return [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),
    body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
    body('phone')
      .trim()
      .isLength({ min: 7, max: 20 })
      .withMessage('Phone must be between 7 and 20 characters.')
      .bail()
      .custom((value) => {
        if (value.replace(/\D/g, '').length < 7) throw new Error('Enter a valid phone number.')
        return true
      }),
    body('courseInterest')
      .trim()
      .isLength({ min: 2, max: 150 })
      .withMessage('Course interest must be between 2 and 150 characters.'),
    validateRequest,
  ]
}

function claimLeadValidation() {
  return [param('id').isMongoId().withMessage('Lead ID is invalid.'), validateRequest]
}

module.exports = { claimLeadValidation, createLeadValidation }
