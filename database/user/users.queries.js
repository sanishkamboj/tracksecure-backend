const db = require('../connection')

module.exports.findUserByEmail = (vEmail) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE vEmail = ?'

    db.query(query, [vEmail], (err, results) => {
      if (err) throw err
      resolve(results[0])
    })
  })

module.exports.findUserById = (iUserId) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE iUserId = ?'

    db.query(query, [iUserId], (err, results) => {
      if (err) throw err
      resolve(results[0])
    })
  })

module.exports.findUserByOrg = (iUserId, iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT * FROM users WHERE iUserId = ? AND iOrganizationId = ?'

    db.query(query, [iUserId, iOrganizationId], (err, results) => {
      if (err) throw err
      resolve(results[0])
    })
  })

module.exports.findPaysimpleUserByOrg = (iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT vPaysimpleId FROM users WHERE vPaysimpleId IS NOT NULL AND iOrganizationId = ?'
    db.query(query, [iOrganizationId], (err, results) => {
      if (err) throw new Error(err)
      resolve(results[0])
    })
  })

module.exports.findUserByOrgAndEmail = (iOrganizationId, vEmail) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE vEmail = ? AND iOrganizationId = ?'

    db.query(query, [vEmail, iOrganizationId], (err, results) => {
      if (err) throw err
      resolve(results[0])
    })
  })

module.exports.getProfile = (iUserId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT u.iUserId, rm.iRoleId, u.iRoleId, u.iOrganizationId, u.vFirstName, u.vLastName, om.vOrganizationName, rm.vRoleName, u.vUserName, u.vEmail, u.vPhone, u.vTitle FROM users u JOIN organization_mas om ON om.iOrganizationId = u.iOrganizationId JOIN role_mas rm ON rm.iRoleId = u.iRoleId WHERE iUserId = ?'

    db.query(query, [iUserId], (err, results) => {
      if (err) throw err
      resolve(results[0])
    })
  })

module.exports.findUserByIdAndUpdate = (data, iUserId) =>
  new Promise((resolve, reject) => {
    const query = 'UPDATE users SET ? WHERE iUserId = ?'

    db.query(query, [data, iUserId], (err, results) => {
      console.log(err)
      if (err) throw new Error(err)
      resolve(results)
    })
  })

module.exports.createUser = (data) =>
  new Promise((resolve, reject) => {
    const query = 'INSERT INTO users SET ?'

    db.query(query, data, (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })

module.exports.countUsersByOrgId = (iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT COUNT(iUserId) AS users FROM users WHERE iOrganizationId = ?'

    db.query(query, [iOrganizationId], (err, results) => {
      if (err) throw err
      resolve(results[0])
    })
  })

module.exports.updateUserById = (data, iUserId) =>
  new Promise((resolve, reject) => {
    const query = 'UPDATE users SET ? WHERE iUserId = ?'

    db.query(query, [data, iUserId], (err, results) => {
      if (err) {
        throw new Error(err)
      }
      resolve(results)
    })
  })
