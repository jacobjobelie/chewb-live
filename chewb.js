const path = require('path')
const Chewb = require('@samelie/chewb')
const ChewbPassport = require('@samelie/chewb-passport')
let server = new Chewb(path.join(__dirname, 'envvars'))

let strats = [{
  name: 'facebook',
  clientId: '1656736837874441',
  clientSecret: 'f9da079389ba1b0aef80dc978c632958',
  authUrl: '/login/facebook',
  redirectUrl: '/login/facebook/return',
  callbackUrl: 'http://localhost:8081/login/facebook/success'
}, {
  name: 'instagram',
  scope: ['public_content'],
  clientId: 'c82f60355b9d42869a65bad4e0753fdc',
  clientSecret: '7ac9fac8b09b4634af1720e05d376a75',
  authUrl: '/login/instagram',
  redirectUrl: '/login/instagram/return',
  callbackUrl: 'http://localhost:8081/login/instagram/success'
}, {
  name: 'youtube',
  scope: [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.force-ssl'
  ],
  clientId: '390854965946-u8n4jeabn19qk9dvn6ofpdkfdvmrid2c.apps.googleusercontent.com',
  clientSecret: '4WmOui4rln4K8hQssMdjki52',
  authUrl: '/login/youtube',
  redirectUrl: '/login/youtube/return',
  callbackUrl: 'http://localhost:8081/login/youtube/success'
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
