import { Song } from './spotify.js'
import { jsonFetch } from '../util.js'

export class Session {
  constructor (name, accessToken) {
    this._name = name
    this._access_token = accessToken
    this._endpoint = `/session/${this._name}/info`
    this.getInfo()
  }

  async getInfo () {
    await jsonFetch(this._endpoint).then(data => {
      this._author = data.author
      this._followers = data.followers
      if ('song' in data) {
        this._song = new Song(data.song, data.timestamp, data.api_url, this._access_token)
      }
    }).catch(err => {
      console.error(err)
      window.alert('could not retrieve session info')
    })
  }

  async setInfo (song, author, followers) {
    let body = JSON.stringify({
      'author': author.userID,
      'followers': followers,
      'timestamp': song.timestamp,
      'song': song.uri,
      'api_url': song.api
    })
    jsonFetch(this._endpoint, null, 'PUT', body).catch(err => {
      console.error(err)
      window.alert('could not update session with current song')
    })
  }

  get author () { return this._author }
}
