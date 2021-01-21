const fs = require('fs')
var json2xls = require('json2xls')

module.exports.index = (req, res) => {
  return res.status(200).json({ msg: 'ok' })
}

module.exports.test = async (req, res) => {
  try {
    var json = {
      foo: 'bar',
      qux: 'moo',
      poo: 123,
      stux: new Date()
    }

    // export only the field 'poo'
    var xls = json2xls(json)
    const buffer = Buffer.from(xls, 'binary')
    res.status(200).send(buffer)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}
