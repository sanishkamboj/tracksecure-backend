const fs = require('fs')
const path = require('path')
const AWS = require('aws-sdk')
const moment = require('moment')
const PizZip = require('pizzip')
const Docxtemplater = require('docxtemplater')

// utils
const ApiResponse = require('../../utils/ApiResponse')
const IsNull = require('../../utils/isNull')
const globals = require('../../utils/globals')

// dbs
const dbAssessmentRecords = require('../../database/user/assessment_records.queries')
const dbUsers = require('../../database/user/users.queries')
const dbSspFile = require('../../database/user/sspFIle.queries')

const poanm = async (iARId) => {
  try {
    const poaRecordIds = await dbSspFile.getPOARecords(iARId)
    const poaIDs = poaRecordIds.map((e) => e.iPOAId)
    const poaSet = new Set(poaIDs)
    const poaSetArr = Array.from(poaSet)
    if (poaSetArr.length === 0) {
      return poaSetArr
    }
    const poanm = await dbSspFile.getMilestoneRecords(poaSetArr)
    return poanm
  } catch (error) {
    throw new Error(error.message)
  }
}

const checklistStatusModify = (status) => {
  if (status === 1) {
    return 'Not Applicable'
  } else if (status === 2) {
    return 'Planned to be implemented'
  } else if (status === 3) {
    return 'Implemented'
  } else {
    return 'Not Applicable'
  }
}

const getData = async (iUserId, iCertifyingUserId, iOrganizationId, iARId) => {
  try {
    const ar = await dbSspFile.getAssesmentRecord(iARId)
    const o = await dbSspFile.getOrganization(iOrganizationId)
    const u = await dbSspFile.getUser(iUserId)
    const cu = await dbSspFile.getUser(iCertifyingUserId)
    const pmr = await poanm(iARId)
    const checklistRecordParents = await dbSspFile.getChecklistRecordParents()

    const arr = []
    const checklistParents = []
    for (let i = 0, len = checklistRecordParents.length; i < len; i += 1) {
      const crp = checklistRecordParents[i]
      arr.push(crp.ShortDescription)
      checklistParents.push({ parent: crp })
    }

    const checklist = await dbSspFile.getChecklistRecord(iOrganizationId, iARId, arr)

    for (let i = 0, len = checklistParents.length; i < len; i += 1) {
      const clp = checklistParents[i]
      clp.parent.child = []
      for (let j = 0, len2 = checklist.length; j < len2; j += 1) {
        const cl = checklist[j]
        if (clp.parent.ShortDescription === cl.ShortDescription) {
          clp.parent.child.push(cl)
        }
      }
    }
    const obj = {
      docDate: `${moment().format('YYYY-MM-DD')}`,
      iATMName: ar.iATMName,
      iATMId: ar.iATMId,
      vOrganizationName: o.vOrganizationName ? o.vOrganizationName : '',
      vOrganizationAddress: o.vOrganizationAddress ? o.vOrganizationAddress : '-',
      vOrganizationPhone: o.vOrganizationPhone ? o.vOrganizationPhone : '-',
      iCertifyingUserId: cu.iUserId,
      iCertifyingUserName: `${cu.vFirstName} ${cu.vLastName}`,
      iCertifyingUserEmail: cu.vEmail,
      iCertifyingUserTitle: cu.vTitle,
      iCertifyingUserPhone: cu.vPhone,
      iCertifyingUserAddress: cu.vUserAddress,
      vAssessmentDescription: ar.vAssessmentDescription
        ? ar.vAssessmentDescription
        : 'No Description',
      u,
      pmr,
      checklist: checklistParents
    }
    console.log(obj.vOrganizationAddress)
    console.log(obj.vOrganizationName)
    console.log(obj.vOrganizationPhone)
    return obj
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

const generatedFile = (dataToGenerate) => {
  try {
    const content = fs.readFileSync(path.resolve('./public/SSP.docx'), 'binary')
    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip)

    doc.setData(dataToGenerate)
    doc.render()
    const buf = doc.getZip().generate({ type: 'nodebuffer' })
    // fs.writeFileSync(path.resolve('./public/', 'output.docx'), buf)
    return buf
  } catch (error) {
    console.log(error)
  }
}

module.exports.generateFile = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iOrganizationId, iARId } = req.params
    const { id } = req.user

    const user = await dbUsers.findUserById(id)

    if (IsNull(user)) {
      apiResponse.message = 'User not found'
      return res.status(404).json(apiResponse)
    }

    const assessmentRecord = await dbAssessmentRecords.getAssessmentRecord(
      iARId,
      iOrganizationId
    )

    if (IsNull(assessmentRecord)) {
      apiResponse.message = 'Assessment Record not found'
      return res.status(404).json(apiResponse)
    }

    const dataToGenerate = await getData(
      id,
      assessmentRecord.iCertifyingUserId,
      iOrganizationId,
      iARId
    )

    dataToGenerate.pmr.forEach((e) => {
      e.Responsible = dataToGenerate.iCertifyingUserEmail
      e.TargetCompletion = moment(e.TargetCompletion).format('YYYY-MM-DD')
      if (e.ResourceStatus === 1) {
        e.ResourceStatus = 'Funded'
      } else {
        e.ResourceStatus = 'Unfunded'
      }

      if (e.POAStatus === 1) {
        e.POAStatus = 'Not Started'
      } else if (e.POAStatus === 2) {
        e.POAStatus = 'In Progress'
      } else {
        e.POAStatus = 'Completed'
      }
    })

    dataToGenerate.checklist.forEach((cl) => {
      cl.parent.child.forEach((e) => {
        e.ChecklistRecordStatus = checklistStatusModify(e.ChecklistRecordStatus)
        if (e.Results === null || e.Results === undefined) {
          e.Results = 'Pending'
        }
      })
    })

    const generatedDocFile = generatedFile(dataToGenerate)

    const s3 = new AWS.S3({
      credentials: {
        accessKeyId: globals.AWS_ACCESS_KEY,
        secretAccessKey: globals.AWS_SECRET_ACCESS_KEY
      }
    })

    const Key = `development/storage/ssp/${iARId}_${id}_${Date.now()}.docx`

    await s3
      .putObject({
        Bucket: 'tracksecure.toolkit',
        Key,
        Body: generatedDocFile
      })
      .promise()

    await dbSspFile.saveDownloadRecord({ iARId, iUserId: id, vFilePath: Key })

    const signedUrl = await s3.getSignedUrlPromise('getObject', {
      Bucket: 'tracksecure.toolkit',
      Key
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

module.exports.getDownloadRecords = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iUserId, iARId } = req.query
    if (IsNull(iUserId) || IsNull(iARId)) {
      apiResponse.message = 'User id and assessment record id are required'
      return res.status(400).json(apiResponse)
    }
    const sspRecords = await dbSspFile.getSspDownloadRecords(iUserId, iARId)
    apiResponse.data.sspRecords = sspRecords
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(error)
  }
}
