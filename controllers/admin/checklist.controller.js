const ApiResponse = require('../../utils/ApiResponse')

// utils
const isNull = require('../../utils/isNull')

// db queries
const dbAssessmentType = require('../../database/admin/assessment_type.queries')
const dbChecklist = require('../../database/admin/checklist.queries')

// List checklist
module.exports.listChecklist = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const checklist = await dbChecklist.listChecklist()
    apiResponse.data.checklist = checklist
    return res.status(201).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Get check list
module.exports.getChecklist = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { id } = req.params
    const checklist = await dbChecklist.getChecklistById(id)

    if (isNull(checklist)) {
      apiResponse.message = 'Checklist not found'
      return res.status(404).json(apiResponse)
    }

    apiResponse.data.checklist = checklist
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Create checklist
module.exports.createChecklist = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const {
      iATMId,
      ChecklistItemName,
      ShortDescription,
      LongDescription,
      iStatus
    } = req.body

    if (isNull(iATMId)) {
      apiResponse.errors.push('Assessment Id is required')
    }

    if (isNull(ChecklistItemName)) {
      apiResponse.errors.push('Checklist Name is required')
    }

    if (isNull(ShortDescription)) {
      apiResponse.errors.push('Short Description is required')
    }

    if (isNull(LongDescription)) {
      apiResponse.errors.push('Long Description is required')
    }

    if (isNull(iStatus)) {
      apiResponse.errors.push('Status is required')
    }

    if (apiResponse.errors.length > 0) {
      return res.status(422).json(apiResponse)
    }

    const assessmentType = await dbAssessmentType.getAssessmentTypeById(iATMId)
    if (isNull(assessmentType)) {
      apiResponse.message = 'Assessment Type does not exists'
      return res.status(422).json(apiResponse)
    }

    const data = {
      iATMId,
      ChecklistItemName,
      ShortDescription,
      LongDescription,
      iStatus
    }

    const createdChecklist = await dbChecklist.createChecklist(data)

    if (isNull(createdChecklist)) {
      apiResponse.message = 'Could not create checklist'
      return res.status(500).json(apiResponse)
    }

    apiResponse.message = 'Checklist created successufully'
    apiResponse.data.checklist = createdChecklist.insertId
    return res.status(201).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Update checklist
module.exports.updateChecklist = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const {
      iATMId,
      ChecklistItemName,
      ShortDescription,
      LongDescription,
      iStatus
    } = req.body
    const { id } = req.params
    const data = {}

    const checklistItem = await dbChecklist.getChecklistById(id)
    if (isNull(checklistItem)) {
      apiResponse.message = 'Checklist does not exist'
      return res.status(404).json(apiResponse)
    }

    if (!isNull(iATMId)) {
      data.iATMId = iATMId
    }

    const assessmentType = await dbAssessmentType.getAssessmentTypeById(iATMId)
    if (isNull(assessmentType)) {
      apiResponse.message = 'Assessment Type does not exists'
      return res.status(422).json(apiResponse)
    }

    if (!isNull(ChecklistItemName)) {
      data.ChecklistItemName = ChecklistItemName
    }

    if (!isNull(ShortDescription)) {
      data.ShortDescription = ShortDescription
    }

    if (!isNull(LongDescription)) {
      data.LongDescription = LongDescription
    }

    if (!isNull(iStatus)) {
      data.iStatus = iStatus
    }

    const updatedChecklist = await dbChecklist.updateChecklist(data, id)

    if (isNull(updatedChecklist) && !updatedChecklist.affectedRows) {
      apiResponse.message = 'Could not update checklist item'
      return res.status(500).json(apiResponse)
    }
    apiResponse.message = 'Checklist updated successufully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Delete checklist
module.exports.deleteChecklist = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { id } = req.params

    if (isNull(id)) {
      apiResponse.message = 'Checklist id is required'
      return res.status(422).json(apiResponse)
    }

    const checklistItem = await dbChecklist.getChecklistById(id)
    if (isNull(checklistItem)) {
      apiResponse.message = 'Checklist does not exist'
      return res.status(404).json(apiResponse)
    }

    const deletedChecklist = await dbChecklist.deleteChecklist(id)

    if (!deletedChecklist.affectedRows) {
      apiResponse.message = 'Could not delete checklist item'
      return res.status(500).json(apiResponse)
    }
    apiResponse.message = 'Checklist item deleted successufully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
