const db = require('../connection')

module.exports.listPoaRecords = () =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT pr.*, cm.ChecklistItemName, cm.LongDescription FROM poa_record pr JOIN checklist_record cr ON cr.iCRId = pr.iCRId JOIN checklist_mas cm ON cm.iCMId = cr.iCMId'

    db.query(query, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.getPoaRecordByCRId = (iCRId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT pr.*, cm.ChecklistItemName, cm.LongDescription FROM poa_record pr JOIN checklist_record cr ON cr.iCRId = pr.iCRId JOIN checklist_mas cm ON cm.iCMId = cr.iCMId WHERE pr.iCRId = ?'

    db.query(query, [iCRId], (err, results) => {
      if (err) reject(err)
      resolve(results[0])
    })
  })

module.exports.getPoaRecordById = (iPOAId) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT * FROM poa_record WHERE iPOAId = ?'

    db.query(query, [iPOAId], (err, results) => {
      if (err) reject(err)
      resolve(results[0])
    })
  })

module.exports.createPOARecord = (data) =>
  new Promise((resolve, reject) => {
    const query = 'INSERT INTO poa_record SET ?'

    db.query(query, data, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.updatePOARecord = (data, iCRId) =>
  new Promise((resolve, reject) => {
    const query = 'UPDATE poa_record SET ? WHERE iCRId = ?'

    db.query(query, [data, iCRId], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })
