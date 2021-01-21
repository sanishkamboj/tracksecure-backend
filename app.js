/* eslint-disable no-console */
require('dotenv').config()
const compression = require('compression')
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')

// middlewares
const cors = require('./middlewares/cors.middleware')

// routes
const routes = require('./routes/index.routes')

const app = express()

app.options('*', cors)

app
  .use(helmet())
  .use(compression({ level: 9 }))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(morgan('dev'))
  .use(cors)

app.use('/public', express.static('public'))
app.use('/api', routes)

app.use((_req, res) =>
  res.status(404).json({ msg: 'Route Not Found', data: null, errors: null })
)

if (app.get('env') === 'development') {
  app.use((err, _req, res) => res.status(500).json({ error: err }))
}

if (app.get('env') === 'production') {
  app.use((_err, _req, res) =>
    res.status(500).json({ error: 'Something Went Wrong' })
  )
}

module.exports = app
