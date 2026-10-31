const jwt = require('jsonwebtoken')
const Employee = require('../models/Employee')

async function requireAuth(req, res, next) {
  const authorization = req.get('authorization')
  const [scheme, token] = authorization ? authorization.split(' ') : []
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ success: false, message: 'A valid Bearer token is required.' })
  }

  const secret = process.env.JWT_SECRET
  if (!secret) return next(new Error('JWT_SECRET is not configured.'))

  try {
    const payload = jwt.verify(token, secret)
    if (typeof payload !== 'object' || !payload.sub) {
      return res.status(401).json({ success: false, message: 'The authentication token is invalid.' })
    }
    const employee = await Employee.findById(payload.sub)
    if (!employee) {
      return res.status(401).json({ success: false, message: 'The employee account for this token no longer exists.' })
    }
    req.employee = { id: employee._id.toString(), name: employee.name, email: employee.email }
    return next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'The authentication token is invalid or expired.' })
    }
    return next(error)
  }
}

module.exports = requireAuth
