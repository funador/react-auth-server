require('dotenv').config()
const express = require('express')
const path = require('path')
const fs = require('fs')
const https = require('https')
const http = require('http')
const passport = require('passport')
const session = require('express-session')
const cors = require('cors')
const socketio = require('socket.io')
const mongoose = require('mongoose')
const uuid = require('uuid/v4')
const FileStore = require('session-file-store')(session)
const authRouter = require('./lib/auth.router')
const passportInit = require('./lib/passport.init')
const { DB_URL, PORT, CLIENT_ORIGIN } = require('./config')
const app = express()
let server

// If we are in production we are already running in https
if (process.env.NODE_ENV === 'production') {
  server = http.createServer(app)
}
// We are not in production so load up our certificates to be able to 
// run the server in https mode locally
else {
  const certOptions = {
    key: fs.readFileSync(path.resolve('certs/server.key')),
    cert: fs.readFileSync(path.resolve('certs/server.crt'))
  }
  server = https.createServer(certOptions, app)
}

// Setup for passport and to accept JSON objects
app.use(express.json())
app.use(passport.initialize())
passportInit()

// Accept requests from our client
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
})) 

// saveUninitialized: true allows us to attach the socket id to the session
// before we have athenticated the user
app.use(session({
  genid: req => uuid(),
  store: new FileStore(),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

// This custom middleware allows us to attach the socket id to the session
// With that socket id we can send back the right user info to the right 
// socket
app.use((req, res, next) => {
  if (req.query.socketId) {
    req.session.socketId = req.query.socketId
  }
  next()
})

// Connecting sockets to the server and adding them to the request 
// so that we can access them later in the controller
const io = socketio(server)
app.set('io', io)

// Catch a start up request so that a sleepy Heroku instance can  
// be responsive as soon as possible
app.get('/wake-up', (req, res) => {
  console.log('/wake-up', req.session)
  res.send('👍')
})

// Direct other requests to the auth router
app.use('/', authRouter)

// To get rid of all those semi-annoying Mongoose deprecation warnings.
const options = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false
}

// Connecting the database and then starting the app.
mongoose.connect(DB_URL, options, () => {
  server.listen(PORT, () => console.log('👍'))
})
// The most likely reason connecting the database would error out is because 
// Mongo has not been started in a separate terminal.
.catch(err => console.log(err))
