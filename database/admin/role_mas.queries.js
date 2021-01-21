const db = require('../connection')

// utils
const IsNull = require('../../utils/isNull')

module.exports.listRoles = (iOrganizationId = null) =>
  new Promise((resolve, reject) => {
    let query =
      'SELECT rm.iRoleId, om.vOrganizationName, rm.vRoleName FROM role_mas rm JOIN organization_mas om ON om.iOrganizationId = rm.iOrganizationId'

    if (!IsNull(iOrganizationId)) {
      query += ` WHERE om.iOrganizationId = ${iOrganizationId}`
    }

    db.query(query, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.getRoleById = (id) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT * FROM role_mas WHERE iRoleId = ?'

    db.query(query, [id], (err, results) => {
      if (err) reject(err)
      resolve(results[0])
    })
  })

module.exports.createRole = (data) =>
  new Promise((resolve, reject) => {
    const query = 'INSERT INTO role_mas SET ?'

    db.query(query, data, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.updateRole = (data, id) =>
  new Promise((resolve, reject) => {
    const query = 'UPDATE role_mas SET ? WHERE iRoleId = ?'

    db.query(query, [data, id], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.deleteRoleById = (id) =>
  new Promise((resolve, reject) => {
    const query = 'DELETE FROM role_mas WHERE iRoleId = ?'

    db.query(query, [id], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })
