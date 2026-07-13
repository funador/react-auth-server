# React Social Authentication Server

![React Social Auth](https://i.imgur.com/acA83LR.gif)

Server half of a decoupled OAuth setup for React: the client opens a popup for whichever provider the user picks, this server does the actual OAuth dance (keeping the provider secrets private, off the client), and pushes the authenticated profile back to the client over a socket instead of a redirect. Written in TypeScript.

## Demo

[Live demo](https://react-multi-auth.vercel.app)

## Medium posts that detail this repo
* [Twitter, Google, Facebook, Github version on Codeburst](https://medium.com/p/862d59583105)
* [Twitter only version on ITNEXT](https://medium.com/p/2f6b7b0ee9d2) (use the 'twitter-auth' branch)

## Getting Started

```shell
git clone https://github.com/funador/react-auth-server.git
cd react-auth-server
npm i && npm run dev
```

### Because of Facebook, HTTPS is required locally

Facebook requires every app talking to its API — including apps in development — to be served over HTTPS. Locally that means generating a self-signed cert:

To add HTTPS to localhost, [follow these instructions](https://medium.freecodecamp.org/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec) and drop the resulting files at `certs/server.key` / `certs/server.crt`. You'll also need to manually trust that cert in your browser (open `https://localhost:8080` directly once and accept the warning) before the client's popup requests will go through.

If you only want Twitter authentication (no HTTPS hassle), use [the twitter-auth branch](https://github.com/funador/react-auth-client/tree/twitter-auth) instead.

### Setting up your .env file

```shell
touch .env
```

You'll need a key/secret pair from each provider you want to support, plus a session secret and a Redis connection string (sessions are stored in Redis rather than in memory so login still works across serverless instances):

```shell
# server/.env
TWITTER_KEY=
TWITTER_SECRET=
GOOGLE_KEY=
GOOGLE_SECRET=
FACEBOOK_KEY=
FACEBOOK_SECRET=
GITHUB_KEY=
GITHUB_SECRET=
SESSION_SECRET=
REDIS_URL=
```

Where to get each provider's keys:
* **Twitter/X** — [developer portal](https://developer.x.com), enable "Sign in with X" on the app, use the OAuth 1.0a consumer key/secret
* **Google** — [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create an OAuth client ID (Web application)
* **Facebook** — [Meta for Developers](https://developers.facebook.com/apps/creation/), add the Facebook Login product
* **GitHub** — [Developer settings → OAuth Apps](https://github.com/settings/developers)

Add `https://localhost:8080/<provider>/callback` as the callback/redirect URI in each provider's app settings for local dev, and `https://react-multi-auth-server.vercel.app/<provider>/callback` for the deployed demo.

### Deploy

Deployed on Vercel. Provide the same env vars above as project environment variables, and add the production callback URL to each provider's app settings.

### Client

Please follow the instructions [for setting up the client repo](https://github.com/funador/react-auth-client).

### Issues

Something not working? Please [open an issue](https://github.com/funador/react-auth-server/issues) or submit a PR.
