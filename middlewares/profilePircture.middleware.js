const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const mime = require('mime')

// utils
const globals = require('../utils/globals')

const s3 = new aws.S3({
  credentials: {
    accessKeyId: globals.AWS_ACCESS_KEY,
    secretAccessKey: globals.AWS_SECRET_ACCESS_KEY
  }
})

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: globals.AWS_BUCKET,
    key: function (req, file, cb) {
      const ext = mime.getExtension(file.mimetype)
      cb(null, `profile_imgs/${Date.now().toString()}.${ext}`)
    }
  })
}).single('profile_picture')

module.exports = upload
