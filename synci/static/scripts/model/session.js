import { Song } from 'model/spotify'
import { jsonFetch } from 'util'

const API_ENDPOINT = '127.0.0.1:5000'

export class Session {
  constructor (name, accessToken) {
    this.name = name
    this.access_token = accessToken
    this.author = null
    this.followers = []
    this.song = null
    this.endpoint = `${API_ENDPOINT}/session/${this.name}/info`
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
    return async () => {
      const rawResponse = await window.fetch(this.endpoint, {
        method: 'PUT',
        headers: this.header,
        body: JSON.stringify({
          'author': user.user_id,
          'followers': users,
          'name': this.name,
          'playtime': song.timestamp,
          'song': song.uri,
          'api_url': song.api
        })
      })
      const content = await rawResponse.json()
      console.log(content)
    }
  }
}
