import { User } from '../model/spotify.js'
import { getCookie, setCookie } from '../util.js'

let now = Date.now

let hashes = window.location.hash
let params = {}
if (hashes) {
  hashes.split('&').map(hash => {
    let [key, val] = hash.split('=')
    key = key.replace('#', '')
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

// probably check this periodically
let exDate = new Date(getCookie('expiration_date'))
let accessToken = getCookie('access_token')
// check if access token is longer valid than 10 min
if (!accessToken || exDate - now < 10 * 60 * 1000) {
  window.location.assign('auth/login')
}
export var activeUser = new User(accessToken, getCookie('user_id'))
