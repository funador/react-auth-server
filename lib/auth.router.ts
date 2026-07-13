import express, { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import * as authController from './auth.controller'

const router = express.Router()

// Setting up the passport middleware for each of the OAuth providers
const twitterAuth = passport.authenticate('twitter')
const googleAuth = passport.authenticate('google', { scope: ['profile'] })
const facebookAuth = passport.authenticate('facebook')
const githubAuth = passport.authenticate('github')

// Routes that are triggered by the callbacks from each OAuth provider once
// the user has authenticated successfully
router.get('/twitter/callback', twitterAuth, authController.twitter)
router.get('/google/callback', googleAuth, authController.google)
router.get('/facebook/callback', facebookAuth, authController.facebook)
router.get('/github/callback', githubAuth, authController.github)

// This custom middleware allows us to attach the socket id to the session
// With that socket id we can send back the right user info to the right
// socket
router.use((req: Request, res: Response, next: NextFunction) => {
  req.session.socketId = req.query.socketId as string
  next()
})

// Routes that are triggered on the client
router.get('/twitter', twitterAuth)
router.get('/google', googleAuth)
router.get('/facebook', facebookAuth)
router.get('/github', githubAuth)

export default router
