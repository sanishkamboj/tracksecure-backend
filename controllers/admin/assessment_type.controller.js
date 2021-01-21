const ApiResponse = require('../../utils/ApiResponse')

// utils
const isNull = require('../../utils/isNull')

// db queries
const dbAssessmentType = require('../../database/admin/assessment_type.queries')

// List assessment types
module.exports.listAssessmentTypes = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const assessmentList = await dbAssessmentType.listAssessmentTypes()
    apiResponse.data.assessmentList = assessmentList
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Get assessment type
module.exports.getAssessmentType = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { id } = req.params
    const assessmentType = await dbAssessmentType.getAssessmentTypeById(id)

    if (isNull(assessmentType)) {
      apiResponse.message = 'Assessment Type not found'
      return res.status(404).json(apiResponse)
    }

    apiResponse.data.assessmentType = assessmentType
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Create assessment type
module.exports.createAssessmentType = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { assessmentTypeName, iStatus } = req.body

    if (isNull(assessmentTypeName)) {
      apiResponse.errors.push('Assessment Type Name is required')
    }

    if (isNull(iStatus)) {
      apiResponse.errors.push('Assessment Status is required')
    }

    if (apiResponse.errors.length > 0) {
      return res.status(422).json(apiResponse)
    }

    const assessmentTypeExists = await dbAssessmentType.getAssessmentTypeByName(
      assessmentTypeName.trim()
    )

    if (!isNull(assessmentTypeExists)) {
      apiResponse.message = 'Assessment Type already exists'
      return res.status(400).json(apiResponse)
    }

    const data = {
      AssessmentTypeName: assessmentTypeName,
      iStatus
    }

    const createdAssessmentType = await dbAssessmentType.createAssessmentType(
      data
    )
    if (isNull(createdAssessmentType)) {
      apiResponse.message = 'Could not create assessment type'
      return res.status(500).json(apiResponse)
    }

    apiResponse.message = 'Assessment type created successfully'
    apiResponse.data.assessmentType = createdAssessmentType.insertId
    return res.status(201).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Update assessment type
module.exports.updateAssessmentType = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { assessmentTypeName, iStatus } = req.body
    const { id } = req.params

    const data = {}
    if (!isNull(assessmentTypeName)) {
      data.AssessmentTypeName = assessmentTypeName
    }

    if (!isNull(iStatus)) {
      data.iStatus = iStatus
    }

    const updatedAssessmentType = await dbAssessmentType.updateAssessmentType(
      data,
      id
    )

    if (isNull(updatedAssessmentType) && !updatedAssessmentType.affectedRows) {
      apiResponse.message = 'Could not update assessment type'
      return res.status(500).json(apiResponse)
    }
    apiResponse.message = 'Assessment Type updated successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Delete assessment type
module.exports.deleteAssessmentType = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { id } = req.params

    const deletedAssessmentType = await dbAssessmentType.deleteAssessmentType(
      id
    )

    if (!deletedAssessmentType.affectedRows) {
      apiResponse.message = 'Could not delete assessment type'
      return res.status(500).json(apiResponse)
    }
    apiResponse.message = 'Assessment type deleted successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
