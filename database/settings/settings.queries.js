const db = require('../connection')

module.exports.getSettings = () => new Promise((resolve, reject) => {
  const query = 'SELECT * FROM setting ORDER BY eConfigType'

  db.query(query, (err, results) => {
    if (err) reject(new Error(err.message))
    resolve(results)
  })
})
