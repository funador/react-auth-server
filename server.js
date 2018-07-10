require('dotenv').config()
const express = require('express')
const http = require('http')
const passport = require('passport')
const session = require('express-session')
const cors = require('cors')
const socketio = require('socket.io')
const { Strategy: TwitterStrategy } = require('passport-twitter')
const { SESSION_SECRET, CLIENT_ORIGIN, TWITTER_CONFIG } = require('./config')

const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(passport.initialize())

app.use(cors({
  origin: CLIENT_ORIGIN
})) 

app.use(session({ 
  secret: process.env.SESSION_SECRET, 
  resave: true, 
  saveUninitialized: true 
}))

const io = socketio(server)

io.sockets.on('connection', socket => {
  socket.on('auth', auth => {   
    socket.join(auth)
  })
})

passport.serializeUser((user, cb) => cb(null, user))
passport.deserializeUser((obj, cb) => cb(null, obj))

passport.use(new TwitterStrategy(
  TWITTER_CONFIG, 
  (accessToken, refreshToken, profile, cb) => {
    // save to db right here
    const user = { 
        name: profile.username,
        photo: profile.photos[0].value.replace(/_normal/, '')
    }
    cb(null, user)
  }))

const twitterAuth = passport.authenticate('twitter')

app.get('/wake-up-heroku', (req, res) => res.end())

app.get('/twitter', twitterAuth)

app.get('/twitter/callback', twitterAuth, (req, res) => {
  io.in('auth').emit('user', req.user)
  res.end()
})

server.listen(process.env.PORT || 8080, () => {
  console.log('listening...')
})