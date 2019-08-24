import { jsonFetch } from 'util'

const API_ENDPOINT = 'https://api.spotify.com/v1/'

export class Song {
  constructor (uri, timestamp, api, accessToken, offset = 0) {
    this.access_token = accessToken
    this.api = api
    this.uri = uri
    this.offset = offset
    this.timestamp = timestamp
  }

  get timestamp () { return this.timestamp }
  get api () { return this.api }
  get uri () { return this.uri }
  get offset () { return this.offset }

  play () {
    let url = `${API_ENDPOINT}/me/player/play`
    let body = JSON.stringify({
      'context_uri': this.uri,
      'offset': {
        'position': this.offset
      },
      'position_ms': this.timestamp
    })
    jsonFetch(url, this.access_token, 'PUT', body).then(data =>
      console.log(data)
    )
  }
}

export class User {
  constructor (accessToken, userID) {
    this.access_token = accessToken
    this.user_id = userID
    this.song = null
    this.getProfile()
  }

  getProfile () {
    let url = `${API_ENDPOINT}/me`
    jsonFetch(url, this.access_token).then(data => {
      this.username = data.display_name
      this.profile = data.spotify
      this.image = data.images[0].url
    })
      .catch(err => {
        console.error(err)
        window.alert('could not retrieve profile information')
      })
  }

  getCurrentSong () {
    let url = `${API_ENDPOINT}/player`
    jsonFetch(url, this.access_token).then(data => {
      this.device = data.device.id
      this.song = Song(data.context.uri,
        parseInt(data.progress_ms),
        data.context.href,
        this.access_token)
    })
      .catch(err => {
        console.error(err)
        window.alert('could not retrieve current song')
      })
  }

  get username () { return this.username }
  get profile () { return this.profile }
  get image () { return this.image }
  get song () { return this.song }
  set song (song) { this.song = song }
}
