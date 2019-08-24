import { Song } from 'model/spotify'
import { jsonFetch } from 'util'

const API_ENDPOINT = window.location.hostname

export class Session {
  constructor (name, accessToken) {
    this.name = name
    this.access_token = accessToken
    this.endpoint = `${API_ENDPOINT}/session/${this.name}/info`
    this.getInfo()
  }

  getInfo () {
    jsonFetch(this.endpoint).then(data => {
      this.author = data.author
      this.followers = data.followers
      this.song = Song(data.song, data.timestamp, data.api_url, this.access_token)
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
      'name': this.name,
      'timestamp': song.timestamp,
      'song': song.uri,
      'api_url': song.api
    })
    jsonFetch(this.endpoint, this.access_token, 'PUT', body).then(data =>
      console.log(data)
    )
  }
}
