const bcrypt = require('bcryptjs')

// helpers
const mailHelper = require('../../helpers/nodemailer/mail.helper')

// db queries
const dbUsers = require('../../database/user/users.queries')
const dbCustomers = require('../../database/admin/customers.queries')
const dbOrganizations = require('../../database/admin/organization_mas.queries')
const dbRoles = require('../../database/admin/role_mas.queries')

// Utils
const ApiResponse = require('../../utils/ApiResponse')
const isNull = require('../../utils/isNull')

// List customers
module.exports.listCustomers = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iOrganizationId } = req.query
    const customers = await dbCustomers.listCustomers(iOrganizationId)
    const organizations = await dbOrganizations.listOrganizations()
    const roles = await dbRoles.listRoles()

    customers.forEach((customer) => {
      const org = organizations.find(
        (org) => org.iOrganizationId === customer.iOrganizationId
      )
      customer.organization = org

      const role = roles.find((role) => role.iRoleId === customer.iRoleId)
      customer.role = role
    })

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

// Get customer
module.exports.getCustomer = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iUserId } = req.params

    if (!iUserId) {
      apiResponse.errors.push('User id is required')
    }

    if (apiResponse.errors.length > 0) {
      return res.status(422).json(apiResponse)
    }

    const customer = await dbCustomers.getCustomerById(iUserId)

    if (!customer) {
      apiResponse.message = 'Customer not found'
      return res.status(404).json(apiResponse)
    }

    const organizations = await dbOrganizations.listOrganizations()
    const roles = await dbRoles.listRoles()

    const orgs = organizations.find(
      (org) => org.iOrganizationId === customer.iOrganizationId
    )
    customer.organization = orgs

    const role = roles.find((role) => role.iRoleId === customer.iRoleId)
    customer.role = role

    delete customer.vPassword
    apiResponse.data.customer = customer
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

    if (!vEmail) {
      apiResponse.errors.push('Email is required')
    }

    const customer = await dbCustomers.getCustomerByEmail(vEmail)
    const organization = await dbOrganizations.getOrganization(iOrganizationId)
    if (customer) {
      apiResponse.message = 'Customer already exists'
      return res.status(422).json(apiResponse)
    }

    if (isNull(organization)) {
      apiResponse.message = 'Organization not found'
      return res.status(404).json(apiResponse)
    }

    if (!vFirstName) {
      apiResponse.errors.push('First Name is required')
    }

    if (!vLastName) {
      apiResponse.errors.push('Last Name is required')
    }

    if (!iOrganizationId) {
      apiResponse.errors.push('Organization is required')
    }

    if (!iRoleId) {
      apiResponse.errors.push('Role is required')
    }

    if (!vPassword) {
      apiResponse.errors.push('Password is required')
    }

    if (!vPhone) {
      apiResponse.errors.push('Phone number is required')
    }

    if (!vTitle) {
      apiResponse.errors.push('Title is required')
    }

    if (iStatus === null) {
      apiResponse.errors.push('Status is required')
    }

    if (apiResponse.errors.length > 0) {
      return res.status(422).json(apiResponse)
    }

    const vUserName = vEmail.split('@')[0]

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
      vUserName
    }

    const hashPass = await bcrypt.hash(data.vPassword, 10)
    data.vPassword = hashPass
    const createdCustomer = await dbCustomers.createCustomer(data)
    if (!createdCustomer) {
      apiResponse.message = 'Could not create customer'
      return res.status(500).json(apiResponse)
    }

    apiResponse.message = 'Customer created successfully'
    apiResponse.data.createdCustomer = createdCustomer.insertId
    res.status(200).json(apiResponse).end()
    await mailHelper.sendOrgUserRegistrationMail(vEmail, organization.vOrganizationName, vEmail, vPassword)
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

    const { iCustomerId } = req.params

    const data = {}

    if (vFirstName) {
      data.vFirstName = vFirstName
    }

    if (vLastName) {
      data.vLastName = vLastName
    }

    if (iOrganizationId) {
      data.iOrganizationId = iOrganizationId
    }

    if (iRoleId) {
      data.iRoleId = iRoleId
    }

    if (vEmail) {
      data.vEmail = vEmail
    }

    if (vPhone) {
      data.vPhone = vPhone
    }

    if (vTitle) {
      data.vTitle = vTitle
    }

    if (iStatus !== undefined) {
      data.iStatus = iStatus
    }

    const updatedCustomer = await dbCustomers.updateCustomer(data, iCustomerId)

    if (!updatedCustomer.affectedRows) {
      apiResponse.message = 'Could not update customer'
      return res.status(500).json(apiResponse)
    }
    apiResponse.message = 'Customer updated successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Toggle 2FA
module.exports.toggle2fa = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iUserId } = req.params
    const { toggle2FA } = req.query
    let status = 0
    if (toggle2FA === '1') {
      status = 1
    }

    const toggle = await dbCustomers.updateCustomer({ i2FA: status }, iUserId)
    if (!toggle.affectedRows) {
      let message = 'Could not disable 2 Factor Authentication'
      if (status === 1) {
        message = 'Could not enable 2 Factor Authentication'
      }
      apiResponse.message = message
      return res.status(500).json(apiResponse)
    }
    let message = '2 Factor Authentication is disabled successfully'
    if (status === 1) {
      message = '2 Factor Authentication is enabled successfully'
    }
    apiResponse.message = message
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Delete customer
module.exports.deleteCustomer = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iUserId } = req.params
    const { isAdmin } = req.user
    const profile = await dbUsers.getProfile(iUserId)
    if (profile) {
      if (profile.vRoleName === 'Subscriber' && !isAdmin) {
        apiResponse.message = 'Can not delete subscriber'
        return res.status(400).json(apiResponse)
      }
    }
    const deletedCustomer = await dbCustomers.deleteCustomer(iUserId)
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
