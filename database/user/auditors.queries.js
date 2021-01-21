/**
 * @typedef AuditorCreate
 * @property {Number} vFirstName Required. First Name of an auditor
 * @property {String} vLastName Required. Last Name of an auditor
 * @property {String} vEmail Required. Email of an auditor
 * @property {String} vPhone Required. Phone number of an auditor
 * @property {String} vCompany Required. Company of an auditor
 * @property {Number} iAssessmentId Required. Assessment id where auditor is associated
 * @returns {Promise<Object>}
 */

const db = require('../connection')

/**
 * Get all auditors
 * @returns {Promise<Object>}
 */
module.exports.getAuditors = () => new Promise((resolve, reject) => {
  const query = 'SELECT * FROM auditors'
  db.query(query, (err, results) => {
    if (err) throw new Error(err)
    resolve(results)
  })
})

/**
 * Get a specific auditor
 * @param {Number} iAuditorId Required. Id of the specified auditor to be retrieved.
 * @returns {Promise<Object>}
 */
module.exports.getAuditor = (iAuditorId) => new Promise((resolve, reject) => {
  const query = 'SELECT * FROM auditors WHERE iAuditorId = ?'
  db.query(query, [iAuditorId], (err, results) => {
    if (err) throw new Error(err)
    resolve(results[0])
  })
})

/**
 * Create new auditor associated with a specific assessment
 * @param {AuditorCreate} data Required. Auditor details
 * @returns {Promise<Object>}
 */
module.exports.createAuditor = (data) => new Promise((resolve, results) => {
  const query = 'INSERT INTO auditors SET ?'
  db.query(query, [data], (err, results) => {
    if (err) throw err
    resolve(results)
  })
})

/**
 * Update auditor
 * @param {Number} iAuditorId Required. Auditor id to be updated
 * @param {AuditorCreate} data Required. Auditor data to be updated
 * @returns {Promise<Object>}
 */
module.exports.updateAuditor = (data, iAuditorId) => new Promise((resolve, reject) => {
  const query = 'UPDATE auditors SET ? WHERE iAuditorId = ?'
  db.query(query, [data, iAuditorId], (err, results) => {
    if (err) throw new Error(err)
    resolve(results)
  })
})

/**
 * Delete a specific auditor
 * @param {Number} iAuditorId Required. Id of the specified auditor to be deleted.
 * @returns {Promise<Object>}
 */
module.exports.deleteAuditor = (iAuditorId) => new Promise((resolve, reject) => {
  const query = 'DELETE from auditors WHERE iAuditorId = ?'
  db.query(query, [iAuditorId], (err, results) => {
    if (err) throw err
    resolve(results)
  })
})

/**
 * Get auditors by assessment id
 * @param {Number} iAssessmentId Required. Id of the specified auditor to be deleted.
 * @returns {Promise<Object>}
 */
module.exports.getAuditorsByAssessmentId = (iAssessmentId) => new Promise((resolve, reject) => {
  const query = 'SELECT * FROM auditors WHERE iAssessmentId = ?'
  db.query(query, [iAssessmentId], (err, results) => {
    if (err) throw err
    resolve(results)
  })
})