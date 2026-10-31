const express = require('express')
const { login, register } = require('../controllers/authController')
const { loginValidation, registerValidation } = require('../validations/authValidation')

const router = express.Router()

router.post('/register', registerValidation(), register)
router.post('/login', loginValidation(), login)

module.exports = router
