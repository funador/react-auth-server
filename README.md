# React Social Authentication Server

## Getting Started

```
git clone https://github.com/funador/react-auth-server.git
cd react-auth-server
npm i && npm run dev
```

If you only want to use Facebook/Github/GoogleTwitter authentication, follow the instructions in [this branch](https://github.com/funador/react-auth-client)

## Setting up your .env file
```
touch .env
// open .env and add values for: TWITTER_KEY, TWITTER_SECRET, SESSION_SECRET
// You get the key and secret from registering an app at http://apps.twitter.com)
// Make sure you have added 'https://127.0.0.1:8080/twitter/callback'
// in your callback settings on http://apps.twitter.com
npm run dev
```

#### Deploy
Everything is set up to deploy to Heroku, you just need to plug in the environment variables for twitter.

### Client
Please follow the instructions [for setting up the client repo](https://github.com/funador/react-auth-client/tree/twitter-auth)

### Issues
Something not working?  Please [open an issue](https://github.com/funador/react-auth-server/issues)