const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const mime = require('mime')

// utils
const ApiResponse = require('../utils/ApiResponse')
const IsNull = require('../utils/isNull')
const globals = require('../utils/globals')

// db
const dbChecklistRecords = require('../database/admin/checklist_records.queries')

const s3 = new aws.S3({
  credentials: {
    accessKeyId: globals.AWS_ACCESS_KEY,
    secretAccessKey: globals.AWS_SECRET_ACCESS_KEY
  }
})

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'tracksecure.toolkit',
    key: async function (req, file, cb) {
      try {
        const { iCRId } = req.body

        if (IsNull(iCRId)) {
          cb(new Error('Checklist Record is required'))
        }

        const checklistRecord = await dbChecklistRecords.getRecordById(iCRId)

        if (IsNull(checklistRecord)) {
          cb(new Error('Checklist Record Not Found'))
        }
        const key = `development/storage/evidence/${Date.now().toString()}.${mime.getExtension(
          file.mimetype
        )}`
        cb(null, key)
      } catch (error) {
        cb(new Error(error.message))
      }
    }
  }),
  fileFilter: function (req, file, cb) {
    if (IsNull(file)) {
      return cb(new Error('Please upload a file'))
    } else {
      cb(null, true)
    }
  },
  limits: { fileSize: 1024 * 1024 * 5 }
}).array('evidence', 5)

module.exports = async (req, res, next) => {
  const apiResponse = new ApiResponse()
  try {
    upload(req, res, (err) => {
      if (err) {
        apiResponse.message = err.message
        return res.status(422).json(apiResponse)
      }
      next()
    })
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
