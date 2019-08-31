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
    let exDate = new Date(now + params['expires_in'] * 1000)
    setCookie('access_token', params['access_token'], 1)
    setCookie('expiration_date', exDate, 1)
  }
}

const checkToken = () => {
  console.log('checking if access token is still valid...')
  let exDate = new Date(getCookie('expiration_date'))
  accessToken = getCookie('access_token')
  if (accessToken === null) {
    return // user has never logged in
  }
  // check if access token is longer valid than 10 min
  if (!accessToken || exDate - now < 10 * 60 * 1000) {
    window.location.assign('auth/login')
  }
  console.log('...success, token is still valid.')
}

(function () {
  checkToken()
  setTimeout(checkToken, 60 * 1000)
})()

export var activeUser = new User(accessToken, getCookie('user_id'))
