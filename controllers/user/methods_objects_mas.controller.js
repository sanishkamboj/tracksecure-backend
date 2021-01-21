// utils
const ApiResponse = require('../../utils/ApiResponse')

// dbs
const dbMOM = require('../../database/user/methods_objects_mas.queries')

module.exports.getChecklistObjectiveMasRecords = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iCMId } = req.params
    const comRecords = await dbMOM.getObjectiveMasRecords(iCMId)
    apiResponse.data.comRecords = comRecords
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
