const bcrypt = require('bcryptjs')

// utils
const ApiResponse = require('../../utils/ApiResponse')
const IsNull = require('../../utils/isNull')

// helpers
const mailHelper = require('../../helpers/nodemailer/mail.helper')

// db queries
const dbUsers = require('../../database/user/users.queries')
const dbCustomers = require('../../database/user/customers.queries')
const dbOrganizations = require('../../database/admin/organization_mas.queries')
const dbSubscriptionTransaction = require('../../database/admin/subscription_plan_transaction.queries')

// List customers
module.exports.listCustomers = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { id } = req.user
    const { iOrganizationId } = req.params

    const user = await dbUsers.findUserByOrg(id, iOrganizationId)

    if (IsNull(user)) {
      apiResponse.message = 'User not found'
      return res.status(400).json(apiResponse)
    }

    const customers = await dbCustomers.listCustomersByOrgId(iOrganizationId)
    customers.forEach((c) => {
      delete c.vPassword
    })
    apiResponse.data.customers = customers
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Create customer
module.exports.createCustomer = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const {
      vFirstName,
      vLastName,
      iOrganizationId,
      iRoleId,
      vPassword,
      vEmail,
      vPhone,
      vTitle,
      iStatus
    } = req.body

    IsNull(vEmail) && apiResponse.errors.push('Email is required')
    IsNull(iOrganizationId) &&
      apiResponse.errors.push('Organization is required')

    const userCount = await dbUsers.countUsersByOrgId(iOrganizationId)

    if (IsNull(userCount)) {
      apiResponse.message = 'Users not found in this organization'
      return res.status(400).json(apiResponse)
    }

    const subPlan = await dbSubscriptionTransaction.countUserLimit(
      iOrganizationId
    )

    if (IsNull(subPlan)) {
      apiResponse.message = 'Something went wrong'
      return res.status(400).json(apiResponse)
    }

    if (userCount.users >= subPlan.iUserLimit) {
      apiResponse.message =
        'User creation limit has reached. Please upgrade your plan to create more users into your organization'
      return res.status(400).json(apiResponse)
    }

    const user = await dbUsers.findUserByOrgAndEmail(iOrganizationId, vEmail)
    const organization = await dbOrganizations.getOrganization(iOrganizationId)

    if (!IsNull(user)) {
      apiResponse.message = 'User already exists'
      return res.status(422).json(apiResponse)
    }

    if (IsNull(organization)) {
      apiResponse.message = 'Organization not found'
      return res.status(404).json(apiResponse)
    }

    IsNull(vFirstName) && apiResponse.errors.push('First Name is required')
    IsNull(vLastName) && apiResponse.errors.push('Last Name is required')
    IsNull(iRoleId) && apiResponse.errors.push('Role is required')
    IsNull(vPassword) && apiResponse.errors.push('Password is required')
    IsNull(vPhone) && apiResponse.errors.push('Phone number is required')
    IsNull(vTitle) && apiResponse.errors.push('Title is required')
    IsNull(iStatus) && apiResponse.errors.push('Status is required')

    if (apiResponse.errors.length > 0) {
      return res.status(422).json(apiResponse)
    }

    const data = {
      vFirstName,
      vLastName,
      iOrganizationId,
      iRoleId,
      vPassword,
      vEmail,
      vPhone,
      vTitle,
      iStatus,
      vUserName: vEmail.split('@')[0]
    }

    const hashPass = await bcrypt.hash(data.vPassword, 10)
    data.vPassword = hashPass
    const createdUser = await dbUsers.createUser(data)
    if (!createdUser) {
      apiResponse.message = 'Could not create user'
      return res.status(500).json(apiResponse)
    }

    apiResponse.message = 'User created successfully'
    apiResponse.data.createdUser = createdUser.insertId
    res.status(200).json(apiResponse).end()
    await mailHelper.sendOrgUserRegistrationMail(vEmail, organization.vOrganizationName, vEmail, vPassword)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Get customer
module.exports.getCustomer = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { id } = req.user
    const { iOrganizationId, iUserId } = req.params

    const user = await dbUsers.findUserByOrg(id, iOrganizationId)

    if (IsNull(user)) {
      apiResponse.message = 'User not found'
      return res.status(400).json(apiResponse)
    }

    const customer = await dbCustomers.getCustomerById(iUserId, iOrganizationId)
    if (IsNull(customer)) {
      apiResponse.message = 'Customer not found'
      return res.status(apiResponse)
    }
    delete customer.vPassword
    apiResponse.data.customer = customer
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Update customer
module.exports.updateCustomer = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const {
      vFirstName,
      vLastName,
      iOrganizationId,
      iRoleId,
      vEmail,
      vPhone,
      vTitle,
      iStatus
    } = req.body
    const { iUserId } = req.params
    const data = {}

    if (IsNull(iOrganizationId)) {
      apiResponse.message = 'Organization Id is required'
      return res.status(422).json(apiResponse)
    }

    const user = await dbUsers.findUserByOrg(iUserId, iOrganizationId)

    if (IsNull(user)) {
      apiResponse.message = 'User not found'
      return res.status(404).json(apiResponse)
    }

    if (!IsNull(vFirstName)) {
      data.vFirstName = vFirstName
    }

    if (!IsNull(vLastName)) {
      data.vLastName = vLastName
    }

    if (!IsNull(iRoleId)) {
      data.iRoleId = iRoleId
    }

    if (!IsNull(vEmail)) {
      data.vEmail = vEmail
    }

    if (!IsNull(vPhone)) {
      data.vPhone = vPhone
    }

    if (!IsNull(vTitle)) {
      data.vTitle = vTitle
    }

    if (!IsNull(iStatus)) {
      data.iStatus = iStatus
    }

    const updatedUser = await dbCustomers.updateCustomer(
      data,
      iUserId,
      iOrganizationId
    )

    if (updatedUser.affectedRows === 0) {
      apiResponse.message = 'Could not update user'
      return res.status(500).json(apiResponse)
    }
    apiResponse.message = 'User updated successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// delete user
module.exports.deleteCustomer = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iOrganizationId } = req.params
    const { iUserId } = req.query

    const user = await dbUsers.findUserByOrg(iUserId, iOrganizationId)
    const profile = await dbUsers.getProfile(iUserId)
    if (profile) {
      if (profile.vRoleName === 'Subscriber') {
        apiResponse.message = 'Can not delete subscriber'
        return res.status(400).json(apiResponse)
      }
    }

    if (IsNull(user)) {
      apiResponse.message = 'User not found'
      return res.status(400).json(apiResponse)
    }

    const deletedCustomer = await dbCustomers.deleteCustomer(
      iUserId,
      iOrganizationId
    )
    if (!deletedCustomer.affectedRows) {
      apiResponse.message = 'Could not delete customer'
      return res.status(422).json(apiResponse)
    }
    apiResponse.message = 'Customer deleted successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
