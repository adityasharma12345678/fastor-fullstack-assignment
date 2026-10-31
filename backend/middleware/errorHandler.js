function notFound(req, res) {
  return res.status(404).json({ success: false, message: 'Route not found.' })
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error)

  if (error.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: error.message })
  }
  if (error.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'The supplied resource ID is invalid.' })
  }
  if (error.code === 11000) {
    return res.status(409).json({ success: false, message: 'A record with these details already exists.' })
  }
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Request body must contain valid JSON.' })
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'The request body is too large.' })
  }

  console.error('Unhandled API error', error)
  return res.status(500).json({ success: false, message: 'An unexpected server error occurred.' })
}

module.exports = { notFound, errorHandler }
