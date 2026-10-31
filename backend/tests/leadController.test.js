const assert = require('node:assert/strict')
const test = require('node:test')
const Lead = require('../models/Lead')
const { claimLead, createLead } = require('../controllers/leadController')

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code
      return this
    },
    json(body) {
      this.body = body
      return this
    },
  }
}

test('public lead creation ignores client-supplied ownership fields', async () => {
  const originalCreate = Lead.create
  const response = createResponse()
  const createdLead = { _id: 'lead-1', claimed: false, claimedBy: null }
  let createdFields
  Lead.create = async (fields) => {
    createdFields = fields
    return createdLead
  }

  try {
    await createLead(
      {
        body: {
          name: 'Ravi Kumar',
          email: 'ravi@example.com',
          phone: '+91 9876543210',
          courseInterest: 'Analytics',
          claimed: true,
          claimedBy: 'employee-1',
        },
      },
      response,
      (error) => {
        throw error
      },
    )
    assert.deepEqual(createdFields, {
      name: 'Ravi Kumar',
      email: 'ravi@example.com',
      phone: '+91 9876543210',
      courseInterest: 'Analytics',
    })
    assert.equal(response.statusCode, 201)
  } finally {
    Lead.create = originalCreate
  }
})

test('claim updates only an unclaimed lead and assigns the authenticated employee', async () => {
  const originalFindOneAndUpdate = Lead.findOneAndUpdate
  const response = createResponse()
  const claimedLead = { _id: 'lead-1', claimed: true, claimedBy: 'employee-1' }
  let updateArguments
  Lead.findOneAndUpdate = async (...args) => {
    updateArguments = args
    return claimedLead
  }

  try {
    await claimLead(
      { params: { id: 'lead-1' }, employee: { id: 'employee-1' } },
      response,
      (error) => {
        throw error
      },
    )
    assert.deepEqual(updateArguments, [
      { _id: 'lead-1', claimed: false },
      { $set: { claimed: true, claimedBy: 'employee-1' } },
      { new: true, runValidators: true },
    ])
    assert.equal(response.statusCode, 200)
    assert.deepEqual(response.body, { success: true, data: claimedLead })
  } finally {
    Lead.findOneAndUpdate = originalFindOneAndUpdate
  }
})

test('claim returns conflict when the lead was already claimed', async () => {
  const originalFindOneAndUpdate = Lead.findOneAndUpdate
  const originalExists = Lead.exists
  const response = createResponse()
  Lead.findOneAndUpdate = async () => null
  Lead.exists = async () => ({ _id: 'lead-1' })

  try {
    await claimLead(
      { params: { id: 'lead-1' }, employee: { id: 'employee-2' } },
      response,
      (error) => {
        throw error
      },
    )
    assert.equal(response.statusCode, 409)
    assert.deepEqual(response.body, { success: false, message: 'This lead has already been claimed.' })
  } finally {
    Lead.findOneAndUpdate = originalFindOneAndUpdate
    Lead.exists = originalExists
  }
})
