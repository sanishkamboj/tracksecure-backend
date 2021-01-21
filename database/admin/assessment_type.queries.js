const db = require('../connection')

module.exports.listAssessmentTypes = () =>
  new Promise((resolve, reject) => {
    const query = 'SELECT * FROM assessment_type_mas'

    db.query(query, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.getAssessmentTypeById = (id) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT * FROM assessment_type_mas WHERE iATMId = ?'

    db.query(query, [id], (err, results) => {
      if (err) reject(err)
      resolve(results[0])
    })
  })

module.exports.getAssessmentTypeByName = (name) =>
  new Promise((resolve, reject) => {
    const query =
      'SELECT * FROM assessment_type_mas WHERE AssessmentTypeName = ?'

    db.query(query, [name], (err, results) => {
      if (err) reject(err)
      resolve(results[0])
    })
  })

module.exports.createAssessmentType = (data) =>
  new Promise((resolve, reject) => {
    const query = 'INSERT INTO assessment_type_mas SET ?'

    db.query(query, data, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.deleteAssessmentType = (id) =>
  new Promise((resolve, reject) => {
    const query = 'DELETE FROM assessment_type_mas WHERE iATMId = ?'

    db.query(query, [id], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })

module.exports.updateAssessmentType = (data, id) =>
  new Promise((resolve, reject) => {
    const query = 'UPDATE assessment_type_mas SET ? WHERE iATMId = ?'

    db.query(query, [data, id], (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })
