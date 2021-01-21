const ApiResponse = require('../../utils/ApiResponse')

// utils
const isNull = require('../../utils/isNull')

// db queries
const dbAssessmentRecords = require('../../database/admin/assessment_records.queries')
const dbAssessmentTypes = require('../../database/admin/assessment_type.queries')
const dbOrganizations = require('../../database/admin/organization_mas.queries')
const dbCustomers = require('../../database/admin/customers.queries')
const dbChecklistRecords = require('../../database/admin/checklist_records.queries')

// List assessment records
module.exports.listAssessmentRecords = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iOrganizationId } = req.query
    const assessmentRecordList = await dbAssessmentRecords.listAssessmentRecords(iOrganizationId)
    apiResponse.data.assessmentRecords = assessmentRecordList
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Get assessment record
module.exports.getAssessmentRecord = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { id } = req.params
    const assessmentRecord = await dbAssessmentRecords.getAssessmentRecordById(
      id
    )

    if (isNull(assessmentRecord)) {
      apiResponse.message = 'Assessment record not found'
      return res.status(404).json(apiResponse)
    }

    apiResponse.data.assessmentRecord = assessmentRecord
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(200).json(apiResponse)
  }
}

// Create assessment record
module.exports.createAssessmentRecord = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const {
      iATMId,
      iOrganizationId,
      iATMName,
      AssessmentStatus,
      iCertifyingUserId
    } = req.body

    if (isNull(iATMId)) {
      apiResponse.errors.push('Assessment Type is required')
    }

    if (isNull(iOrganizationId)) {
      apiResponse.errors.push('Organization is required')
    }

    if (isNull(iATMName)) {
      apiResponse.errors.push('Assessment Name is required')
    }

    if (isNull(AssessmentStatus)) {
      apiResponse.errors.push('Assessment Status is required')
    }

    if (isNull(iCertifyingUserId)) {
      apiResponse.errors.push('Certifying user is requried')
    }

    if (apiResponse.errors.length > 0) {
      return res.status(422).json(apiResponse)
    }

    const organization = await dbOrganizations.getOrganization(iOrganizationId)

    if (isNull(organization)) {
      apiResponse.message = 'Organization not found'
      return res.status(404).json(apiResponse)
    }

    const assessment = await dbAssessmentRecords.getAssessmentRecordByName(iATMName, iOrganizationId)

    if (assessment.length > 0) {
      apiResponse.message = 'Assessment name is already in use.'
      return res.status(400).json(apiResponse)
    }

    const customer = await dbCustomers.getCustomerById(iCertifyingUserId)

    if (isNull(customer)) {
      apiResponse.message = 'Customer not found'
      return res.status(404).json(apiResponse)
    }

    const assessmentType = await dbAssessmentTypes.getAssessmentTypeById(iATMId)

    if (isNull(assessmentType)) {
      apiResponse.message = 'Assessment type not found'
      return res.status(404).json(apiResponse)
    }

    const data = {
      iATMId,
      iOrganizationId,
      iATMName,
      AssessmentStatus,
      iCertifyingUserId
    }

    const assessmentChecklistData = await dbChecklistRecords.getRecordsByAssesmentId(
      iATMId
    )

    const assessmentChecklist = assessmentChecklistData.map((a) => a.iCMId)

    const createdAssessmentRecord = await dbAssessmentRecords.createAssessmentRecord(
      data
    )

    if (isNull(createdAssessmentRecord)) {
      apiResponse.message = 'Could not create assessment record'
      return res.status(500).json(apiResponse)
    }

    const values = []
    assessmentChecklist.forEach((e) => {
      values.push([createdAssessmentRecord.insertId, e, iCertifyingUserId, 1])
    })

    await dbChecklistRecords.createChecklistRecords(values)

    apiResponse.message = 'Assessment Record has been created successfully'
    apiResponse.data.assesmentRecord = createdAssessmentRecord.insertId
    return res.status(201).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(200).json(apiResponse)
  }
}

// Update assessment record
module.exports.updateAssessmentRecord = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const {
      iATMId,
      iOrganizationId,
      iATMName,
      AssessmentStatus,
      DateCertified,
      iCertifyingUserId
    } = req.body
    const { id } = req.params
    const data = {}

    if (!req.activeSubscription) {
      apiResponse.message = 'Your subscription is not yet active to update this assessment'
      return res.status(400).json(apiResponse)
    }

    const assessmentRecord = await dbAssessmentRecords.getAssessmentRecordById(
      id
    )

    if (isNull(assessmentRecord)) {
      apiResponse.message = 'Assessment record not found'
      return res.status(404).json(apiResponse)
    }

    if (!isNull(iATMId)) {
      data.iATMId = iATMId
    }

    if (!isNull(iATMName)) {
      data.iATMName = iATMName
    }

    if (!isNull(iOrganizationId)) {
      data.iOrganizationId = iOrganizationId
    }

    if (!isNull(AssessmentStatus)) {
      data.AssessmentStatus = AssessmentStatus
    }

    if (!isNull(DateCertified)) {
      data.DateCertified = DateCertified
    }

    if (!isNull(iCertifyingUserId)) {
      data.iCertifyingUserId = iCertifyingUserId
    }

    if (!isNull(iOrganizationId)) {
      const organization = await dbOrganizations.getOrganization(
        iOrganizationId
      )

      if (isNull(organization)) {
        apiResponse.message = 'Organization not found'
        return res.status(404).json(apiResponse)
      }
    }

    if (!isNull(iCertifyingUserId)) {
      const customer = await dbCustomers.getCustomerById(iCertifyingUserId)

      if (isNull(customer)) {
        apiResponse.message = 'Customer not found'
        return res.status(404).json(apiResponse)
      }
    }

    if (!isNull(iATMId)) {
      const assessmentType = await dbAssessmentTypes.getAssessmentTypeById(
        iATMId
      )

      if (isNull(assessmentType)) {
        apiResponse.message = 'Assessment type not found'
        return res.status(404).json(apiResponse)
      }
    }

    const updatedAssessmentRecord = await dbAssessmentRecords.updateAssessmentRecord(
      data,
      id
    )

    if (
      isNull(updatedAssessmentRecord) ||
      updatedAssessmentRecord.affectedRows === 0
    ) {
      apiResponse.message = 'Could not update assessment record'
      return res.status(500).json(apiResponse)
    }

    apiResponse.message = 'Assessment record updated successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.deleteAssessmentRecord = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { id } = req.params

    const deletedAssessmentRecord = await dbAssessmentRecords.deleteAssessmentRecord(
      id
    )

    if (
      isNull(deletedAssessmentRecord) ||
      deletedAssessmentRecord.affectedRows === 0
    ) {
      apiResponse.message = 'Could not delete assessment record'
      return res.status(500).json(apiResponse)
    }
    apiResponse.message = 'Assessment record deleted successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
