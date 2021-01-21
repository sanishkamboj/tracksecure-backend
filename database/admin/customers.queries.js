const db = require('../connection')

// utils
const IsNull = require('../../utils/isNull')

module.exports.listCustomers = (iOrganizaionId = null) =>
  new Promise((resolve, reject) => {
    let query =
      'SELECT u.*, rm.vRoleName FROM users u JOIN role_mas rm on rm.iRoleId = u.iRoleId'

    if (!IsNull(iOrganizaionId)) {
      query += ` WHERE u.iOrganizationId = ${iOrganizaionId}`
    }

    db.query(query, (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })

module.exports.getCustomerByEmail = (vEmail) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE vEmail = ?'

    db.query(query, [vEmail], (err, results) => {
      if (err) throw err
      resolve(results[0])
    })
  })

module.exports.getCustomerById = (iUserId) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE iUserId = ?'

    db.query(query, [iUserId], (err, results) => {
      if (err) throw err
      resolve(results[0])
    })
  })

module.exports.createCustomer = (data) =>
  new Promise((resolve, reject) => {
    const query = 'INSERT INTO users SET ?'

    db.query(query, data, (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })

module.exports.deleteCustomer = (iUserId) =>
  new Promise((resolve, reject) => {
    const query = 'DELETE FROM users WHERE iUserId = ?'

    db.query(query, [iUserId], (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })

module.exports.updateCustomer = (data, iUserId) =>
  new Promise((resolve, reject) => {
    const query = 'UPDATE users SET ? WHERE iUserId = ?'

    db.query(query, [data, iUserId], (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })
