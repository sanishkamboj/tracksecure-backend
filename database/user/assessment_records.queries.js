const db = require('../connection')

module.exports.listAssessmentRecordsByOrgId = (iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT ar.iARId, ar.iOrganizationId, ar.iATMName, atm.AssessmentTypeName, om.vOrganizationName, ar.AssessmentStatus, ar.DateCreated, ar.DateCertified, u.vEmail FROM assessment_record ar JOIN assessment_type_mas atm on ar.iATMId = atm.iATMId JOIN organization_mas om ON om.iOrganizationId = ar.iOrganizationId JOIN users u ON u.iUserId = ar.iCertifyingUserId WHERE ar.iOrganizationId = ?'

    db.query(query, [iOrganizationId], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.getAssessmentRecord = (iARId, iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT * FROM assessment_record WHERE iARId = ? AND iOrganizationId = ?'

    db.query(query, [iARId, iOrganizationId], (err, results) => {
      if (err) reject(err)
      resolve(results[0])
    })
  })

module.exports.getAssessmentRecordByName = (iATMName, iOrganizationId) => new Promise((resolve, reject) => {
  const query = 'SELECT * FROM assessment_record WHERE iATMName = ? AND iOrganizationId = ?'
  db.query(query, [iATMName, iOrganizationId], (err, results) => {
    if (err) reject(err)
    resolve(results)
  })
})

module.exports.createAssessmentRecord = (data) =>
  new Promise((resolve, reject) => {
    const query = 'INSERT INTO assessment_record SET ?'

    db.query(query, data, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.deleteAssessmentRecord = (iARId, iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query =
      'DELETE FROM assessment_record WHERE iARId = ? AND iOrganizationId = ?'

    db.query(query, [iARId, iOrganizationId], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.countRecordsByOrgId = (iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT COUNT(ar.iOrganizationId) as assessmentRecords FROM assessment_record ar WHERE ar.iOrganizationId = ?'

    db.query(query, [iOrganizationId], (err, results) => {
      if (err) throw err
      resolve(results[0])
    })
  })
