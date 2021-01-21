const db = require('../connection')

module.exports.getMilestonesByPOAId = (iPOAId) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT * FROM milestone_record WHERE iPOAId = ?'

    db.query(query, [iPOAId], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.getMilestoneRecordById = (iMilestoneId) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT * FROM milestone_record WHERE iMilestoneId = ?'

    db.query(query, [iMilestoneId], (err, results) => {
      if (err) reject(err)
      resolve(results[0])
    })
  })

module.exports.createMilestoneRecord = (data) =>
  new Promise((resolve, reject) => {
    const query = 'INSERT INTO milestone_record SET ?'

    db.query(query, data, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.updateMilestoneRecord = (data, iMilestoneId) =>
  new Promise((resolve, reject) => {
    const query = 'UPDATE milestone_record SET ? WHERE iMilestoneId = ?'

    db.query(query, [data, iMilestoneId], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.deleteMilestoneRecord = (iMilestoneId) =>
  new Promise((resolve, reject) => {
    const query = 'DELETE FROM milestone_record WHERE iMilestoneId = ?'

    db.query(query, [iMilestoneId], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })
