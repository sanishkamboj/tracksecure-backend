const db = require('../connection')

module.exports.listPoaRecords = (iOrganizationId, iARId = null, hideCompleted = false) =>
  new Promise((resolve, reject) => {
    let query =
      'SELECT pr.*, cm.ChecklistItemName, ar.iATMName, cm.LongDescription FROM poa_record pr JOIN checklist_record cr ON cr.iCRId = pr.iCRId JOIN checklist_mas cm ON cm.iCMId = cr.iCMId JOIN assessment_record ar ON ar.iARId = cr.iARId WHERE ar.iOrganizationId = ?'

    if (hideCompleted) {
      query += ' AND pr.POAStatus != 3'
    }

    if (iARId) {
      query += ` AND ar.iARId = ${iARId} `
    }

    db.query(query, [iOrganizationId], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.poaRecordForDownload = (iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT pr.*, cm.ChecklistItemName, cm.LongDescription, mr.MilestoneName, mr.MilestoneStatus, mr.TargetCompletion, mr.ActionNote FROM poa_record pr JOIN checklist_record cr ON cr.iCRId = pr.iCRId JOIN checklist_mas cm ON cm.iCMId = cr.iCMId JOIN assessment_record ar ON ar.iARId = cr.iARId LEFT JOIN milestone_record mr ON mr.iPOAId = pr.iPOAId WHERE ar.iOrganizationId = ? ORDER BY `cm`.`ChecklistItemName` DESC'
    db.query(query, [iOrganizationId], (err, results) => {
      if (err) throw new Error(err)
      resolve(results)
    })
  })
