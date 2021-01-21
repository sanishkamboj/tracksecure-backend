const db = require('../connection')

module.exports.getChecklistRecords = (iATMName = null, hideCompleted = false) =>
  new Promise((resolve, reject) => {
    let query =
      'SELECT cr.iCRId, atm.AssessmentTypeName, ar.iATMName, cm.ChecklistItemName, cm.ShortDescription, u.vEmail, cr.ChecklistRecordStatus, cr.DateCompleted FROM checklist_record cr JOIN checklist_mas cm ON cm.iCMId = cr.iCMId JOIN users u ON cr.iUserId = u.iUserId JOIN assessment_type_mas as atm ON atm.iATMId = cm.iATMId JOIN assessment_record ar ON ar.iARId = cr.iARId '

    if (iATMName && !hideCompleted) {
      query += ` WHERE ar.iATMName = ${iATMName} `
    }

    if (!iATMName && hideCompleted) {
      query += ' WHERE ChecklistRecordStatus != 3 '
    }

    if (iATMName && hideCompleted) {
      query += ` WHERE ar.iATMName = ${iATMName} AND ChecklistRecordStatus != 3 `
    }

    db.query(query, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.getChecklistRecordsByOrgId = (iOrganizationId, iARId = null, iATMName = null, hideCompleted = false) =>
  new Promise((resolve, reject) => {
    let query =
      'SELECT cr.iCRId, atm.AssessmentTypeName, ar.iATMName, cm.ChecklistItemName, cm.ShortDescription, u.vEmail, cr.ChecklistRecordStatus, cr.DateCompleted FROM checklist_record cr JOIN checklist_mas cm ON cm.iCMId = cr.iCMId JOIN users u ON cr.iUserId = u.iUserId JOIN assessment_type_mas as atm ON atm.iATMId = cm.iATMId JOIN assessment_record ar ON ar.iARId = cr.iARId WHERE u.iOrganizationId = ?'

    if (iARId) {
      query += ` AND ar.iARId = ${iARId} `
    }

    if (iATMName) {
      query += ` AND ar.iATMName = ${iATMName} `
    }

    if (hideCompleted) {
      query += ' AND ChecklistRecordStatus != 3 '
    }

    db.query(query, [iOrganizationId], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.getRecordById = (iCRId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT cr.*, cm.ChecklistItemName, atm.AssessmentTypeName, cm.ShortDescription, cm.LongDescription FROM checklist_record cr JOIN checklist_mas cm ON cm.iCMId = cr.iCMId JOIN assessment_type_mas as atm ON atm.iATMId = cm.iATMId WHERE iCRId = ?'

    db.query(query, [iCRId], (err, results) => {
      if (err) reject(err)
      resolve(results[0])
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

module.exports.createChecklistRecords = (values) =>
  new Promise((resolve, reject) => {
    const query =
      'INSERT INTO checklist_record (iARId, iCMId, iUserId, ChecklistRecordStatus) VALUES ?'

    db.query(query, [values], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.updateChecklistRecord = (data, id) =>
  new Promise((resolve, reject) => {
    const query = 'UPDATE checklist_record SET ? WHERE iCRId = ?'

    db.query(query, [data, id], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.checklistRecordForDownload = (iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT cr.iCRId, atm.AssessmentTypeName, cm.ChecklistItemName, cm.ShortDescription, u.vEmail, cr.ChecklistRecordStatus, cr.DateCompleted, cr.Results, er.EvidenceFileName, pr.POAName FROM checklist_record cr JOIN checklist_mas cm ON cm.iCMId = cr.iCMId JOIN users u ON cr.iUserId = u.iUserId JOIN assessment_type_mas as atm ON atm.iATMId = cm.iATMId LEFT JOIN evidence_record er ON er.iCRId = cr.iCRId LEFT JOIN poa_record pr ON pr.iCRId = cr.iCRId WHERE u.iOrganizationId = ? ORDER BY `er`.`EvidenceFileName` DESC'
    db.query(query, [iOrganizationId], (err, results) => {
      if (err) throw new Error(err)
      resolve(results)
    })
  })
