const db = require('../connection')

// utils
const IsNull = require('../../utils/isNull')

module.exports.listAssessmentRecords = (iOrganizationId = null) =>
  new Promise((resolve, reject) => {
    let query =
      'SELECT ar.iARId, atm.AssessmentTypeName, om.vOrganizationName, ar.AssessmentStatus, ar.DateCreated, ar.DateCertified, u.vEmail FROM assessment_record ar JOIN assessment_type_mas atm on ar.iATMId = atm.iATMId JOIN organization_mas om ON om.iOrganizationId = ar.iOrganizationId JOIN users u ON u.iUserId = ar.iCertifyingUserId'

    if (!IsNull(iOrganizationId)) {
      query += ` WHERE om.iOrganizationId = ${iOrganizationId}`
    }

    db.query(query, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.getAssessmentRecordById = (id) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT * FROM assessment_record WHERE iARId = ?'

    db.query(query, [id], (err, results) => {
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

module.exports.updateAssessmentRecord = (data, id) =>
  new Promise((resolve, reject) => {
    const query = 'UPDATE assessment_record SET ? WHERE iARId = ?'

    db.query(query, [data, id], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.deleteAssessmentRecord = (id) =>
  new Promise((resolve, reject) => {
    const query = 'DELETE FROM assessment_record WHERE iARId = ?'

    db.query(query, [id], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })
