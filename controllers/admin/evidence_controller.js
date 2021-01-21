const AWS = require('aws-sdk')

// utils
const ApiResponse = require('../../utils/ApiResponse')
const IsNull = require('../../utils/isNull')
const globals = require('../../utils/globals')

const dbEvidenceRecords = require('../../database/admin/evidence_records.queries')

module.exports.uploadEvidence = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { files } = req
    const { iCRId, fileDescription } = req.body
    if (files.length === 0) {
      apiResponse.message = 'Please upload atleast one file'
      return res.status(422).json(apiResponse)
    }

    const data = []
    files.forEach((f, i) => {
      data.push([iCRId, f.key, f.originalname, fileDescription[i]])
    })

    await dbEvidenceRecords.createEvidenceRecords(data)

    apiResponse.message = 'Evidence record saved'
    return res.status(201).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.getEvidenceRecords = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iCRId, iOrganizationId } = req.query

    if (!IsNull(iCRId)) {
      const evidenceFiles = await dbEvidenceRecords.getEvidenceRecordsByICRId(iCRId)
      apiResponse.data.evidenceFiles = evidenceFiles
    }
    if (!IsNull(iOrganizationId)) {
      const evidenceList = await dbEvidenceRecords.listEvidenceRecordsByOrgId(
        iOrganizationId
      )
      apiResponse.data.evidenceList = evidenceList
    } else {
      const evidenceList = await dbEvidenceRecords.listEvidenceRecords()
      apiResponse.data.evidenceList = evidenceList
    }

    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.downloadFile = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { Key } = req.params
    const s3 = new AWS.S3({
      credentials: {
        accessKeyId: globals.AWS_ACCESS_KEY,
        secretAccessKey: globals.AWS_SECRET_ACCESS_KEY
      }
    })

    const params = {
      Bucket: 'tracksecure.toolkit',
      Key
    }

    const file = await s3.getSignedUrlPromise('getObject', params)
    apiResponse.data.url = file
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.deleteEvidenceFileById = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iCRId, Key } = req.query

    if (IsNull(iCRId) || IsNull(Key)) {
      apiResponse.message = 'Checklist Id and File Key is required'
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

    const deleteFromDb = await dbEvidenceRecords.deleteEvidenceRecord(
      iCRId,
      Key
    )

    apiResponse.data.deletedFile = deleteFromDb
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
