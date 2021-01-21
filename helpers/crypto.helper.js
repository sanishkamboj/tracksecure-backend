const cs = require('crypto-simple')

// utils
const globals = require('../utils/globals')

module.exports.encrypt = (string) => {
  cs.key = globals.ENCRYPTION_KEY
  const encryptedData = cs.encrypt(string)
  return encryptedData
}

module.exports.decrypt = (string) => {
  cs.key = globals.ENCRYPTION_KEY
  const decryptedData = cs.decrypt(string)
  return decryptedData
}
