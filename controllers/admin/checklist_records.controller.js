const moment = require('moment')
const json2xls = require('json2xls')

const ApiResponse = require('../../utils/ApiResponse')

// utils
const isNull = require('../../utils/isNull')

// db queries
const dbChecklistRecords = require('../../database/admin/checklist_records.queries')
const dbChecklistMaster = require('../../database/admin/checklist.queries')
const dbCustomers = require('../../database/admin/customers.queries')
const dbAssessmentRecords = require('../../database/admin/assessment_records.queries')
const dbPoaRecords = require('../../database/admin/poa_records.queries')

// List checklist records
module.exports.listChecklistRecords = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iOrganizationId, iARId, iATMName, hideCompleted } = req.query
    let checklistRecords = null
    if (iOrganizationId) {
      if (hideCompleted) {
        checklistRecords = await dbChecklistRecords.getChecklistRecordsByOrgId(
          iOrganizationId, iARId, iATMName, true
        )
      } else {
        checklistRecords = await dbChecklistRecords.getChecklistRecordsByOrgId(
          iOrganizationId, iARId, iATMName
        )
      }
    } else {
      if (hideCompleted) {
        checklistRecords = await dbChecklistRecords.getChecklistRecords(iATMName, true)
      } else {
        checklistRecords = await dbChecklistRecords.getChecklistRecords()
      }
    }
    apiResponse.data.checklistRecords = checklistRecords
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Get checklist record
module.exports.getChecklistRecord = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { id } = req.params

    const checklist = await dbChecklistRecords.getRecordById(id)

    if (isNull(checklist)) {
      apiResponse.message = 'Checklist record not found'
      return res.status(404).json(apiResponse)
    }

    apiResponse.data.checklist = checklist
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Update record
module.exports.updateChecklistRecord = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const {
      iARId,
      iCMId,
      iUserId,
      ChecklistRecordStatus,
      Results,
      iPOAId,
      DateCompleted
    } = req.body
    const { id } = req.params
    const data = {}

    const checklistRecord = await dbChecklistRecords.getRecordById(id)

    if (!isNull(iARId)) {
      const assessmentRecord = await dbAssessmentRecords.getAssessmentRecordById(
        iARId
      )

      if (isNull(assessmentRecord)) {
        apiResponse.message = 'Assessment record not found'
        return res.status(404).json(apiResponse)
      }
      data.iARId = iARId
    }

    if (isNull(checklistRecord)) {
      apiResponse.message = 'Checklist not found'
      return res.status(404).json(apiResponse)
    }

    if (!isNull(iCMId)) {
      const checklistMaser = await dbChecklistMaster.getChecklistById(iCMId)

      if (isNull(checklistMaser)) {
        apiResponse.message = 'Checklist master not found'
        return res.status(404).json(apiResponse)
      }
      data.iCMId = iCMId
    }

    if (!isNull(iUserId)) {
      const customer = await dbCustomers.getCustomerById(iUserId)

      if (isNull(customer)) {
        apiResponse.message = 'Customer not found'
        return res.status(404).json(apiResponse)
      }
      data.iUserId = iUserId
    }

    if (!isNull(iPOAId)) {
      const poaRecord = await dbPoaRecords.getPoaRecordByCRId(id)

      if (isNull(poaRecord)) {
        apiResponse.message = 'POA Record not found'
        return res.status(404).json(apiResponse)
      }
      data.iPOAId = poaRecord.iPOAId
    }

    if (!isNull(ChecklistRecordStatus)) {
      data.ChecklistRecordStatus = ChecklistRecordStatus
      if (ChecklistRecordStatus === 3) {
        const poaRecord = await dbPoaRecords.getPoaRecordByCRId(id)
        if (!isNull(poaRecord)) {
          if (poaRecord.POAStatus !== 3) {
            apiResponse.message = 'Please complete POA record for this checklist record'
            return res.status(400).json(apiResponse)
          }
        }
      }
    }

    if (!isNull(DateCompleted)) {
      data.DateCompleted = DateCompleted
    }

    if (!isNull(Results)) {
      data.Results = Results
    }

    const updatedChecklistRecord = await dbChecklistRecords.updateChecklistRecord(
      data,
      id
    )

    if (
      isNull(updatedChecklistRecord) ||
      updatedChecklistRecord.affectedRows === 0
    ) {
      apiResponse.message = 'Could not update checklist record'
      return res.status(500).json(apiResponse)
    }
    apiResponse.message = 'Checklist record updated successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Create excel download
module.exports.downloadExcel = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iOrganizationId } = req.params
    const records = await dbChecklistRecords.checklistRecordForDownload(iOrganizationId)
    const xl = []
    records.forEach(r => {
      let status = 1
      let date = null
      if (r.ChecklistRecordStatus === 1) status = 'Assigned'
      if (r.ChecklistRecordStatus === 2) status = 'In Progress'
      if (r.ChecklistRecordStatus === 3) status = 'Complete'
      if (r.DateCompleted) {
        date = moment(r.DateCompleted).format('YYYY-MM-DD')
      } else {
        date = '-'
      }
      xl.push({
        'Checklist ID': r.iCRId,
        'Assessment Name': r.AssessmentTypeName,
        Name: r.ChecklistItemName,
        'Short Description': r.ShortDescription,
        'Assign-To-User': r.vEmail,
        Status: status,
        'Date Completed': date,
        Results: r.Results ? r.Results : '-',
        'Evidence file Name': r.EvidenceFileName ? r.EvidenceFileName : '-',
        POA: r.POAName ? r.POAName : '-'
      })
    })
    const xls = json2xls(xl)
    const buffer = Buffer.from(xls, 'binary')
    res.status(200).send(buffer)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
