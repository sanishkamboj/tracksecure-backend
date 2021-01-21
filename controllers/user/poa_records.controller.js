const json2xls = require('json2xls')

const ApiResponse = require('../../utils/ApiResponse')

// db queries
const dbPoaRecords = require('../../database/user/poa_records.queries')
const moment = require('moment')

module.exports.getPoaRecordList = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iOrganizationId } = req.params
    const { hideCompleted, iARId } = req.query
    let poaRecords = null
    if (hideCompleted) {
      poaRecords = await dbPoaRecords.listPoaRecords(iOrganizationId, iARId, true)
    } else {
      poaRecords = await dbPoaRecords.listPoaRecords(iOrganizationId, iARId)
    }
    apiResponse.data.poaRecords = poaRecords
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
    const records = await dbPoaRecords.poaRecordForDownload(iOrganizationId)
    const xl = []
    records.forEach(r => {
      let poaStatus = null
      let milestoneStatus = null
      if (r.POAStatus === 1) {
        poaStatus = 'Not Started'
      }
      if (r.POAStatus === 2) {
        poaStatus = 'In progress'
      }
      if (r.POAStatus === 3) {
        poaStatus = 'Completed'
      }
      if (r.MilestoneStatus === 1) {
        milestoneStatus = 'Not Started'
      }
      if (r.MilestoneStatus === 2) {
        milestoneStatus = 'In progress'
      }
      if (r.milestoneStatus === 3) {
        milestoneStatus = 'Completed'
      }
      xl.push({
        Name: r.ChecklistItemName,
        POA: r.POAName,
        Deficiency: r.Deficiency,
        Resource: r.ResourceStatus == '1' ? 'Funded' : 'Unfunded',
        Milestone: r.MilestoneName,
        'Target Completion Dates': r.TargetCompletion ? moment(r.TargetCompletion).format('YYYY-MM-DD') : '-',
        Action: r.ActionNote ? r.ActionNote : '-',
        'POA Status': poaStatus,
        'Milestone Status': milestoneStatus || '-'
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
