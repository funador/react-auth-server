import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import http from 'http'
import https from 'https'
import express, { Request, Response } from 'express'
import passport from 'passport'
import session from 'express-session'
import { RedisStore } from 'connect-redis'
import { createClient } from 'redis'
import { createAdapter } from '@socket.io/redis-adapter'
import cors from 'cors'
import { Server as SocketServer } from 'socket.io'
import authRouter from './lib/auth.router'
import passportInit from './lib/passport.init'
import { SESSION_SECRET, REDIS_URL, CLIENT_ORIGIN } from './config'

const app = express()
let server: http.Server | https.Server

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
  origin: CLIENT_ORIGIN
}))

// Sessions live in Redis instead of the default in-memory store so they
// survive across serverless instances - passport-twitter's OAuth1
// request-token dance (and our own socketId hand-off below) both depend
// on the session set during the /twitter request still being there when
// the provider redirects back to /twitter/callback, which may land on a
// different instance
const redisClient = createClient({ url: REDIS_URL })
redisClient.on('error', err => console.error('Redis error', err))
redisClient.connect().catch(err => console.error('Redis connection failed', err))

// saveUninitialized: true allows us to attach the socket id to the session
// before we have athenticated the user
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))

// Connecting sockets to the server and adding them to the request
// so that we can access them later in the controller
//
// A single websocket connection is pinned to whichever Vercel Function
// instance accepted it, but the HTTP request that later needs to emit
// back to it (the OAuth callback) can land on a different instance
// entirely - io.to(socketId).emit(...) would silently go nowhere in
// that case. The Redis adapter makes every instance publish/subscribe
// through Redis instead of relying on its own in-memory socket table,
// so an emit reaches the right client no matter which instance handles
// which request
const io = new SocketServer(server)
const pubClient = redisClient.duplicate()
const subClient = redisClient.duplicate()
Promise.all([pubClient.connect(), subClient.connect()])
  .then(() => io.adapter(createAdapter(pubClient, subClient)))
  .catch(err => console.error('Redis adapter connection failed', err))
app.set('io', io)

// Catch a start up request so that a sleepy instance can
// be responsive as soon as possible
app.get('/wake-up', (req: Request, res: Response) => res.send('👍'))

// Direct other requests to the auth router
app.use('/', authRouter)

export default server
if (require.main === module) {
  server.listen(process.env.PORT || 8080, () => {
    console.log('listening...')
  })
}
