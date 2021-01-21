// utils
const ApiResponse = require('../../utils/ApiResponse')
const IsNull = require('../../utils/isNull')

// db queries
const dbAuditors = require('../../database/user/auditors.queries')
const dbAssessmentRecords = require('../../database/admin/assessment_records.queries')

module.exports.getAllAuditors = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const auditors = await dbAuditors.getAuditors()
    apiResponse.data.auditors = auditors
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.getAuditor = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iAuditorId } = req.params
    const auditor = await dbAuditors.getAuditor(iAuditorId)
    apiResponse.data.auditor = auditor
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.getAuditorsByAssessment = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iAssessmentId } = req.params
    const auditors = await dbAuditors.getAuditorsByAssessmentId(iAssessmentId)
    apiResponse.data.auditors = auditors
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.createAuditor = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    let { vFirstName, vLastName, vEmail, vPhone, vCompany, iAssessmentId } = req.body
    vFirstName = vFirstName.trim()
    vLastName = vLastName.trim()
    vEmail = vEmail.trim()
    vPhone = vPhone.trim()
    vCompany = vCompany.trim()
    if (IsNull(vFirstName)) {
      apiResponse.errors.push('First name is required')
    }
    if (IsNull(vLastName)) {
      apiResponse.errors.push('Last name is required')
    }
    if (IsNull(vEmail)) {
      apiResponse.errors.push('Email is required')
    }
    if (IsNull(vPhone)) {
      apiResponse.errors.push('Phone number is required')
    }
    if (IsNull(vCompany)) {
      apiResponse.errors.push('Company is required')
    }
    if (IsNull(iAssessmentId)) {
      apiResponse.errors.push('Assessment id is required')
    }

    const assessment = await dbAssessmentRecords.getAssessmentRecordById(iAssessmentId)

    if (IsNull(assessment)) {
      apiResponse.message = 'Assessment record not found'
      return res.status(404).json(apiResponse)
    }

    const newAuditor = await dbAuditors.createAuditor({ iAssessmentId, vCompany, vEmail, vFirstName, vLastName, vPhone })
    if (newAuditor.affectedRows > 0) {
      apiResponse.message = 'Auditor has been created successfully'
    }
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.deleteAuditor = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iAuditorId } = req.params

    const auditor = await dbAuditors.getAuditor(iAuditorId)
    if (IsNull(auditor)) {
      apiResponse.message = 'Auditor not found'
      return res.status(404).json(apiResponse)
    }

    const deletedAuditor = await dbAuditors.deleteAuditor(iAuditorId)
    if (deletedAuditor.affectedRows > 0) {
      apiResponse.message = 'Auditor deleted successfully'
    } else {
      apiResponse.message = 'Could not delete auditor'
    }
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.updateAuditor = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iAuditorId } = req.params
    let { vFirstName, vLastName, vEmail, vPhone, vCompany } = req.body
    vFirstName = vFirstName.trim()
    vLastName = vLastName.trim()
    vEmail = vEmail.trim()
    vPhone = vPhone.trim()
    vCompany = vCompany.trim()

    const data = {}

    if (IsNull(iAuditorId)) {
      apiResponse.message = 'Auditor id is required'
      return res.status(500).json(apiResponse)
    }

    const auditor = await dbAuditors.getAuditor(iAuditorId)
    if (IsNull(auditor)) {
      apiResponse.message = 'Auditor not found'
      return res.status(404).json(apiResponse)
    }

    if (!IsNull(vFirstName)) {
      data.vFirstName = vFirstName
    }
    if (!IsNull(vLastName)) {
      data.vLastName = vLastName
    }
    if (!IsNull(vEmail)) {
      data.vEmail = vEmail
    }
    if (!IsNull(vPhone)) {
      data.vPhone = vPhone
    }
    if (!IsNull(vCompany)) {
      data.vCompany = vCompany
    }

    const updatedAuditor = await dbAuditors.updateAuditor(data, iAuditorId)
    if (updatedAuditor.affectedRows > 0) {
      apiResponse.message = 'Auditor has been updated successfully'
    } else {
      apiResponse.message = 'Could not update auditor.'
    }
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}