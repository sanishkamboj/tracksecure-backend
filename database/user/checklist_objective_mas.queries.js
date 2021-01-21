const db = require('../connection')

module.exports.getObjectiveMasRecords = (iCMId) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT * FROM checklist_objective_mas WHERE iCMId = ?'
    db.query(query, [iCMId], (err, results) => {
      if (err) throw err
      resolve(results)
    })
  })
