const db = require('../connection')

module.exports.createOTP = (data) =>
  new Promise((resolve, reject) => {
    const query = 'INSERT INTO OTPs SET ?'
    db.query(query, data, (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })

module.exports.findOTP = (iUserId, vOTPSubject, iOTP) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT * FROM OTPs WHERE iUserId = ? AND vOTPSubject = ? AND iOTP = ? ORDER BY expireAt DESC'
    db.query(query, [iUserId, vOTPSubject, iOTP], (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })

module.exports.deleteOTP = (iUserId, vOTPSubject, iOTP) =>
  new Promise((resolve, reject) => {
    const query = 'DELETE FROM OTPs WHERE iUserId = ? AND vOTPSubject = ? AND iOTP = ?'
    db.query(query, [iUserId, vOTPSubject, iOTP], (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })
