const db = require('../connection')

module.exports.listChecklist = () =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT cm.iCMId, cm.ChecklistItemName, cm.ShortDescription, cm.LongDescription, atm.AssessmentTypeName, cm.iStatus FROM checklist_mas cm JOIN assessment_type_mas atm ON cm.iATMId = atm.iATMId'

    db.query(query, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.getChecklistById = (id) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT * FROM checklist_mas WHERE iCMId = ?'

    db.query(query, [id], (err, results) => {
      if (err) reject(err)
      resolve(results[0])
    })
  })

module.exports.createChecklistRecords = (values) =>
  new Promise((resolve, reject) => {
    const query =
      'INSERT INTO checklist_record (iARId, iCMId, iUserId, ChecklistRecordStatus) VALUES ?'

    db.query(query, [values], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.createChecklist = (data) =>
  new Promise((resolve, reject) => {
    const query = 'INSERT INTO checklist_mas SET ?'

    db.query(query, data, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.deleteChecklist = (id) =>
  new Promise((resolve, reject) => {
    const query = 'DELETE FROM checklist_mas WHERE iCMId = ?'

    db.query(query, [id], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.updateChecklist = (data, id) =>
  new Promise((resolve, reject) => {
    const query = 'UPDATE checklist_mas SET ? WHERE iCMId = ?'

    db.query(query, [data, id], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.getRecordsByAssesmentId = (iATMId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT checklist_mas.iCMId FROM `checklist_mas` WHERE iATMId = ?'

    db.query(query, [iATMId], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })
