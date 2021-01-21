const db = require('../connection')

module.exports.listOrganizations = () =>
  new Promise((resolve, reject) => {
    const query = 'SELECT * FROM organization_mas'

    db.query(query, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.getOrganizationByName = (vOrganizationName) => new Promise((resolve, reject) => {
  const query = 'SELECT * FROM organization_mas WHERE vOrganizationName = ?'

  db.query(query, [vOrganizationName], (err, results) => {
    if (err) throw new Error(err)
    resolve(results[0])
  })
})

module.exports.getOrganization = (id) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT * FROM organization_mas WHERE iOrganizationId = ?'

    db.query(query, [id], (err, results) => {
      if (err) reject(err)
      resolve(results[0])
    })
  })

module.exports.createOrganization = (data) =>
  new Promise((resolve, reject) => {
    const query = 'INSERT INTO organization_mas SET ?'

    db.query(query, data, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.updateOrganization = (data, id) =>
  new Promise((resolve, reject) => {
    const query = 'UPDATE organization_mas SET ? WHERE iOrganizationId = ?'

    db.query(query, [data, id], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.deleteOrganization = (id) =>
  new Promise((resolve, reject) => {
    const query = 'DELETE FROM organization_mas WHERE iOrganizationId = ?'

    db.query(query, [id], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })
