const ApiResponse = require('../../utils/ApiResponse')
const isNull = require('../../utils/isNull')

// db queries
const dbRolesMas = require('../../database/user/roles_mas.queries')
const dbOrganizationMas = require('../../database/admin/organization_mas.queries.js')

module.exports.listRolesByOrgIds = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iOrganizationId } = req.params
    const roles = await dbRolesMas.listRolesByOrgId(iOrganizationId)
    apiResponse.data.roles = roles
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Get role by id
module.exports.getRoleByOrgId = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { id, iOrganizationId } = req.params

    const role = await dbRolesMas.getRoleByIdAndOrgId(id, iOrganizationId)

    if (isNull(role)) {
      apiResponse.message = 'Role not found'
      return res.status(404).json(apiResponse)
    }

    apiResponse.data.role = role
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Create role
module.exports.createRole = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iOrganizationId, vRoleName } = req.body

    if (isNull(iOrganizationId)) {
      apiResponse.message = 'Organization name required'
      return res.status(422).json(apiResponse)
    }

    if (isNull(vRoleName)) {
      apiResponse.message = 'Role name required'
      return res.status(422).json(apiResponse)
    }

    const org = await dbOrganizationMas.getOrganization(iOrganizationId)

    if (isNull(org)) {
      apiResponse.message = 'Organization not found'
      return res.status(404).json(apiResponse)
    }

    const createdRole = await dbRolesMas.createRole({
      iOrganizationId,
      vRoleName
    })

    if (createdRole.affectedRows === 0) {
      apiResponse.message = 'Could not create role'
      return res.status(404).json(apiResponse)
    }

    apiResponse.data.role = createdRole.insertId
    apiResponse.message = 'Role has been created successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Update role
module.exports.updateRole = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iOrganizationId, vRoleName } = req.body
    const { id } = req.params

    const organization = await dbOrganizationMas.getOrganization(
      iOrganizationId
    )

    if (isNull(organization)) {
      apiResponse.message = 'Organization not found'
      return res.status(404).json(apiResponse)
    }

    const data = {}
    if (!isNull(iOrganizationId)) {
      data.iOrganizationId = iOrganizationId
    }

    if (!isNull(vRoleName)) {
      data.vRoleName = vRoleName
    }

    const updatedRole = await dbRolesMas.updateRoleByOrgId(
      data,
      id,
      iOrganizationId
    )

    if (updatedRole.affectedRows === 0) {
      apiResponse.message = 'Could not update role'
      return res.status(404).json(apiResponse)
    }

    apiResponse.data.role = updatedRole.affectedRows
    apiResponse.message = 'Role has been updated successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Delete role
module.exports.deleteRole = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { id, iOrganizationId } = req.params

    const role = await dbRolesMas.getRoleByIdAndOrgId(id, iOrganizationId)

    if (isNull(role)) {
      apiResponse.message = 'Role not found'
      return res.status(404).json(apiResponse)
    }

    if (role.vRoleName === 'Subscriber') {
      apiResponse.message = 'Subscriber role can not be deleted'
      return res.status(400).json(apiResponse)
    }

    const deletedRole = await dbRolesMas.deleteRoleByIdAndOrgId(
      id,
      iOrganizationId
    )

    if (deletedRole.affectedRows === 0) {
      apiResponse.message = 'Could not delete role'
      return res.status(404).json(apiResponse)
    }

    apiResponse.data.role = deletedRole.affectedRows
    apiResponse.message = 'Role has been deleted successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
