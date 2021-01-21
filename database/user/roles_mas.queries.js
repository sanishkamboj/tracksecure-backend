const db = require('../connection')

module.exports.listRolesByOrgId = (iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT rm.iRoleId, om.vOrganizationName, rm.vRoleName FROM role_mas rm JOIN organization_mas om ON om.iOrganizationId = rm.iOrganizationId WHERE om.iOrganizationId = ?'

    db.query(query, [iOrganizationId], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.getRoleByIdAndOrgId = (id, iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT * FROM role_mas WHERE iRoleId = ? AND iOrganizationId = ?'

    db.query(query, [id, iOrganizationId], (err, results) => {
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

module.exports.updateRoleByOrgId = (data, id, iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query =
      'UPDATE role_mas SET ? WHERE iRoleId = ? AND iOrganizationId = ?'

    db.query(query, [data, id, iOrganizationId], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.deleteRoleByIdAndOrgId = (id, iOrganizationId) =>
  new Promise((resolve, reject) => {
    const query =
      'DELETE FROM role_mas WHERE iRoleId = ? AND iOrganizationId = ?'

    db.query(query, [id, iOrganizationId], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })
