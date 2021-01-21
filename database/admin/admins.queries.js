const db = require('../connection')

module.exports.findAdminByEmail = (vEmail) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT * FROM admin WHERE vEmail = ?'

    db.query(query, [vEmail], (err, results) => {
      if (err) throw err
      resolve(results[0])
    })
  })

module.exports.updatePassword = (vEmail, newPassword) =>
  new Promise((resolve, reject) => {
    const query = 'UPDATE admin SET vPassword = ? WHERE vEmail = ?'

    db.query(query, [newPassword, vEmail], (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })

module.exports.listAdmins = () =>
  new Promise((resolve, reject) => {
    const query = 'SELECT * FROM admin'

    db.query(query, (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })

module.exports.findAdminById = (iAdminId) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT * FROM admin WHERE iAdminId = ?'

    db.query(query, [iAdminId], (err, results) => {
      if (err) throw err
      resolve(results[0])
    })
  })

module.exports.createAdmin = (data) =>
  new Promise((resolve, reject) => {
    const query = 'INSERT INTO admin SET ?'

    db.query(query, data, (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })

module.exports.updateAdmin = (data, iAdminId) =>
  new Promise((resolve, reject) => {
    const query = 'UPDATE admin SET ? WHERE iAdminId = ?'

    db.query(query, [data, iAdminId], (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })

module.exports.incrementLoginCount = (iAdminId, vFromIp) =>
  new Promise((resolve, reject) => {
    const query =
      'UPDATE admin SET iTotLogin = iTotLogin + 1, dLastAccess = NOW(), vFromIp = ? WHERE iAdminId = ?'

    db.query(query, [vFromIp, iAdminId], (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })

module.exports.deleteAdmin = (iAdminId) =>
  new Promise((resolve, reject) => {
    const query = 'DELETE FROM admin WHERE iAdminId = ?'

    db.query(query, [iAdminId], (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })
