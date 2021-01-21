// utils
const ApiResponse = require('../../utils/ApiResponse')
const IsNull = require('../../utils/isNull')

// helpers
const paysimpleCustomerHelper = require('../../helpers/paysimple/customers.helper')

// List all customers
module.exports.listCustomers = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { lite, page, pagesize, sortby, direction } = req.query
    const queryParams = {}
    if (!IsNull(lite)) queryParams.lite = lite
    if (!IsNull(page)) queryParams.page = page
    if (!IsNull(pagesize)) queryParams.pagesize = pagesize
    if (!IsNull(sortby)) queryParams.sortby = sortby
    if (!IsNull(direction)) queryParams.direction = direction
    const customers = await paysimpleCustomerHelper.listCustomers(queryParams)
    apiResponse.data = customers
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// List payments
module.exports.listPayments = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { customerId } = req.params
    const { sortby, direction, page, pagesize, startdate, enddate, status } = req.query
    const queryParams = {}
    if (!IsNull(sortby)) queryParams.sortby = sortby
    if (!IsNull(direction)) queryParams.direction = direction
    if (!IsNull(page)) queryParams.page = page
    if (!IsNull(pagesize)) queryParams.pagesize = pagesize
    if (!IsNull(startdate)) queryParams.startdate = startdate
    if (!IsNull(enddate)) queryParams.enddate = enddate
    if (!IsNull(status)) queryParams.status = status

    const payments = await paysimpleCustomerHelper.listPayments(customerId, queryParams)
    apiResponse.data = payments
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Get a customer
module.exports.getCustomer = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { customerId } = req.params
    const { listAccounts } = req.query
    if (IsNull(customerId)) {
      apiResponse.message = 'Customer id is not valid'
      return res.status(400).json(apiResponse)
    }
    const customer = await paysimpleCustomerHelper.getCustomer(customerId)
    let accounts = null
    let defaultAccount = null

    if (!IsNull(listAccounts) && listAccounts === 'true') {
      accounts = await paysimpleCustomerHelper.getAccounts(customerId)
      defaultAccount = await paysimpleCustomerHelper.getDefaultAccount(customerId)
    }

    const data = { customer }
    if (!IsNull(accounts)) {
      data.accounts = accounts
    }
    if (!IsNull(defaultAccount)) {
      data.defaultAccount = defaultAccount
    }
    apiResponse.data = data
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Create new customer
module.exports.createCustomer = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { FirstName, LastName, Company, BillingAddress } = req.body

    if (IsNull(FirstName)) apiResponse.errors.push('First name is missing')
    if (IsNull(LastName)) apiResponse.errors.push('Last name is missing')
    if (IsNull(Company)) apiResponse.errors.push('Company name is missing')
    if (IsNull(BillingAddress)) apiResponse.errors.push('Billing Address is missing')
    if (IsNull(BillingAddress.City)) apiResponse.errors.push('City is missing')
    if (IsNull(BillingAddress.Country)) apiResponse.errors.push('Country is missing')
    if (IsNull(BillingAddress.StreetAddress1)) apiResponse.errors.push('Street Address is missing')
    if (IsNull(BillingAddress.ZipCode)) apiResponse.errors.push('Zip code is missing')

    if (apiResponse.errors.length > 0) {
      return res.status(400).json(apiResponse)
    }

    const createdCustomer = await paysimpleCustomerHelper.createCustomer({ FirstName, LastName, Company, BillingAddress })
    apiResponse.data = createdCustomer
    return res.status(201).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Delete a customer
module.exports.deleteCustomer = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { customerId } = req.params
    const deletedCustomer = await paysimpleCustomerHelper.deleteCustomer(customerId)
    apiResponse.data = deletedCustomer
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
