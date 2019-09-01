import { User } from '../model/spotify.js'
import { getCookie, setCookie } from '../util.js'

var now = Date.now()
var accessToken = null

let hashes = window.location.hash.substring(1)
let params = {}
if (hashes) {
  hashes.split('&').map(hash => {
    let [key, val] = hash.split('=')
    params[key] = decodeURIComponent(val)
  })

  if (getCookie('state') !== params['state']) {
    window.alert(`state does not match ${getCookie('state')} != ${params['state']}`)
  } else {
    let exDate = new Date(now + parseInt(params['expires_in']) * 1000)
    setCookie('access_token', params['access_token'], 1)
    setCookie('expiration_date', exDate, 1)
    window.history.pushState('', document.title, window.location.pathname)
  }
}

export const checkToken = () => {
  console.log('checking if access token is still valid...')
  let exDate = new Date(getCookie('expiration_date'))
  accessToken = getCookie('access_token')
  if (!accessToken) {
    console.log('...you don\'t have a token, please login.')
    return // user has never logged in
  }
  // check if access token is longer valid than 10 min
  if (exDate - now < 10 * 60 * 1000) {
    // refresh token
    window.location.assign('/auth/login')
  }
  console.log('...success, token is still valid.')
}

checkToken()
export var activeUser = new User(accessToken, getCookie('user_id'))
