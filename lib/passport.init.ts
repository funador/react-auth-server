import passport from 'passport'
import { Strategy as TwitterStrategy } from 'passport-twitter'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Strategy as GithubStrategy } from 'passport-github2'
import {
  TWITTER_CONFIG, GOOGLE_CONFIG, FACEBOOK_CONFIG, GITHUB_CONFIG
} from '../config'

export default () => {

  // Allowing passport to serialize and deserialize users into sessions
  passport.serializeUser((user, cb) => cb(null, user as Express.User))
  passport.deserializeUser((obj, cb) => cb(null, obj as Express.User))

  // The callback that is invoked when an OAuth provider sends back user
  // information. Normally, you would save the user to the database
  // in this callback and it would be customized for each provider
  const callback = (
    accessToken: string,
    refreshToken: string,
    profile: passport.Profile,
    cb: (err: unknown, user?: Express.User) => void
  ) => cb(null, profile as Express.User)

  // Adding each OAuth provider's strategy to passport. Each strategy's
  // constructor throws synchronously if its key/secret are missing, which
  // would otherwise take down every provider (not just the unconfigured
  // one) since this all runs at module load - so only register a provider
  // once its credentials are actually present
  if (TWITTER_CONFIG.consumerKey && TWITTER_CONFIG.consumerSecret) {
    passport.use(new TwitterStrategy(TWITTER_CONFIG, callback))
  }
  if (GOOGLE_CONFIG.clientID && GOOGLE_CONFIG.clientSecret) {
    passport.use(new GoogleStrategy(GOOGLE_CONFIG, callback))
  }
  if (FACEBOOK_CONFIG.clientID && FACEBOOK_CONFIG.clientSecret) {
    passport.use(new FacebookStrategy(FACEBOOK_CONFIG, callback))
  }
  if (GITHUB_CONFIG.clientID && GITHUB_CONFIG.clientSecret) {
    passport.use(new GithubStrategy(GITHUB_CONFIG, callback))
  }
}
