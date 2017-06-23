const path = require('path')


const ENVS = path.join(__dirname, 'envvars')

require('dotenv').config({ path: ENVS })

const Chewb = require('chewb-server')
const ChewbPassport = require('chewb-passport')
let server = new Chewb(ENVS)

const Peer = require('./peer')

let strats = [{
  name: 'facebook',
  clientId: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  authUrl: '/login/facebook',
  redirectUrl: '/login/facebook/return',
  callbackUrl: `http://localhost:${process.env.EXPRESS_PORT}/login/facebook/success`
}, {
  name: 'instagram',
  scope: ['public_content'],
  clientId: process.env.INSTAGRAM_ID,
  clientSecret: process.env.INSTAGRAM_SECRET,
  authUrl: '/login/instagram',
  redirectUrl: '/login/instagram/return',
  callbackUrl: `http://localhost:${process.env.EXPRESS_PORT}/login/instagram/success`
}, {
  name: 'youtube',
  scope: [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtubepartner",
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.force-ssl'
  ],
  clientId: process.env.YOUTUBE_ID,
  clientSecret: process.env.YOUTUBE_SECRET,
  authUrl: '/login/youtube',
  redirectUrl: '/login/youtube/return',
  callbackUrl: `http://localhost:${process.env.EXPRESS_PORT}/login/youtube/success`
}]

let chewbPassport = new ChewbPassport(
  server.app,
  strats, {
    host: `http://${server.host}:${server.port}/`,
    baseRoute: '',
    logOut: true
  })

const peer = Peer(server.app, server.server, server.io)