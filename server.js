require('dotenv').config()
const express = require('express')
const http = require('http')
const passport = require('passport')
const session = require('express-session')
const cors = require('cors')
const socketio = require('socket.io')
const { Strategy: TwitterStrategy } = require('passport-twitter')
const { TWITTER_CONFIG } = require('./config')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.json())
app.use(passport.initialize())

app.use(cors({
  origin: 'http://localhost:3000'
})) 

app.use(session({ 
  secret: 'KeyboardKittens', 
  resave: true, 
  saveUninitialized: true 
}))

passport.serializeUser((user, cb) => cb(null, user))
passport.deserializeUser((obj, cb) => cb(null, obj))

passport.use(new TwitterStrategy(
  TWITTER_CONFIG, 
  (accessToken, refreshToken, profile, cb) => {
    // save the user right here if you want
    const user = { 
        name: profile.username,
        photo: profile.photos[0].value.replace(/_normal/, '')
    }
    cb(null, user)
  })
)

const addSocketIdToSession = (req, res, next) => {
  req.session.socketId = req.query.socketId
  next()
}

const twitterAuth = passport.authenticate('twitter')

app.get('/twitter', addSocketIdToSession, twitterAuth)

app.get('/twitter/callback', twitterAuth, (req, res) => {
  io.in(req.session.socketId).emit('user', req.user)
  res.end()
})

server.listen(process.env.PORT || 8080, () => {
  console.log('listening...')
})