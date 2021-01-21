/**
 * @typedef UpdateTransactionTxn
 * @property {Number} iSPlanId Required. Selected plan ID
 * @property {String} vPlanName Required. Selected plan name
 * @property {Number} iUserLimit Required. User limit in selected plan
 * @property {Number} iAssessmentLimit Required. Assessment limit in selected plan
 * @property {String} vTransactionId Required. Transaction ID from paysimple
 * @property {Number} fAmount Required. Amount of a selected plan
 * @property {String} dStartDate Required. Start date of a selected plan
 * @property {String} dEndDate Required. End date of a selected plan
 * @property {Number} iTotalDays Required. Total days of usage in selected plan
 * @property {String} dDate Required. Date of plan selection
 * @property {String} vPaysimplePaymentId Required. Paysimple payment id
 */

/**
 * @typedef UpdateTransactionTxnHistory
 * @property {String} vOrderId Required. Previous order id.
 * @property {Number} iSPlanId Required. Selected plan id
 * @property {String} vPlanName Required. Selected plan name
 * @property {Number} iUserLimit Required. User limit in selected plan
 * @property {Number} iAssessmentLimit Required. Assessment limit in selected plan
 * @property {Number} iOrganizationId Required. Previous organization id
 * @property {String} vTransactionId Required. Transaction id from paysimple
 * @property {String} vPayType Required. Previous pay type
 * @property {Number} fAmount Required. Amount of a selected plan
 * @property {String} dStartDate Required. Start date of a selected plan
 * @property {String} dEndDate Required. End date of a selected plan
 * @property {Number} iTotalDays Required. Total days of usage in selected plan
 * @property {String} tNotes Required. Notes for the transaction
 * @property {String} dDate Required. Date of plan selection
 * @property {Number} iStatus Required. Status of plan activation
 * @property {String} vPaysimplePaymentId Required. Paysimple payment id
 */

const db = require('../connection')

module.exports.createTransaction = (data) =>
  new Promise((resolve, reject) => {
    const query = 'INSERT INTO subscription_transaction SET ?'
    const query2 = 'INSERT INTO subscription_transaction_history SET ?'

    db.query(query, data, (err, results) => {
      if (err) throw new Error(err)
      db.query(query2, data, (err2, results2) => {
        if (err2) throw new Error(err2)
        resolve(results)
      })
    })
  })

/**
 * Update a transaction and transaction history
 * @param {UpdateTransactionTxn} txn Transaction object to be inserted
 * @param {UpdateTransactionTxnHistory} txnhistory Transaction history object to be inserted
 * @param {String} vOrderId New transaction order id to be updated
 */
module.exports.updateTransaction = (txn, txnhistory, vOrderId) => new Promise((resolve, reject) => {
  const query = 'UPDATE subscription_transaction SET ? WHERE vOrderId = ?'
  const query2 = 'INSERT INTO subscription_transaction_history SET ?'

  db.query(query, [txn, vOrderId], (err, results) => {
    if (err) throw new Error(err)
    db.query(query2, txnhistory, (err2, results2) => {
      if (err2) throw new Error(err2)
      resolve(results)
    })
  })
})

module.exports.getTodaysTransactions = () => new Promise((resolve, reject) => {
  const query = 'SELECT * FROM `subscription_transaction` WHERE dStartDate IN (CURDATE())'

  db.query(query, (err, results) => {
    if (err) throw new Error(err)
    resolve(results)
  })
})

module.exports.getTransactionByOrgId = (iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT * FROM subscription_transaction WHERE iOrganizationId = ?'

    db.query(query, [iOrganizationId], (err, results) => {
      if (err) throw new Error(err)
      resolve(results[0])
    })
  })

module.exports.getTransactionByvOrderId = (vOrderId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT * FROM subscription_transaction WHERE vOrderId = ?'

    db.query(query, [vOrderId], (err, results) => {
      if (err) throw new Error(err)
      resolve(results[0])
    })
  })

module.exports.getTransactionHistoryByvOrderId = (vOrderId, iSTranId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT sth.*, om.vOrganizationName FROM subscription_transaction_history sth JOIN organization_mas om ON om.iOrganizationId = sth.iOrganizationId WHERE vOrderId = ? AND iSTranId = ? ORDER BY dDate DESC'
    db.query(query, [vOrderId, iSTranId], (err, results) => {
      if (err) throw new Error(err)
      resolve(results[0])
    })
  })

module.exports.countUserLimit = (iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT iUserLimit FROM subscription_transaction WHERE iOrganizationId = ?'

    db.query(query, [iOrganizationId], (err, results) => {
      if (err) throw new Error(err)
      resolve(results[0])
    })
  })

module.exports.countAssessmentLimit = (iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT iAssessmentLimit FROM subscription_transaction WHERE iOrganizationId = ?'

    db.query(query, [iOrganizationId], (err, results) => {
      if (err) throw new Error(err)
      resolve(results[0])
    })
  })

module.exports.getSubscriptionHistoryByOrgId = (iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT sth.iSTranId, sth.vOrderId, sth.vPlanName, om.vOrganizationName, sth.iUserLimit, sth.iAssessmentLimit, sth.vTransactionId, sth.fAmount, sth.dDate, sth.dEndDate, sth.iTotalDays  FROM subscription_transaction_history as sth JOIN organization_mas om ON om.iOrganizationId = sth.iOrganizationId WHERE sth.iOrganizationId = ? ORDER BY sth.dDate DESC'
    db.query(query, [iOrganizationId], (err, results) => {
      if (err) throw new Error(err)
      resolve(results)
    })
  })

module.exports.getSubscriptionHistory = () =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT sth.iSTranId, sth.vOrderId, sth.vPlanName, om.vOrganizationName, sth.iUserLimit, sth.iAssessmentLimit, sth.vTransactionId, sth.fAmount, sth.dDate, sth.dEndDate, sth.iTotalDays  FROM subscription_transaction_history as sth JOIN organization_mas om ON om.iOrganizationId = sth.iOrganizationId'
    db.query(query, (err, results) => {
      if (err) throw new Error(err)
      resolve(results)
    })
  })
