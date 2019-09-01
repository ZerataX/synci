import { jsonFetch, NoResponseBody } from '../util.js'

const API_ENDPOINT = 'https://api.spotify.com/v1'

export class Song {
  constructor (uri, timestamp, api, duration, accessToken) {
    this._access_token = accessToken
    this._api = api
    this._uri = uri
    this._duration = duration
    this._timestamp = timestamp
  }

  get timestamp () { return this._timestamp }
  get duration () { return this._duration }
  get api () { return this._api }
  get uri () { return this._uri }
  get offset () { return this._offset }

  play () {
    let url = `${API_ENDPOINT}/me/player/play`
    let body = JSON.stringify({
      'uris': [this._uri],
      'position_ms': this._timestamp
    })
    jsonFetch(url, this._access_token, 'PUT', body).catch(err => {
      if (!(err instanceof NoResponseBody)) {
        console.error(err)
        window.alert('could not play song')
      }
    })
  }
}

export class User {
  constructor (accessToken, userID) {
    this._access_token = accessToken
    this._user_id = userID
    this._logged_in = (this._access_token) ? this.getProfile() : false
  }

  async getProfile () {
    let url = `${API_ENDPOINT}/me`
    await jsonFetch(url, this._access_token).then(data => {
      this._username = data.display_name
      this._link = data.external_urls.spotify
      this._image = (data.images.length) ? data.images[0].url : null
      return true
    }).catch(err => {
      console.error(err)
      window.alert('could not retrieve profile information')
      return false
    })
  }

  async getCurrentSong () {
    let url = `${API_ENDPOINT}/me/player`
    await jsonFetch(url, this._access_token).then(data => {
      this._device = data.device.id
      this._song = new Song(data.item.uri,
        parseInt(data.progress_ms),
        data.item.href,
        parseInt(data.item.duration_ms),
        this._access_token)
    }).catch(err => {
      if (err instanceof NoResponseBody) {
        console.log('no song playing')
      } else {
        console.error(err)
        window.alert('could not retrieve current song')
      }
    })
  }

  get username () { return this._username }
  get userID () { return this._user_id }
  get loggedIn () { return this._logged_in }
  get link () { return this._link }
  get image () { return this._image }
  get song () { return this._song }
  set song (song) { this._song = song }
}
