const db = require('../connection')

module.exports.createCCTransaction = (data) =>
  new Promise((resolve, reject) => {
    const query = 'INSERT INTO subscription_cc_details SET ?'
    db.query(query, data, (err, results) => {
      if (err) throw new Error(err)
      resolve(results)
    })
  })

module.exports.updateCCDetails = (data, iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query =
      'UPDATE subscription_cc_details SET ? WHERE iOrganizationId = ?'
    db.query(query, [data, iOrganizationId], (err, results) => {
      if (err) throw new Error(err)
      resolve(results)
    })
  })

module.exports.getCCDetails = (iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT * FROM subscription_cc_details WHERE iOrganizationId = ?'

    db.query(query, [iOrganizationId], (err, results) => {
      if (err) throw new Error(err)
      resolve(results[0])
    })
  })
