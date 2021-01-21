const db = require('../connection')

module.exports.getChecklistStats = () =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT COUNT(iCRId) AS recordCount, ChecklistRecordStatus FROM `checklist_record` GROUP BY ChecklistRecordStatus'

    db.query(query, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.getChecklistStatsBarChart = () =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT DATE(DateCompleted) AS x, COUNT(DateCompleted) AS y FROM `checklist_record` WHERE DateCompleted IS NOT NULL GROUP BY DATE(DateCompleted)'

    db.query(query, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })
