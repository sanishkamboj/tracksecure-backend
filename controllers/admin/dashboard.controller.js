const moment = require('moment')

// utils
const ApiResponse = require('../../utils/ApiResponse')

// db queries
const dbDashboard = require('../../database/admin/dashboard.queries')

module.exports.getDashboardData = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const checklistStats = await dbDashboard.getChecklistStats()
    const checklistStatsBarCharts = await dbDashboard.getChecklistStatsBarChart()
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
