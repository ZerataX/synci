import { jsonFetch, NoResponseBody } from '../util.js'

const API_ENDPOINT = 'https://api.spotify.com/v1'

export class Song {
  constructor (time, duration, uri, href, name, image, artist, accessToken, context=null) {
    this._access_token = accessToken
    this._href = href
    this._uri = uri
    this._duration = duration
    this._time = time
    this._name = name
    this._image = image
    this._artist = artist
    this._context = context
    this._timestamp = Date.now()
  }

  get time () { return this._time }
  get duration () { return this._duration }
  get href () { return this._href }
  get uri () { return this._uri }
  get name () { return this._name }
  get image () { return this._image }
  get artist () { return this._artist }
  get context () { return this._context }

  play () {
    const url = `${API_ENDPOINT}/me/player/play`
    const body = JSON.stringify({
      uris: [this._uri],
      position_ms: this._time
    })
    jsonFetch(url, this._access_token, 'PUT', body).catch(err => {
      if (!(err instanceof NoResponseBody)) {
        console.error(err)
        window.alert('could not play song')
      }
    })
  }

  increaseTime () {
    const diff = Date.now() - this._timestamp
    const time = this._time + diff

    this._timestamp = Date.now()
    if (time < this._duration) {
      this._time = time
    }
  }
}

export class User {
  constructor (accessToken, userID) {
    this._access_token = accessToken
    this._user_id = userID
    this._logged_in = (this._access_token) ? this.getProfile() : false
  }

  async getProfile () {
    const url = `${API_ENDPOINT}/me`
    await jsonFetch(url, this._access_token).then(data => {
      this._username = data.display_name
      this._link = data.external_urls.spotify
      this._image = (data.images.length) ? data.images[0].url : null
    }).catch(err => {
      console.error(err)
      window.alert('could not retrieve profile information')
    })
  }

  async getCurrentSong () {
    const url = `${API_ENDPOINT}/me/player`
    await jsonFetch(url, this._access_token).then(data => {
      this._device = data.device.id
      this._song = new Song(
        parseInt(data.progress_ms),
        parseInt(data.item.duration_ms),
        data.item.uri,
        data.item.href,
        data.item.name,
        (data.item.album.images.length) ? data.item.album.images[0].url : null,
        data.item.artists.map(artist => artist.name).join(', '),
        this._access_token,
        data.context
      )
      return true
    }).catch(err => {
      if (err instanceof NoResponseBody) {
        console.log('no song playing')
      } else {
        console.error(err)
        window.alert('could not retrieve current song')
      }
      return false
    })
  }

  get username () { return this._username }
  get userID () { return this._user_id }
  get loggedIn () { return this._logged_in }
  get link () { return this._link }
  get image () { return this._image }
  get song () { return this._song }
  set song (song) { this._song = song }
  get accessToken () { return this._access_token }
}
