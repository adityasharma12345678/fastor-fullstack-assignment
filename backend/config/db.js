const dns = require('node:dns')
const mongoose = require('mongoose')
const { getMongoConfig } = require('./mongoConfig')

async function connectDatabase() {
  const { uri, options, dnsServers } = getMongoConfig()
  const isSrvUri = uri.toLowerCase().startsWith('mongodb+srv://')

  if (dnsServers.length) {
    dns.setServers(dnsServers)
    console.log(`Using configured DNS servers for MongoDB SRV lookup: ${dnsServers.join(', ')}`)
  }

  try {
    await mongoose.connect(uri, options)
  } catch (error) {
    if (isSrvUri && hasSrvLookupFailure(error)) {
      throw new Error(
        'MongoDB Atlas SRV DNS lookup failed. Check whether the configured DNS resolver permits SRV queries. Set MONGODB_DNS_SERVERS to reachable DNS server IPs, or use the standard mongodb:// seed-list URI from Atlas. This DNS error does not indicate that the Atlas cluster itself is unhealthy.',
        { cause: error },
      )
    }

    if (Number(error.code) === 8000 || /bad auth|authentication failed/i.test(error.message || '')) {
      throw new Error(
        'MongoDB authentication failed. Verify the Atlas Database Access username and password, and URL-encode reserved characters in both credentials.',
        { cause: error },
      )
    }

    const reason = error.message.replace(/mongodb(?:\+srv)?:\/\/\S+/gi, '[redacted MongoDB URI]')
    throw new Error(`MongoDB connection failed: ${error.code ? `${error.code}: ` : ''}${reason}`, {
      cause: error,
    })
  }

  console.log(`MongoDB connected: ${mongoose.connection.host}`)
}

function hasSrvLookupFailure(error) {
  for (let current = error; current; current = current.cause) {
    if (/querySrv|_mongodb\._tcp/i.test(current.message || '')) return true
  }
  return false
}

module.exports = connectDatabase
