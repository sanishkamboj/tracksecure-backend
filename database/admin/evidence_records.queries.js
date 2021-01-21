const db = require('../connection')

module.exports.listEvidenceRecords = () =>
  new Promise((resolve, reject) => {
    const query = 'SELECT er.*, cm.ChecklistItemName FROM evidence_record er JOIN checklist_record cr ON cr.iCRId = er.iCRId JOIN checklist_mas cm ON cm.iCMId = cr.iCMId;'

    db.query(query, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.listEvidenceRecordsByOrgId = (iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT er.*, cm.ChecklistItemName FROM evidence_record er JOIN checklist_record cr ON cr.iCRId = er.iCRId JOIN checklist_mas cm ON cm.iCMId = cr.iCMId JOIN assessment_record ar ON ar.iARId = cr.iARId WHERE ar.iOrganizationId = ? ORDER BY er.DateEvidenceSubmitted DESC'
    db.query(query, [iOrganizationId], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.createEvidenceRecords = (data) =>
  new Promise((resolve, reject) => {
    const query =
      'INSERT INTO evidence_record (iCRId, EvidenceFileKey, EvidenceFileName, vEvidenceDescription) VALUES ?'

    db.query(query, [data], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.getEvidenceRecordsByICRId = (iCRId) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT er.* FROM evidence_record er WHERE er.iCRId = ?'

    db.query(query, iCRId, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.deleteEvidenceRecord = (iCRId, EvidenceFileKey) =>
  new Promise((resolve, reject) => {
    const query =
      'DELETE FROM evidence_record WHERE iCRId = ? AND EvidenceFileKey = ?'

    db.query(query, [iCRId, EvidenceFileKey], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })
