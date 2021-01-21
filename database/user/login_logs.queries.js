const db = require('../connection')

module.exports.saveLoginLog = (data) => new Promise((resolve, reject) => {
  const query = 'INSERT INTO login_logs SET ?'

  db.query(query, data, (err, results) => {
    if (err) throw err
    resolve(results)
  })
})

module.exports.getLoginLog = (iLLogsId) => new Promise((resolve, reject) => {
  const query = 'SELECT * FROM login_logs WHERE iLLogsId = ?'

  db.query(query, [iLLogsId], (err, results) => {
    if (err) throw err
    resolve(results[0])
  })
})

module.exports.updateLoginLog = (data, iLLogsId) => new Promise((resolve, reject) => {
  const query = 'UPDATE login_logs SET ? WHERE iLLogsId = ?'

  db.query(query, [data, iLLogsId], (err, results) => {
    if (err) throw err
    resolve(results)
  })
})
