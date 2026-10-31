const express = require('express')
const { claimLead, createLead, getMyLeads, getUnclaimedLeads } = require('../controllers/leadController')
const requireAuth = require('../middleware/authMiddleware')
const { claimLeadValidation, createLeadValidation } = require('../validations/leadValidation')

const router = express.Router()

router.post('/', createLeadValidation(), createLead)

router.get('/unclaimed', requireAuth, getUnclaimedLeads)
router.get('/my-leads', requireAuth, getMyLeads)
router.post('/:id/claim', requireAuth, claimLeadValidation(), claimLead)

module.exports = router
