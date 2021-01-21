const ApiResponse = require('../../utils/ApiResponse')
const IsNull = require('../../utils/isNull')

// db queries
const dbPoaRecords = require('../../database/admin/poa_records.queries')
const dbChecklistRecords = require('../../database/admin/checklist_records.queries')
const dbMilestoneRecords = require('../../database/admin/milestone_records.queries')

// Get poa record list
module.exports.getPoaRecordList = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const poaRecords = await dbPoaRecords.listPoaRecords()
    apiResponse.data.poaRecords = poaRecords
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Get poa record by checklist reccord
module.exports.getPoaRecordbyCRId = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iCRId } = req.params

    const checklistRecord = await dbChecklistRecords.getRecordById(iCRId)

    if (IsNull(checklistRecord)) {
      apiResponse.message = 'Checklist Record not found'
      return res.status(404).json(apiResponse)
    }

    const poaRecord = await dbPoaRecords.getPoaRecordByCRId(iCRId)

    if (IsNull(poaRecord)) {
      apiResponse.message = 'POARecord not found'
      return res.status(404).json(apiResponse)
    }

    apiResponse.data.poaRecord = poaRecord
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Update poa record
module.exports.updatePoaRecord = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { POAStatus, ResourceStatus, Deficiency, iPOAId } = req.body
    const { iCRId } = req.params

    const checklistRecord = await dbChecklistRecords.getRecordById(iCRId)

    if (IsNull(checklistRecord)) {
      apiResponse.message = 'Checklist Record not found'
      return res.status(404).json(apiResponse)
    }

    const data = {}

    if (!IsNull(POAStatus)) {
      let flag = 0
      data.POAStatus = POAStatus
      if (POAStatus === 3) {
        const milestoneRecords = await dbMilestoneRecords.getMilestonesByPOAId(iPOAId)
        if (milestoneRecords.length !== 0) {
          for (let i = 0; i < milestoneRecords.length; i++) {
            const status = milestoneRecords[i].MilestoneStatus
            if (status !== 3) {
              apiResponse.message = 'Please complete all milestones to mark this POA completed'
              flag = 1
              break
            }
          }
        }
      }
      if (flag === 1) {
        return res.status(400).json(apiResponse)
      }
    }

    if (!IsNull(ResourceStatus)) {
      data.ResourceStatus = ResourceStatus
    }

    if (!IsNull(Deficiency)) {
      data.Deficiency = Deficiency
    }

    const updatedPOARecord = await dbPoaRecords.updatePOARecord(data, iCRId)

    if (IsNull(updatedPOARecord) || updatedPOARecord.affectedRows === 0) {
      apiResponse.message = 'Could not update POA record'
      return res.status(500).json(apiResponse)
    }
    apiResponse.message = 'POA Record Updated Successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Create poa record
module.exports.createPoaRecord = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iCRId, POAName, POAStatus, ResourceStatus, Deficiency } = req.body

    if (IsNull(iCRId)) {
      apiResponse.errors.push('Checklist record is required')
    }

    if (IsNull(POAName)) {
      apiResponse.errors.push('POA Title required')
    }

    if (IsNull(POAStatus)) {
      apiResponse.errors.push('POA Status is required')
    }

    if (IsNull(ResourceStatus)) {
      apiResponse.errors.push('Resource status is required')
    }

    if (IsNull(Deficiency)) {
      apiResponse.errors.push('Deficiency is required')
    }

    if (apiResponse.errors.length > 0) {
      return res.status(422).json(apiResponse)
    }

    const checklistRecord = await dbChecklistRecords.getRecordById(iCRId)

    if (IsNull(checklistRecord)) {
      apiResponse.message = 'Checklist record not found'
      return res.status(422).json(apiResponse)
    }

    const data = {
      iCRId,
      POAName,
      POAStatus,
      ResourceStatus,
      Deficiency
    }

    const poaRecord = await dbPoaRecords.getPoaRecordByCRId(iCRId)

    if (IsNull(poaRecord)) {
      const createdPoaRecord = await dbPoaRecords.createPOARecord(data)

      if (IsNull(createdPoaRecord) && IsNull(createdPoaRecord.insertId)) {
        apiResponse.message = 'Could not create a poa record'
        return res.status(500).json(apiResponse)
      }

      apiResponse.data.poaRecord = createdPoaRecord.insertId
    } else {
      const updatedPoaRecord = await dbPoaRecords.updatePOARecord(data, iCRId)

      if (updatedPoaRecord.affectedRows === 0) {
        apiResponse.message = 'Could not update poa record'
        return res.status(500).json(apiResponse)
      }
      apiResponse.data.poaRecord = poaRecord.iPOAId
    }
    return res.status(201).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
