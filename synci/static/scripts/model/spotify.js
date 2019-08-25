import { jsonFetch } from '../util.js'

const API_ENDPOINT = 'https://api.spotify.com/v1'

export class Song {
  constructor (uri, timestamp, api, accessToken, offset = 0) {
    this._access_token = accessToken
    this._api = api
    this._uri = uri
    this._offset = offset
    this._timestamp = timestamp
  }

  get timestamp () { return this._timestamp }
  get api () { return this._api }
  get uri () { return this._uri }
  get offset () { return this._offset }

  play () {
    let url = `${API_ENDPOINT}/me/player/play`
    let body = JSON.stringify({
      'context_uri': this._uri,
      'offset': {
        'position': this._offset
      },
      'position_ms': this._timestamp
    })
    jsonFetch(url, this._access_token, 'PUT', body).then(data =>
      console.log(data)
    )
  }
}

export class User {
  constructor (accessToken, userID) {
    this._access_token = accessToken
    this._user_id = userID
    this.getProfile()
  }

  getProfile () {
    let url = `${API_ENDPOINT}/me`
    jsonFetch(url, this._access_token).then(data => {
      this._username = data.display_name
      this._link = data.external_urls.spotify
      this._image = data.images[0].url
    })
      .catch(err => {
        console.error(err)
        window.alert('could not retrieve profile information')
      })
  }

  getCurrentSong () {
    let url = `${API_ENDPOINT}/player`
    jsonFetch(url, this._access_token).then(data => {
      this._device = data.device.id
      this._song = Song(data.context.uri,
        parseInt(data.progress_ms),
        data.context.href,
        this._access_token)
    })
      .catch(err => {
        console.error(err)
        window.alert('could not retrieve current song')
      })
  }

  get username () { return this._username }
  get link () { return this._link }
  get image () { return this._image }
  get song () { return this._song }
  set song (song) { this._song = song }
}
