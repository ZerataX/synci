import { html } from 'lit-element'
import { PageViewElement } from '../page-view-element.js'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { SPOTIFY_CLIENT_ID } from '../../../config.js'
import { createPopUp } from '../../util.js'

// This element is connected to the Redux store.
import { store } from '../../store.js'

// These are the actions needed by this element.
import {
  createSession,
  leaveSession
} from '../../actions/session.js'
import {
  updateAuthState,
  updateSpotify,
  fetchSpotifyUserInfo
} from '../../actions/user.js'

// These are components needed by this element
import '@polymer/paper-dialog'

// These are the shared styles needed by this element.
import { style as SharedStyles } from '../shared-styles-css.js'

// These are components needed by this element
import '../user-card.js'

import app from '../../reducers/app.js'
import session from '../../reducers/session.js'
import user from '../../reducers/user.js'
store.addReducers({
  app,
  session,
  user
})

class User {
  constructor (id, name, image, href) {
    this._id = id
    this._name = name
    this._image = image
    this._href = href
  }

  get id () { return this._id }
  get name () { return this._name }
  set name (name) { this._name = name }
  get image () { return this._image }
  set image (image) { this._image = image }
  get href () { return this._href }
  set href (href) { this._href = href }
}

class SynciSession extends connect(store)(PageViewElement) {
  static get properties () {
    return {
      _name: { type: String },
      _type: { type: String },
      _users: { type: Set },
      _media: { type: Object },
      _time: { type: Number },
      _duration: { type: Number },
      _host: { type: Object }
    }
  }

  static get styles () {
    return [
      SharedStyles
    ]
  }

  constructor () {
    super()
    this._name = ''
    this._type = ''
    this._users = new Set()
    this._media = {}
    this._time = 0
    this._duration = -1
    this._host = new User()
  }

  getUsers () {
    const itemTemplates = [];
    for (const i of this._users) {
      itemTemplates.push(html`
          <user-card
            class="followers"
            label="${user.name}"
            iconSrc="${user.image}"
            href="${user.href}"></user-card>
        `)
    }
  
    return itemTemplates
  }

  render () {
    return html`
      <paper-dialog id="modal" modal>
        <h3>Choose a service</h3>
        <div class="buttons">
          <paper-button 
            @click="${this._createSession}"
            value="spotify" dialog-confirm>Spotify</paper-button>
          <paper-button
            @click="${this._createSession}"
            value="youtube" dialog-confirm>Youtube</paper-button>  
        </div>
        </paper-dialog>
      <section class="session">
        <div>
        <h2>${this._name || 'You\'re not part of any session'}</h2>
        <hr>
        <user-card
          id="host"
          label="${this._host.name || 'Anonymous'}"
          iconSrc="${this._host.image || ''}"
          href="${this._host.href || ''}"></user-card>
        ${this.getUsers()}
        </div>
      </section>
    `
  }

  updated (changedProperties) {
    const modal = this.shadowRoot.getElementById('modal')
    const session = store.getState().session // this is probably not the best way to handle this
    if (!session.name && this._name) {
      modal.open()
    } else if (session.name) {
      window.history.replaceState({}, '', `session/${session.name}`)
    }
  }

  stateChanged (state) {
    // session is in state
    if (state.session.name) {
      // state session is not current session
      if (state.app.item && state.app.item !== state.session.name) {
        store.dispatch(leaveSession())
      }
      this._name = state.session.name
      this._media = state.session.media
      this._name = state.session.name
      this._type = state.session.mediaType
      this._users = new Set(state.session._users)
      this._time = state.session.time
      this._duration = state.session.duration
      this._host.name = state.user.name
      this._host.image = state.user.image
      this._host.href = state.user.href
    } else if (state.app.item) {
      this._name = state.app.item
      this._host = new User(state.user.id)
    }
  }

  createState () {
    const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let array = new Uint8Array(40)
    window.crypto.getRandomValues(array)
    array = array.map(x => validChars.charCodeAt(x % validChars.length))
    const randomState = String.fromCharCode.apply(null, array)

    return randomState
  }

  async _createSession (e) {
    const type = e.path[0].getAttribute('value')
    const user = store.getState().user
    switch (type) {
      case 'spotify':
        if (!this.loggedIn(
          user.spotify.accessToken,
          new Date(user.spotify.expirationDate)
        )) {
          this.authSpotify()
        }
        store.dispatch(fetchSpotifyUserInfo())
        break
    }
    store.dispatch(createSession(this._name, this._host, type))
  }

  loggedIn (accessToken, expirationDate) {
    if (accessToken) {
      if (expirationDate - Date.now() > 10 * 60 * 1000) {
        return true
      }
    }
    return false
  }

  authSpotify () {
    const callbackUrl = window.encodeURI(`${document.baseURI}callback/spotify`)
    const scopes = window.encodeURI('user-read-playback-state user-modify-playback-state user-read-email')
    const state = this.createState()
    const authURL = 'https://accounts.spotify.com/authorize' +
      `?client_id=${SPOTIFY_CLIENT_ID}` +
      `&redirect_uri=${callbackUrl}` +
      `&scope=${scopes}` +
      `&state=${state}&response_type=token`
    store.dispatch(updateAuthState(state))

    const popup = createPopUp(authURL, 'spotify login')
    window.addEventListener('storage', () => {
      const exdate = window.localStorage.getItem('__synci_spotify_exdate__')
      const token = window.localStorage.getItem('__synci_spotify_token__')
      store.dispatch(updateSpotify(token, exdate))
      store.dispatch(updateAuthState(''))

      popup.close()
    }, false)
  }
}

window.customElements.define('synci-session', SynciSession)