const moment = require('moment')

// utils
const ApiResponse = require('../../utils/ApiResponse')
const IsNull = require('../../utils/isNull')

// db queries
const dbUsers = require('../../database/user/users.queries')
const dbDashboard = require('../../database/user/dashboard.queries')

module.exports.getDashboardData = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { id } = req.user
    const { iOrganizationId } = req.params

    const user = await dbUsers.findUserByOrg(id, iOrganizationId)

    if (IsNull(user)) {
      apiResponse.message = 'User not found'
      return res.status(200).json(apiResponse)
    }

    const checklistStats = await dbDashboard.getChecklistStats(iOrganizationId)
    const checklistStatsBarCharts = await dbDashboard.getChecklistStatsBarChart(
      iOrganizationId
    )
    checklistStatsBarCharts.forEach((e) => {
      e.x = moment(e.x).format('YYYY-MM-DD')
    })
    const finalChecklist = [
      {
        recordCount: 0,
        ChecklistRecordStatus: 1
      },
      {
        recordCount: 0,
        ChecklistRecordStatus: 2
      },
      {
        recordCount: 0,
        ChecklistRecordStatus: 3
      }
    ]
    finalChecklist.forEach((fc) => {
      checklistStats.forEach((cs) => {
        if (cs.ChecklistRecordStatus === fc.ChecklistRecordStatus) {
          fc.recordCount = cs.recordCount
        }
      })
    })
    apiResponse.data.checklistStats = finalChecklist
    apiResponse.data.checklistStatsBarCharts = checklistStatsBarCharts
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
