/* global Ipfs IpfsPubsubRoom */
import { html, css } from 'lit-element'
import { PageViewElement } from '../page-view-element.js'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { SPOTIFY_CLIENT_ID } from '../../../config.js'
import { getBaseUrl, createPopUp } from '../../util.js'
import { User, createState, loggedIn } from '../../functions/auth.js'

import '/dist/bundle.js'

// This element is isConnected to the Redux store.
import { store } from '../../store.js'

// These are the actions needed by this element.
import {
  openModal,
  closeModal
} from '../../actions/app.js'
import {
  createSession,
  changeMedia,
  leaveSession,
  connectSession,
  sessionConnected,
  changeHost
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
// import '../sync-player.js'

import app from '../../reducers/app.js'
import session from '../../reducers/session.js'
import user from '../../reducers/user.js'
store.addReducers({
  app,
  session,
  user
})

class SynciSession extends connect(store)(PageViewElement) {
  static get properties () {
    return {
      _name: { type: String },
      _type: { type: String },
      _users: { type: Set },
      _media: { type: Object },
      _time: { type: Number },
      _duration: { type: Number },
      _host: { type: Object },
      _me: { type: Object }
    }
  }

  static get styles () {
    return [
      SharedStyles,
      css`
        section > div {
          width: 100%;
        }
        .host {
          margin: 2em;
        }
      `
    ]
  }

  constructor () {
    super()
    this._name = ''
    this._type = ''
    this._users = new Set()
    this._media = null
    this._time = 0
    this._duration = -1
    this._host = new User()
    this._me = new User()
    this._fetching = false // is currently fetching user info
    this._created = false // session is created
    this._isConnected = false // isConnected to pubsub room
    this._connecting = false
    this.modal = null
  }

  userCards (users = new Set()) {
    const itemTemplates = []
    users.forEach((user) => {
      itemTemplates.push(html`
          <user-card
            class="followers"
            label="${user.name}"
            iconSrc="${user.image}"
            href="${user.href}">
          </user-card>
        `)
    })

    return itemTemplates
  }

  render () {
    return html`
      <paper-dialog ?opened=${this.modal.open && this.modal.id === 'chooseService'} id="chooseService" modal>
        <h3>Choose a service</h3>
        <div class="buttons">
          <paper-button 
            ?disabled="${this._fetching}"
            @click="${this._createSession}"
            value="spotify" dialog-confirm>Spotify</paper-button>
          <paper-button
            ?disabled="${this._fetching}"
            @click="${this._createSession}"
            value="youtube" dialog-confirm>Youtube</paper-button>  
        </div>
      </paper-dialog>
      <paper-dialog ?opened=${this.modal.open && this.modal.id === 'openLink'} id="openLink">
        <h3>Open User Profile</h3>
        <p>This will open a window to an external site.</p>
        <div class="buttons">
          <paper-button dialog-dismiss>Decline</paper-button>
          <paper-button
            href="${this.modal.props.href}"
            @click="${this._openLink}" 
            dialog-confirm autofocus>Accept
          </paper-button>
        </div>
      </paper-dialog>
      <section id="host">
        <div>
        <h2>${this._name || 'You\'re not part of any session'}</h2>
        <hr>
        <div class="host">
          <user-card
            @link-opened=${this._openLinkModal}
            id="host"
            label="${this._host.name || 'Anonymous'}"
            iconSrc="${this._host.image || ''}"
            href="${this._host.href || ''}"></user-card>
          ${this.userCards(this._users)}
          </div>
        </div>
      </section>
      <section id="player">
        <sync-player ?active="${this._created}"></sync-player>
      </section>
    `
  }

  firstUpdated () {
    const modals = this.shadowRoot.querySelectorAll('paper-dialog')
    const observer = new window.MutationObserver((mutationsList, observer) => {
      // wait until action is preformed before closing modal
      setTimeout(() => {
        mutationsList.forEach((mutation) => {
          if (mutation.target.hasAttribute('aria-hidden') &&
            mutation.target.id === this.modal.id) {
            store.dispatch(closeModal())
          }
        })
      }, 50)
    })

    modals.forEach((modal) => {
      observer.observe(modal, { attributes: true })
    })
  }

  async updated (changedProperties) {
    const session = store.getState().session // this is probably not the best way to handle this
    const app = store.getState().app
    if (this._name && app.item) {
      if (!this._isConnected) {
        if (!this._connecting) {
          store.dispatch(connectSession())
          this.sync()
        }
        return
      }
      if (!session.name) {
        if (!this._created && !this.modal.open && this.modal.id !== 'chooseService') {
          store.dispatch(openModal('chooseService'))
        }
      } else {
        if (this.modal.open && this.modal.id === 'chooseService') {
          store.dispatch(closeModal())
        }
        this._created = true
        import('../sync-player.js')
      }
    } else {
      window.history.replaceState({}, '', `${getBaseUrl()}session/${session.name}`)
    }
  }

  stateChanged (state) {
    this.modal = state.app.modal
    this._me = new User(
      state.user.id,
      state.user.name,
      state.user.image,
      state.user.href
    )
    this._fetching = state.user.isFetching
    this._isConnected = state.session.isConnected
    this._connecting = state.session.connecting

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
      this._users = state.session.users
      this._time = state.session.time
      this._duration = state.session.duration
      this._host = state.session.host
    } else if (state.app.item) {
      this._name = state.app.item
      this._created = false
    }
  }

  async _createSession (e) {
    const type = e.target.getAttribute('value')
    const spotify = store.getState().user.spotify // save in constructor ??

    switch (type) {
      case 'spotify':
        if (!loggedIn(
          spotify.accessToken,
          new Date(spotify.expirationDate)
        )) {
          await this.authSpotify()
        }
        store.dispatch(fetchSpotifyUserInfo())
        break
    }

    store.dispatch(createSession(this._name, this._me, type))
    store.dispatch(closeModal())
  }

  _openLinkModal (e) {
    store.dispatch(openModal('openLink', { href: e.detail.href }))
  }

  _openLink (e) {
    window.open(e.target.getAttribute('href'), 'user profile')
  }

  authSpotify () {
    const callbackUrl = `${getBaseUrl()}callback/spotify`
    const scopes = window.encodeURI('user-read-playback-state user-modify-playback-state user-read-email')
    const state = createState()
    const authURL = 'https://accounts.spotify.com/authorize' +
      `?client_id=${SPOTIFY_CLIENT_ID}` +
      `&redirect_uri=${callbackUrl}` +
      `&scope=${scopes}` +
      `&state=${state}&response_type=token`

    store.dispatch(updateAuthState(state))
    window.localStorage.setItem('__synci_spotify_state__', state)
    return new Promise((resolve, reject) => {
      const popup = createPopUp(authURL, 'spotify login')
      window.addEventListener('storage', (e) => {
        if (e.key !== '__synci_spotify_exdate__') { return }
        const exdate = window.localStorage.getItem('__synci_spotify_exdate__')
        const token = window.localStorage.getItem('__synci_spotify_token__')
        store.dispatch(updateSpotify(token, exdate))
        store.dispatch(updateAuthState(''))

        popup.close()
        resolve()
      }, false)
    })
  }

  isHost () { return !this._host.id || this._host.id === this._me.id }

  async sync () {
    const Room = await IpfsPubsubRoom
    const node = await Ipfs.create({
      EXPERIMENTAL: {
        pubsub: true
      },
      config: {
        Addresses: {
          Swarm: [
            '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
          ]
        }
      }
    })

    const room = await Room(node, `__synci_${this._name}__`)
    const sessionInfo = JSON.stringify({
      type: 'SESSION_INFO',
      name: this._name,
      host: this._me.JSON,
      mediaType: this._mediaType,
      users: [...this._users],
      media: this._media,
      time: this._time,
      duration: this._duration
    })

    room.on('peer joined', (peer) => {
      console.log('Peer joined the room', peer)
      if (this.isHost()) {
        room.sendTo(peer, sessionInfo)
      }
    })

    // setInterval(() => {
    //   if (this.isHost()) {
    //     room.broadcast(sessionInfo)
    //   }
    // }, 2000)

    // room.on('peer left', (peer) => {
    //   console.log('Peer left...', peer)
    // })

    room.on('subscribed', () => {
      console.log('Now connected!')
      store.dispatch(sessionConnected())
      // this.updated()
    })

    room.on('message', (message) => {
      console.log(`got message from ${message.from}`)
      let data = ''
      try {
        data = JSON.parse(message.data.toString())
      } catch (error) {
        console.error(error)
        return
      }
      console.log(data)
      switch (data.type) {
        case 'SESSION_INFO':
          if (!this._created) {
            store.dispatch(createSession(
              this._name,
              new User(
                data.host.id,
                data.host.name,
                data.host.image,
                data.host.href
              ),
              data.mediaType,
              new Set(data.users),
              data.media,
              data.time,
              data.duration
            ))
            this._created = true
            this.updated()
          } else if (!this.isHost()) {
            store.dispatch(changeMedia(
              data.media,
              data.mediaType,
              data.duration,
              data.time
            ))
          }
          break
        case 'CHANGE_HOST':
          store.dispatch(changeHost(data.props.host))
          break
        default:
          console.log(data)
          break
      }
    })
  }
}

window.customElements.define('synci-session', SynciSession)
