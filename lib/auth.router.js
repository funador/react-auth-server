const express = require('express')
const router = express.Router()
const passport = require('passport')
const controller = require('./auth.controller')

const googleScope = ['profile', 'email']
const fbScope = ['email']
const twitterAuth = passport.authenticate('twitter')
const googleAuth = passport.authenticate('google', { scope: googleScope })
const facebookAuth = passport.authenticate('facebook', { scope: fbScope })
const githubAuth = passport.authenticate('github')

router.get('/twitter', twitterAuth)
router.get('/google', googleAuth)
router.get('/facebook', facebookAuth)
router.get('/github', githubAuth)

router.get('/twitter/callback', twitterAuth, controller.twitter)
router.get('/google/callback', googleAuth, controller.google)
router.get('/facebook/callback', facebookAuth, controller.facebook)
router.get('/github/callback', githubAuth, controller.github)

module.exports = router