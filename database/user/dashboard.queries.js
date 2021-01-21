const db = require('../connection')

module.exports.getChecklistStats = (iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT COUNT(cr.iCRId) AS recordCount, cr.ChecklistRecordStatus FROM checklist_record cr JOIN users u ON u.iUserId = cr.iUserId JOIN organization_mas om ON om.iOrganizationId = u.iOrganizationId WHERE u.iOrganizationId = ? GROUP BY ChecklistRecordStatus'

    db.query(query, [iOrganizationId], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.getChecklistStatsBarChart = (iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT DATE(cr.DateCompleted) AS x, COUNT(cr.DateCompleted) AS y FROM checklist_record cr JOIN users u ON u.iUserId = cr.iUserId JOIN organization_mas om ON om.iOrganizationId = u.iOrganizationId WHERE cr.DateCompleted IS NOT NULL AND u.iOrganizationId = ? GROUP BY DATE(cr.DateCompleted)'

    db.query(query, [iOrganizationId], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })
