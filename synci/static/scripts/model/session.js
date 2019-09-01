import { Song } from './spotify.js'
import { jsonFetch } from '../util.js'

export class Session {
  constructor (name, accessToken) {
    this._name = name
    this._access_token = accessToken
    this._timestamp = 0
    this._endpoint = `/session/${this._name}/info`
  }

  async getInfo () {
    await jsonFetch(this._endpoint).then(data => {
      this._host = data.host
      this._followers = data.followers
      this._timestamp = parseInt(data.timestamp)
      if (data.song) {
        const song = data.song
        this._song = new Song(
          song.time,
          song.duration,
          song.uri,
          song.href,
          song.name,
          song.image,
          song.artist,
          this._access_token,
          song.context
        )
      }
    }).catch(err => {
      console.error(err)
      window.alert('could not retrieve session info')
    })
  }

  async setInfo (song, host) {
    const body = JSON.stringify({
      host: host.userID,
      timestamp: (new Date()).getTime(),
      song: {
        time: song.time,
        duration: song.duration,
        uri: song.uri,
        href: song.href,
        name: song.name,
        image: song.image,
        artist: song.artist,
        context: ('context' in song) ? song.context : null
      }
    })
    jsonFetch(this._endpoint, null, 'PUT', body).catch(err => {
      console.error(err)
      window.alert('could not update session with current song')
    })
  }

  get host () { return this._host }
  get timestamp () { return this._timestamp }
  get song () { return this._song }
}
