const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Employee = require('../models/Employee')

function createToken(employeeId) {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is required to issue authentication tokens.')
  return jwt.sign({}, secret, {
    subject: employeeId.toString(),
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  })
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body
    const existingEmployee = await Employee.exists({ email })
    if (existingEmployee) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' })
    }

    const employee = await Employee.create({ name, email, password })
    return res.status(201).json({
      success: true,
      data: {
        employee: employee.toPublicJSON(),
        token: createToken(employee._id),
      },
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' })
    }
    return next(error)
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const employee = await Employee.findOne({ email }).select('+password')
    if (!employee || !(await bcrypt.compare(password, employee.password))) {
      return res.status(401).json({ success: false, message: 'Email or password is incorrect.' })
    }

    return res.status(200).json({
      success: true,
      data: {
        employee: employee.toPublicJSON(),
        token: createToken(employee._id),
      },
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = { register, login }
