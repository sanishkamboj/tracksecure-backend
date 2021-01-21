// utils
const ApiResponse = require('../../utils/ApiResponse')

// dbs
const dbChecklistObjectiveMas = require('../../database/user/checklist_objective_mas.queries')

module.exports.getChecklistObjectiveMasRecords = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iCMId } = req.params
    const comRecords = await dbChecklistObjectiveMas.getObjectiveMasRecords(
      iCMId
    )
    apiResponse.data.comRecords = comRecords
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
