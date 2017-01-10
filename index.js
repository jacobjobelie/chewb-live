const path = require('path')
require('dotenv').config({path: path.join(process.cwd(), 'envvars')})
const Chewb = require('@samelie/chewb')
const ChewbPassport = require('@samelie/chewb-passport')
let server = new Chewb(path.join(process.cwd(), 'envvars'))

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
  clientId: process.env.INSRAGRAM_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  authUrl: '/login/instagram',
  redirectUrl: '/login/instagram/return',
  callbackUrl: `http://localhost:${process.env.EXPRESS_PORT}/login/instagram/success`
}, {
  name: 'youtube',
  scope: [
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



/*const Server = function(){
  return server
}

module.exports = Server*/
