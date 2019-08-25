import { Song } from './model/spotify.js'
import { jsonFetch } from '../util'

const API_ENDPOINT = window.location.hostname

export class Session {
  constructor (name, accessToken) {
    this._name = name
    this._access_token = accessToken
    this._endpoint = `${API_ENDPOINT}/session/${this._name}/info`
    this.getInfo()
  }

  getInfo () {
    jsonFetch(this._endpoint).then(data => {
      this._author = data.author
      this._followers = data.followers
      this._song = Song(data.song, data.timestamp, data.api_url, this._access_token)
    })
      .catch(err => {
        console.error(err)
        window.alert('could not retrieve session info')
      })
  }

  setInfo (song, user, users) {
    let body = JSON.stringify({
      'author': user.user_id,
      'followers': users,
      'name': this._name,
      'timestamp': song.timestamp,
      'song': song.uri,
      'api_url': song.api
    })
    jsonFetch(this._endpoint, this._access_token, 'PUT', body).then(data =>
      console.log(data)
    )
  }
}
