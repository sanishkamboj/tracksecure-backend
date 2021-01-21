const db = require('../connection')

module.exports.getAssesmentRecord = (iARId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT ar.iARId, ar.iATMId, ar.iATMName, ar.vAssessmentDescription FROM assessment_record ar WHERE ar.iARId = ?'

    db.query(query, [iARId], (err, results) => {
      if (err) throw err
      resolve(results[0])
    })
  })

module.exports.getOrganization = (iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT * FROM organization_mas where iOrganizationId = ?'

    db.query(query, [iOrganizationId], (err, results) => {
      if (err) throw err
      resolve(results[0])
    })
  })

module.exports.getUser = (iUserId) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users where iUserId = ?'

    db.query(query, [iUserId], (err, results) => {
      if (err) throw err
      resolve(results[0])
    })
  })

module.exports.getPOARecords = (iARId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT pr.iPOAId FROM poa_record pr WHERE pr.iCRId IN (SELECT cr.iCRId FROM checklist_record cr WHERE cr.iARId = ?)'
    db.query(query, [iARId], (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })

module.exports.getMilestoneRecords = (poaIds) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT mr.*, pr.iCRId, pr.POAName, pr.POAStatus, pr.ResourceStatus, pr.Deficiency FROM milestone_record mr JOIN poa_record pr ON pr.iPOAId = mr.iPOAId WHERE mr.iPOAId IN (?)'
    db.query(query, [poaIds], (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })

module.exports.getChecklistRecord = (iOrganizationId, iARId, shortDescription) =>
  // status: implemented, Planned to be implemented, Not Applicable
  new Promise((resolve, reject) => {
    const query =
      'SELECT cm.iCMId, atm.iATMId, cm.ChecklistItemName, cm.ShortDescription, cm.LongDescription, cr.ChecklistRecordStatus, cr.Results FROM checklist_record cr JOIN assessment_record ar ON ar.iARId = cr.iARId JOIN checklist_mas cm ON cm.iCMId = cr.iCMId JOIN users u ON cr.iUserId = u.iUserId JOIN assessment_type_mas as atm ON atm.iATMId = cm.iATMId WHERE u.iOrganizationId = ? AND ar.iARId = ? AND cm.ShortDescription IN (?)'

    db.query(query, [iOrganizationId, iARId, shortDescription], (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })

module.exports.getChecklistRecordParents = () =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT ShortDescription FROM checklist_mas GROUP BY ShortDescription'

    db.query(query, (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })

module.exports.saveDownloadRecord = (data) =>
  new Promise((resolve, reject) => {
    const query = 'INSERT INTO ssp_file_record SET ?'

    db.query(query, data, (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })

module.exports.getSspDownloadRecords = (iUserId, iARId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT * FROM ssp_file_record WHERE iUserId = ? AND iARId = ?'

    db.query(query, [iUserId, iARId], (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })
