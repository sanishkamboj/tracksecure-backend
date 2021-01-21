// utils
const ApiResponse = require('../../utils/ApiResponse')
const IsNull = require('../../utils/isNull')

// db queries
const dbSettings = require('../../database/settings/settings.queries')

const getConfigTypes = (settingsArr) => {
  let a = new Set()
  settingsArr.forEach(s => { a.add(s.eConfigType) })
  a = Array.from(a)
  const b = []
  a.forEach(c => {
    const d = {}
    d[c] = []
    b.push(d)
  })
  return b
}

const getFilteredSettings = (settingsArr) => {
  const configTypes = getConfigTypes(settingsArr)
  settingsArr.forEach(s => {
    configTypes.forEach(c => {
      if (Object.prototype.hasOwnProperty.call(c, s.eConfigType)) {
        c[s.eConfigType].push(s)
      }
    })
  })
  return configTypes
}

module.exports.getSettings = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const settingsArr = await dbSettings.getSettings()
    let configTypes = new Set()
    settingsArr.forEach(s => { configTypes.add(s.eConfigType) })
    configTypes = Array.from(configTypes)

    apiResponse.data.settings = getFilteredSettings(settingsArr)
    apiResponse.data.configTypes = configTypes
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
