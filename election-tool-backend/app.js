const express = require('express')
const app = express()

const { host, port, dbPath } = require('./config')

app.use(express.json())

app.use((_, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true)

  next()
})

const server = app.listen(port, host, () => {
  console.log('server listening on port', port)
})

// ---------------- import the database connection ----------------
const db = require('./db')

const { connection, mongoose } = db
connection.on('error', (err) => {
  console.error('connection error:', err)
})
mongoose.connect(dbPath, () => {
  console.log('connected to database')
})

// ---------------- import the socketIO messages ----------------
const io = require('socket.io')(server)
const socket = require('./socket')

socket(io)

// ---------------- import the routes ----------------
const routes = require('./routes')

routes(app, db)
