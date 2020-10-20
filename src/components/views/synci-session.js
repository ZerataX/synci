/* 
1. user connects 
2a. nobody else  -> user = host
2b. users.push(user)
3. host allows certain services that lazy load the needed reducers
3b. if service needs login all users asked to login or kicked
4. from there on host can set settings and possibly user if they allow it
*/



import { html, css } from 'lit-element'
import { PageViewElement } from '../page-view-element.js'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { SPOTIFY_CLIENT_ID } from '../../../config.js'
import { getBaseUrl, createPopUp } from '../../util.js'
import { User, createState, loggedIn } from '../../modules/auth.js'

// This element is connected to the Redux store.
import { store } from '../../store.js'

// These are the actions needed by this element.
import {
  openModal,
  closeModal
} from '../../actions/app.js'
import {
  createSession,
  leaveSession,
  connectSession
} from '../../actions/session.js'
import {
  updateAuthState
} from '../../actions/user.js'

// only do this if spotify allowed for session/room
// import { 
//   updateAuthState,
//   updateSpotify,
//   fetchSpotifyUserInfo
// } from '../../actions/services/spotify.js'

// These are components needed by this element
import '@polymer/paper-dialog'
import '../user-card.js'
// import '../sync-player.js'

// These are the shared styles needed by this element.
import { style as SharedStyles } from '../shared-styles.js'

import app from '../../reducers/app.js'
import session from '../../reducers/session.js'
import user from '../../reducers/user.js'
store.addReducers({
  app,
  session,
  user
})

class SynciSession extends connect(store)(PageViewElement) {
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
    this._time = -1
    this._duration = -1
    this._host = new User()
    this._me = new User()
    this._isFetching = false // is currently fetching user info
    this._isConnecting = false // is currently connecting to webRTC
    this._page = '' // /session/{page}
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
            ?disabled="${this._isFetching}"
            @click="${this._createSession}"
            value="spotify" dialog-confirm>Spotify</paper-button>
          <paper-button
            ?disabled="${this._isFetching}"
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
        <sync-player ?active="${!!this._type}"></sync-player>
      </section>
    `
  }

  async firstUpdated () {
    await store.dispatch(connectSession(this._page))
    const modals = this.shadowRoot.querySelectorAll('paper-dialog')
    // TODO: instead of observer https://github.com/Polymer/lit-element/issues/81
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
    // TODO: this buisness logic is confusing
    if (this._page) {
      if (!this._connected) {
        if (!this._isConnecting) {
          console.debug('connecting')
          await store.dispatch(this._page)
        }
        return
      }
      if (!this._type && this.isHost()) {
        if (!this.modal.open && this.modal.id !== 'chooseService') {
          store.dispatch(openModal('chooseService'))
        }
      } else {
        if (this.modal.open && this.modal.id === 'chooseService') {
          store.dispatch(closeModal())
        }
        import('../sync-player.js') // eslint-disable-line no-unused-expressions
      }
    } else {
      window.history.replaceState({}, '', `${getBaseUrl()}session/${session.name}`)
    }
  }

  stateChanged (state) {
    this.modal = state.app.modal
    this._me = new User( // TODO: creating a class everytime seems awful??
      state.user.id,
      state.user.name,
      state.user.image,
      state.user.href
    )
    this._isFetching = state.user.isFetching
    this._connected = state.session.connected
    this._isConnecting = state.session.isConnecting
    this._page = state.app.item

    if (state.session.name) { // session is in state
      if (state.app.item && state.app.item !== state.session.name) { // state session is not current session
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
    }
  }

  async _createSession (e) {
    const type = e.target.getAttribute('value')
    const spotify = store.getState().user.spotify // save in constructor ??
    if (this._type) {
      store.dispatch(leaveSession())
    }

    /* TODO: kinda weird that all the services are in so many places
    components/views/{synci-session.js,synci-callback},
    components/players/*.js
    actions/services/*.js,
    reducers/logins.js
    */
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

    store.dispatch(createSession(this._page, this._me, type))
    store.dispatch(closeModal())
  }

  _openLinkModal (e) {
    store.dispatch(openModal('openLink', { href: e.detail.href }))
  }

  _openLink (e) {
    window.open(e.target.getAttribute('href'), 'user profile')
  }

  isHost () { return !this._host.id || this._host.id === this._me.id }

  // SERVICE AUTHENTICATION
  authSpotify () {
    const callbackUrl = `${getBaseUrl()}callback/spotify`
    const scopes = window.encodeURI('user-read-playback-state user-modify-playback-state user-read-email')
    const state = createState()
    const authURL = 'https://accounts.spotify.com/authorize' +
      `?client_id=${SPOTIFY_CLIENT_ID}` +
      `&redirect_uri=${callbackUrl}` +
      `&scope=${scopes}` +
      `&state=${state}&response_type=token`

    store.dispatch(updateAuthState(state)) // one should be enough, but lazyload redux is weird
    window.localStorage.setItem('__synci_auth_state__', state)

    return new Promise((resolve, reject) => {
      const popup = createPopUp(authURL, 'spotify login')
      window.addEventListener('storage', (e) => {
        if (e.key !== '__synci_spotify_expire_date__') { return }
        const expireDate = window.localStorage.getItem('__synci_spotify_expire_date__')
        const token = window.localStorage.getItem('__synci_spotify_token__')
        store.dispatch(updateSpotify(token, expireDate))
        store.dispatch(updateAuthState(''))
        window.localStorage.setItem('__synci_auth_state__', '')

        popup.close()
        return resolve()
      }, false)
    })
  }
}

window.customElements.define('synci-session', SynciSession)
