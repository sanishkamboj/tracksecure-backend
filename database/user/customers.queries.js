const db = require('../connection')

module.exports.listCustomersByOrgId = (iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT u.*, rm.vRoleName, om.vOrganizationName FROM users u JOIN role_mas rm on rm.iRoleId = u.iRoleId JOIN organization_mas om ON om.iOrganizationId = u.iOrganizationId WHERE u.iOrganizationId = ?'

    db.query(query, [iOrganizationId], (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })

module.exports.getCustomerById = (iUserId, iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT * FROM users WHERE iUserId = ? AND iOrganizationId = ?'

    db.query(query, [iUserId, iOrganizationId], (err, results) => {
      if (err) throw err
      resolve(results[0])
    })
  })

module.exports.updateCustomer = (data, iUserId, iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query = 'UPDATE users SET ? WHERE iUserId = ? AND iOrganizationId = ?'

    db.query(query, [data, iUserId, iOrganizationId], (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })

module.exports.deleteCustomer = (iUserId, iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query = 'DELETE FROM users WHERE iUserId = ? AND iOrganizationId = ?'

    db.query(query, [iUserId, iOrganizationId], (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })
