/* eslint-disable no-console */
require('dotenv').config()
const fs = require('fs');
const https = require('https');
const app = require('./app')

const privateKey = fs.readFileSync("secure.tracksecureapp.key");
const certificate = fs.readFileSync("secure.tracksecureapp.com.crt")
const cs = fs.readFileSync("secure.intermediate.crt")
var credentials = { key: privateKey, cert: certificate, ca: cs };

const httpsServer = https.createServer(credentials, app)
// const server = http.createServer(app)

const normalizePort = (val) => {
  const port = parseInt(val, 10)
  if (port >= 0) {
    return port
  }
  return false
}

const port = normalizePort(process.env.PORT || '4000')

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`)
      process.exit(1)
    default:
      throw error
  }
}

const onListening = () => {
  const addr = httpsServer.address()
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
  console.log(`Listening on ${bind}`)
}

app.set('port', port)

// server.listen(port, '192.168.32.116') // for local
// server.listen(port) // for remote
// server.on('error', onError)
// server.on('listening', onListening)

httpsServer.listen(port);
httpsServer.on('error', onError);
httpsServer.on('listening', onListening);
console.log(`https api listening on port: ${port}.`);

