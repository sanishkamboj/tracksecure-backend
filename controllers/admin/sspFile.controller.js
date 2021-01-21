const fs = require('fs')
const path = require('path')
const AWS = require('aws-sdk')
const PizZip = require('pizzip')
const Docxtemplater = require('docxtemplater')

// utils
const ApiResponse = require('../../utils/ApiResponse')
const IsNull = require('../../utils/isNull')
const globals = require('../../utils/globals')

module.exports.generateFile = async (req, res) => {
  const apiResponse = new ApiResponse()

  try {
    const content = fs.readFileSync(path.resolve('./public/SSP.docx'), 'binary')
    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip)
    doc.setData({
      first_name: 'rahul'
    })
    doc.render()
    const buf = doc.getZip().generate({ type: 'nodebuffer' })

    const s3 = new AWS.S3({
      credentials: {
        accessKeyId: globals.AWS_ACCESS_KEY,
        secretAccessKey: globals.AWS_SECRET_ACCESS_KEY
      }
    })

    const s3Put = await s3
      .putObject({
        Bucket: 'tracksecure.toolkit',
        Key: 'development/storage/ssp/sample.docx',
        Body: buf
      })
      .promise()

    const signedUrl = await s3.getSignedUrlPromise('getObject', {
      Bucket: 'tracksecure.toolkit',
      Key: 'development/storage/ssp/sample.docx'
    })

    apiResponse.data.signedUrl = signedUrl
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(apiResponse)
  }
}

module.exports.deleteFile = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iSSPFileId, Key } = req.query

    if (IsNull(iSSPFileId) || IsNull(Key)) {
      apiResponse.message = 'SSP File id and File Key is required'
      return res.status(422).json(apiResponse)
    }

    const s3 = new AWS.S3({
      credentials: {
        accessKeyId: globals.AWS_ACCESS_KEY,
        secretAccessKey: globals.AWS_SECRET_ACCESS_KEY
      }
    })

    await s3
      .deleteObject({
        Bucket: 'tracksecure.toolkit',
        Key
      })
      .promise()

    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(error)
  }
}
