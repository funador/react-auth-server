const express = require('express')
const router = express.Router()
const passport = require('passport')
const authController = require('./auth.controller')

// Setting up the passport middleware for each of the OAuth providers
const twitterAuth = passport.authenticate('twitter')
const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] })
const facebookAuth = passport.authenticate('facebook')
const githubAuth = passport.authenticate('github')
const jwtAuth = passport.authenticate('jwt', {session: false})

// Routes that are triggered by the callbacks from each OAuth provider once 
// the user has authenticated successfully
router.get('/twitter/callback', twitterAuth, authController.twitter)
router.get('/google/callback', googleAuth, authController.google)
router.get('/facebook/callback', facebookAuth, authController.facebook)
router.get('/github/callback', githubAuth, authController.github)

// Routes that are triggered on the client by the OAuth process
router.get('/twitter', twitterAuth)
router.get('/google', googleAuth)
router.get('/facebook', facebookAuth)
router.get('/github', githubAuth)

// Refresh and hydrate our user on page load
router.get('/refresh', jwtAuth, authController.refresh)

// Unlink a provider from the user account
router.delete('/unlink/:provider', jwtAuth, authController.unlink)

// Destroy the session when the user logs out
router.get('/logout', jwtAuth, authController.logout)

module.exports = router