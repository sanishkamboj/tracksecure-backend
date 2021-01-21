/**
 * @typedef CreateToken
 * @property {Number} iUserId Required. User id of a user requesting reset token
 * @property {String} vToken Required. A unique token
 * @property {Date} expireAt Required. Expiration time of a token
 */

const db = require('../connection')

/**
 * Create a new token for a user requesting password reset
 * @param {CreateToken} data
 * @returns {Promise<Object>}
 */
module.exports.createToken = (data) =>
  new Promise((resolve, reject) => {
    const query = 'INSERT INTO password_reset_tokens SET ?'
    db.query(query, data, (err, results) => {
      if (err) throw new Error(err)
      resolve(results)
    })
  })

/**
 * Get a token
 * @param {String} vToken
 * @returns {Promise<Object>}
 */
module.exports.getToken = (vToken) =>
  new Promise((resolve, reject) => {
    const query = 'SELECT iUserId, vToken, expireAt FROM password_reset_tokens WHERE vToken = ?'
    db.query(query, [vToken], (err, results) => {
      if (err) throw new Error(err)
      resolve(results[0])
    })
  })

/**
 * Delete a token
 * @param {Number} iUserId
 * @param {String} vToken
 */
module.exports.deleteToken = (iUserId, vToken) =>
  new Promise((resolve, reject) => {
    const query = 'DELETE FROM password_reset_tokens WHERE iUserId = ? AND vToken = ?'
    db.query(query, [iUserId, vToken], (err, results) => {
      if (err) throw new Error(err)
      resolve(results)
    })
  })
