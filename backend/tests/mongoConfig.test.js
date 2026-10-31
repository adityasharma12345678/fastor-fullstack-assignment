const test = require('node:test')
const assert = require('node:assert/strict')
const { getMongoConfig } = require('../config/mongoConfig')

test('accepts an Atlas SRV URI and optional DNS resolvers', () => {
  const uri = 'mongodb+srv://user:password@cluster0.example.mongodb.net/fastor_crm'
  const config = getMongoConfig({
    MONGODB_URI: uri,
    MONGODB_DNS_SERVERS: '1.1.1.1, 8.8.8.8',
  })

  assert.equal(config.uri, uri)
  assert.deepEqual(config.dnsServers, ['1.1.1.1', '8.8.8.8'])
  assert.equal(config.options.serverSelectionTimeoutMS, 10000)
})

test('accepts Atlas standard seed-list URIs without a DNS override', () => {
  const uri =
    'mongodb://user:password@host0.example:27017,host1.example:27017/fastor_crm?tls=true&replicaSet=atlas-example-shard-0&authSource=admin'
  const config = getMongoConfig({ MONGODB_URI: uri })

  assert.equal(config.uri, uri)
  assert.deepEqual(config.dnsServers, [])
})

test('rejects unsupported URI schemes and invalid DNS settings', () => {
  assert.throws(() => getMongoConfig({ MONGODB_URI: 'https://example.com' }), /mongodb:\/\/ or mongodb\+srv:\/\//)
  assert.throws(
    () => getMongoConfig({
      MONGODB_URI: 'mongodb+srv://user:password@cluster0.example.mongodb.net/fastor_crm',
      MONGODB_DNS_SERVERS: 'not-an-ip',
    }),
    /comma-separated IPv4 or IPv6 addresses/,
  )
})

test('rejects invalid server selection timeouts', () => {
  assert.throws(
    () => getMongoConfig({
      MONGODB_URI: 'mongodb://127.0.0.1:27017/fastor_crm',
      MONGODB_SERVER_SELECTION_TIMEOUT_MS: '-1',
    }),
    /positive integer/,
  )
})
