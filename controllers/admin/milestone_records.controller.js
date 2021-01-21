const ApiResponse = require('../../utils/ApiResponse')
const IsNull = require('../../utils/isNull')

// db queries
const dbPoaRecords = require('../../database/admin/poa_records.queries')
const dbMilestoneRecords = require('../../database/admin/milestone_records.queries')

// Get Milestone records
module.exports.getMilestoneRecords = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iPOAId, iMilestoneId } = req.query
    if (!IsNull(iPOAId)) {
      const poaRecord = await dbPoaRecords.getPoaRecordById(iPOAId)
      if (IsNull(poaRecord)) {
        apiResponse.message = 'POA Record not found'
        return res.status(apiResponse)
      }
      const milestones = await dbMilestoneRecords.getMilestonesByPOAId(iPOAId)
      apiResponse.data.milestones = milestones
      return res.status(200).json(apiResponse)
    }

    if (!IsNull(iMilestoneId)) {
      const milestone = await dbMilestoneRecords.getMilestoneRecordById(
        iMilestoneId
      )
      if (IsNull(milestone)) {
        apiResponse.message = 'Milestone Record not found'
        return res.status(404).json(apiResponse)
      }
      apiResponse.data.milestone = milestone
      return res.status(200).json(apiResponse)
    }

    if (IsNull(iPOAId) && IsNull(iMilestoneId)) {
      apiResponse.message = 'POA ID or Milestone ID is required'
      return res.status(404).json(apiResponse)
    }
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Update milestone Record
module.exports.updateMilestoneRecord = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const {
      MilestoneName,
      ActionNote,
      MilestoneStatus,
      TargetCompletion
    } = req.body
    const { iMilestoneId } = req.params

    const milestone = await dbMilestoneRecords.getMilestoneRecordById(
      iMilestoneId
    )

    if (IsNull(milestone)) {
      apiResponse.message = 'Milestone not found'
      return res.status(404).json(apiResponse)
    }

    const data = {}

    if (!IsNull(MilestoneName)) {
      data.MilestoneName = MilestoneName
    }

    if (!IsNull(ActionNote)) {
      data.ActionNote = ActionNote
    }

    if (!IsNull(MilestoneStatus)) {
      data.MilestoneStatus = MilestoneStatus
    }

    if (!IsNull(TargetCompletion)) {
      data.TargetCompletion = TargetCompletion
    }

    const updatedMilestone = await dbMilestoneRecords.updateMilestoneRecord(
      data,
      iMilestoneId
    )

    if (IsNull(updatedMilestone) || updatedMilestone.affectedRows === 0) {
      apiResponse.message = 'Could not update milestone record'
      return res.status(500).json(apiResponse)
    }
    apiResponse.message = 'Milestone Record Updated Successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Create milestone Record
module.exports.createMilestoneRecord = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const {
      iPOAId,
      MilestoneName,
      ActionNote,
      MilestoneStatus,
      TargetCompletion
    } = req.body

    if (IsNull(iPOAId)) {
      apiResponse.errors.push('POA id is required')
    }

    if (IsNull(MilestoneName)) {
      apiResponse.errors.push('Milestone name is required')
    }

    if (IsNull(MilestoneStatus)) {
      apiResponse.errors.push('Milestone status is required')
    }

    if (IsNull(TargetCompletion)) {
      apiResponse.errors.push('Target Completion is required')
    }

    if (apiResponse.errors.length > 0) {
      return res.status(422).json(apiResponse)
    }

    const poaRecord = await dbPoaRecords.getPoaRecordById(iPOAId)

    if (IsNull(poaRecord)) {
      apiResponse.message = 'POA Record not found'
      return res.status(404).json(apiResponse)
    }

    const data = { iPOAId, MilestoneName, MilestoneStatus, TargetCompletion }

    if (!IsNull(ActionNote)) {
      data.ActionNote = ActionNote
    }

    const createdRecord = await dbMilestoneRecords.createMilestoneRecord(data)

    if (createdRecord.affectedRows === 0) {
      apiResponse.message = 'Could not create milestone'
      return res.status(500).json(apiResponse)
    }
    apiResponse.message = 'Milestone record created successfully'
    apiResponse.data.milestone = createdRecord.insertId
    return res.status(201).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Delete milestone Record
module.exports.deleteMilestoneRecord = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iMilestoneId } = req.params

    const milestone = await dbMilestoneRecords.getMilestoneRecordById(
      iMilestoneId
    )

    if (IsNull(milestone)) {
      apiResponse.message = 'Milestone not found'
      return res.status(200).json(apiResponse)
    }

    const deletedMilestone = await dbMilestoneRecords.deleteMilestoneRecord(
      iMilestoneId
    )

    if (deletedMilestone.affectedRows === 0) {
      apiResponse.message = 'Could not delete milestone'
      return res.status(404).json(apiResponse)
    }

    apiResponse.data.deletedMilestone = deletedMilestone.affectedRows
    apiResponse.message = 'Milestone has been deleted successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
