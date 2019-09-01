import { User } from '../model/spotify.js'
import { getCookie, setCookie } from '../util.js'

var now = Date.now()
var accessToken = null

const hashes = window.location.hash.substring(1)
const params = {}
if (hashes) {
  hashes.split('&').map(hash => {
    const [key, val] = hash.split('=')
    params[key] = decodeURIComponent(val)
  })

  if (getCookie('state') !== params.state) {
    window.alert(`state does not match ${getCookie('state')} != ${params.state}`)
  } else {
    const exDate = new Date(now + parseInt(params.expires_in) * 1000)
    setCookie('access_token', params.access_token, 1)
    setCookie('expiration_date', exDate, 1)
    window.history.pushState('', document.title, window.location.pathname)
  }
}

export const checkToken = () => {
  console.debug('checking if access token is still valid...')
  const exDate = new Date(getCookie('expiration_date'))
  accessToken = getCookie('access_token')
  if (!accessToken) {
    console.log('...you don\'t have a token, please login.')
    return // user has never logged in
  }
  // check if access token is longer valid than 10 min
  if (exDate - now < 10 * 60 * 1000) {
    // refresh token
    setCookie('last_page', window.location.href, 1)
    window.location.assign('/auth/login')
  }
  console.debug('...success, token is still valid.')
}

checkToken()
export var activeUser = new User(accessToken, getCookie('user_id'))
