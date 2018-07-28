const { Strategy: TwitterStrategy } = require('passport-twitter')
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth')
const { Strategy: FacebookStrategy } = require('passport-facebook')
const { Strategy: GithubStrategy} = require('passport-github')
const { 
  TWITTER_CONFIG, GOOGLE_CONFIG, FACEBOOK_CONFIG, GITHUB_CONFIG
} = require('../config')

module.exports = passport => {  
  passport.serializeUser((user, cb) => cb(null, user))
  passport.deserializeUser((obj, cb) => cb(null, obj))
  
  const callback = (accessToken, refreshToken, profile, cb) => cb(null, profile)

  passport.use(new TwitterStrategy(TWITTER_CONFIG, callback))
  passport.use(new GoogleStrategy(GOOGLE_CONFIG, callback))
  passport.use(new FacebookStrategy(FACEBOOK_CONFIG, callback))
  passport.use(new GithubStrategy(GITHUB_CONFIG, callback))
}