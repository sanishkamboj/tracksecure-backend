const aws = require('aws-sdk')

// utils
const globals = require('../utils/globals')
const Bucket = globals.AWS_BUCKET

const s3 = new aws.S3({
  credentials: {
    accessKeyId: globals.AWS_ACCESS_KEY,
    secretAccessKey: globals.AWS_SECRET_ACCESS_KEY
  }
})

/**
 * Get list of objects in bucket
 * @param {Number} MaxKeys Sets the maximum number of keys returned in the response.
 * @param {String} Prefix Limits the response to keys that begin with the specified prefix.
 */
module.exports.getObjectList = (MaxKeys = 100, Prefix = '') =>
  new Promise((resolve, reject) => {
    const params = { Bucket, MaxKeys, Prefix }
    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        throw new Error(err)
      }
      resolve(data)
    })
  })

/**
 * Deletes an object from an S3 bucket.
 * @param {String} Key Key name of the object to delete.
 */
module.exports.deleteObject = (Key) =>
  new Promise((resolve, reject) => {
    const params = { Bucket, Key }
    s3.deleteObject(params, (err, data) => {
      if (err) {
        throw new Error(err)
      }
      resolve(data)
    })
  })

module.exports.getSignedUrl = (Key) =>
  new Promise((resolve, reject) => {
    const params = { Bucket, Key }
    s3.getSignedUrl('getObject', params, (err, url) => {
      if (err) {
        throw new Error(err)
      }
      resolve(url)
    })
  })

module.exports.getObject = (Key) =>
  new Promise((resolve, reject) => {
    const params = { Bucket, Key }
    s3.getObject(params, (err, data) => {
      if (err) throw new Error(err.message)
      resolve(data)
    })
  })

module.exports.getObjectStream = (Key) =>
  new Promise((resolve, reject) => {
    const params = { Bucket, Key }
    const objectStream = s3.getObject(params).createReadStream()
    resolve(objectStream)
  })
