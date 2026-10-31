const { isIP } = require('node:net')

function getMongoConfig(env = process.env) {
  const uri = env.MONGODB_URI?.trim()
  if (!uri) {
    throw new Error('MONGODB_URI is required. Add it to backend/.env before starting the API.')
  }
  if (!/^mongodb(?:\+srv)?:\/\//i.test(uri)) {
    throw new Error('MONGODB_URI must start with mongodb:// or mongodb+srv://.')
  }

  const timeoutValue = env.MONGODB_SERVER_SELECTION_TIMEOUT_MS
  const serverSelectionTimeoutMS = timeoutValue ? Number(timeoutValue) : 10000
  if (!Number.isSafeInteger(serverSelectionTimeoutMS) || serverSelectionTimeoutMS < 1) {
    throw new Error('MONGODB_SERVER_SELECTION_TIMEOUT_MS must be a positive integer.')
  }

  const dnsServersValue = env.MONGODB_DNS_SERVERS?.trim()
  const dnsServers = dnsServersValue
    ? dnsServersValue.split(',').map((server) => server.trim()).filter(Boolean)
    : []
  if (dnsServers.length && !uri.toLowerCase().startsWith('mongodb+srv://')) {
    throw new Error('MONGODB_DNS_SERVERS can only be used with a mongodb+srv:// URI.')
  }
  if (dnsServers.some((server) => !isIP(server))) {
    throw new Error('MONGODB_DNS_SERVERS must contain comma-separated IPv4 or IPv6 addresses.')
  }

  return {
    uri,
    options: { serverSelectionTimeoutMS },
    dnsServers,
  }
}

module.exports = { getMongoConfig }
