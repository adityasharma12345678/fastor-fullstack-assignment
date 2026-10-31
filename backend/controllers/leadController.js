const Lead = require('../models/Lead')

async function createLead(req, res, next) {
  try {
    const { name, email, phone, courseInterest } = req.body
    const lead = await Lead.create({ name, email, phone, courseInterest })
    return res.status(201).json({ success: true, data: lead })
  } catch (error) {
    return next(error)
  }
}

async function getUnclaimedLeads(req, res, next) {
  try {
    const leads = await Lead.find({ claimed: false }).sort({ createdAt: 1 })
    return res.status(200).json({ success: true, data: leads })
  } catch (error) {
    return next(error)
  }
}

async function claimLead(req, res, next) {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, claimed: false },
      { $set: { claimed: true, claimedBy: req.employee.id } },
      { new: true, runValidators: true },
    )

    if (lead) return res.status(200).json({ success: true, data: lead })

    const existingLead = await Lead.exists({ _id: req.params.id })
    if (!existingLead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' })
    }

    return res.status(409).json({ success: false, message: 'This lead has already been claimed.' })
  } catch (error) {
    return next(error)
  }
}

async function getMyLeads(req, res, next) {
  try {
    const leads = await Lead.find({ claimed: true, claimedBy: req.employee.id }).sort({ updatedAt: -1 })
    return res.status(200).json({ success: true, data: leads })
  } catch (error) {
    return next(error)
  }
}

module.exports = { createLead, getUnclaimedLeads, claimLead, getMyLeads }
