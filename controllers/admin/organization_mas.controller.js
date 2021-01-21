const ApiResponse = require('../../utils/ApiResponse')
const isNull = require('../../utils/isNull')

// db queries
const dbOrganizationMas = require('../../database/admin/organization_mas.queries')
const moment = require('moment')

// List organizations
module.exports.listOrganizations = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const organizations = await dbOrganizationMas.listOrganizations()
    apiResponse.data.organizations = organizations
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Get organization by id
module.exports.getOrganizationById = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { id } = req.params

    const organization = await dbOrganizationMas.getOrganization(id)

    if (isNull(organization)) {
      apiResponse.message = 'Organization not found'
      return res.status(404).json(apiResponse)
    }

    apiResponse.data.organization = organization
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Create organization
module.exports.createOrganization = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    let {
      vOrganizationName,
      vOrganizationAddress,
      vOrganizationPhone
    } = req.body
    vOrganizationName = vOrganizationName.trim()
    vOrganizationAddress = vOrganizationAddress.trim()
    vOrganizationPhone = vOrganizationPhone.trim()

    if (isNull(vOrganizationName)) {
      apiResponse.errors.push('Organization name required')
    }
    if (isNull(vOrganizationAddress)) {
      apiResponse.errors.push('Organization address is required')
    }
    if (isNull(vOrganizationPhone)) {
      apiResponse.errors.push('Organization phone is required')
    }
    if (apiResponse.errors.length > 0) return res.status(422).json(apiResponse)

    const orgByName = await dbOrganizationMas.getOrganizationByName(vOrganizationName)

    if (!isNull(orgByName)) {
      apiResponse.message = 'Organization already exists'
      return res.status(400).json(apiResponse)
    }

    const createdOrg = await dbOrganizationMas.createOrganization({
      vOrganizationName,
      vOrganizationAddress,
      vOrganizationPhone,
      createdDate: moment().format('YYYY-MM-DD')
    })

    if (createdOrg.affectedRows === 0) {
      apiResponse.message = 'Could not create organization'
      return res.status(404).json(apiResponse)
    }

    apiResponse.data.organization = createdOrg.insertId
    apiResponse.message = 'Organization has been created successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Update organization
module.exports.updateOrganization = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const {
      vOrganizationName,
      vOrganizationAddress,
      vOrganizationPhone
    } = req.body
    const { id } = req.params

    const organization = await dbOrganizationMas.getOrganization(id)

    if (isNull(organization)) {
      apiResponse.message = 'Organization not found'
      return res.status(404).json(apiResponse)
    }

    const data = {}
    if (!isNull(vOrganizationName)) {
      data.vOrganizationName = vOrganizationName
    }

    if (!isNull(vOrganizationAddress)) {
      data.vOrganizationAddress = vOrganizationAddress
    }

    if (!isNull(vOrganizationPhone)) {
      data.vOrganizationPhone = vOrganizationPhone
    }

    const updatedOrg = await dbOrganizationMas.updateOrganization(data, id)

    if (updatedOrg.affectedRows === 0) {
      apiResponse.message = 'Could not update organization'
      return res.status(404).json(apiResponse)
    }

    apiResponse.data.organization = updatedOrg.affectedRows
    apiResponse.message = 'Organization has been updated successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Delete organization
module.exports.deleteOrganization = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { id } = req.params

    const organization = await dbOrganizationMas.getOrganization(id)

    if (isNull(organization)) {
      apiResponse.message = 'Organization not found'
      return res.status(404).json(apiResponse)
    }

    const deletedOrg = await dbOrganizationMas.deleteOrganization(id)

    if (deletedOrg.affectedRows === 0) {
      apiResponse.message = 'Could not delete organization'
      return res.status(404).json(apiResponse)
    }

    apiResponse.data.organization = deletedOrg.affectedRows
    apiResponse.message = 'Organization has been deleted successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
