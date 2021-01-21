const db = require('../connection')

module.exports.saveToken = (data) => new Promise((resolve, reject) => {
  const query = 'INSERT INTO forgot_password SET ?'
  db.query(query, data, (err, results) => {
    if (err) throw new Error(err)
    resolve(results)
  })
})

module.exports.getToken = (email, vOTP) => new Promise((resolve, reject) => {
  const query = 'SELECT * FROM forgot_password WHERE email = ? AND vOTP = ?'
  db.query(query, [email, vOTP], (err, results) => {
    if (err) throw new Error(err)
    resolve(results[0])
  })
})

module.exports.deleteToken = (email, vOTP) => new Promise((resolve, reject) => {
  const query = 'DELETE FROM forgot_password WHERE email = ? AND vOTP = ?'
  db.query(query, [email, vOTP], (err, results) => {
    if (err) throw new Error(err)
    resolve(results)
  })
})
