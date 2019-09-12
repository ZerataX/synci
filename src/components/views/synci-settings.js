import { html } from 'lit-element'
import { PageViewElement } from '../page-view-element.js'
import { connect } from 'pwa-helpers/connect-mixin.js'

// This element is connected to the Redux store.
import { store } from '../../store.js'

// These are the actions needed by this element.
import {
  updateUserInfo
} from '../../actions/user.js'

// These are the shared styles needed by this element.
import { style as SharedStyles } from '../shared-styles-css.js'

// These are the elements needed by this element.
import '@polymer/paper-input/paper-input.js'
import '@kuscamara/code-sample/code-sample.js'
import '@polymer/iron-image/iron-image.js'
import '@polymer/paper-styles/element-styles/paper-material-styles.js'
import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-ripple/paper-ripple.js'
import '@polymer/paper-slider/paper-slider.js'
import '@polymer/iron-icon/iron-icon.js'
import '@polymer/iron-icons/av-icons.js'
import '../icon-slider.js'

import user from '../../reducers/user.js'
import session from '../../reducers/session.js'
store.addReducers({
  user,
  session
})

class SynciSettings extends connect(store)(PageViewElement) {
  static get properties () {
    return {
      _username: { type: String },
      _avatar: { type: String },
      _href: { type: String },
      _volume: { type: Number },
      _state: { type: String, reflect: true }
    }
  }

  static get styles () {
    return [
      SharedStyles
    ]
  }

  constructor () {
    super()
    this._state = ''
    this._username = ''
    this._avatar = ''
    this._href = ''
    this._volume = 20
    this.code = null
    this._initialised = false
  }

  render () {
    return html`
    <custom-style>
      <style include="paper-material-styles">
        [elevation="1"] {
          @apply --paper-material-elevation-1;
        }
        [elevation="2"] {
          @apply --paper-material-elevation-2;
        }
        [elevation="3"] {
          @apply --paper-material-elevation-3;
        }
        [elevation="4"] {
          @apply --paper-material-elevation-4;
        }
        [elevation="5"] {
          @apply --paper-material-elevation-5;
        }
        .avatar-preview {
          padding: 1em;
        }
        .avatar {
          margin-left: auto;
          margin-right: auto;
          position: relative;
          cursor: pointer;
          width: 20vh;
          height: 20vh;
          max-width: 100%;
          border-radius: 50%;
        }
        iron-image {
          width: 100%;
          height: 100%;
          background: var(--app-secondary-color);
          border-radius: 50%;
        }
      </style>
    </custom-style>

      <section>
        <h2>Settings</h2>
      </section>
      <section>
        <form>
          <paper-input
          class="input"
            @onchange="${this.settingsChanged}"
            id="username" 
            label="username"
            char-counter
            maxlength="32"
            value="${this._username}">
          </paper-input>
          <paper-input class="input" id="avatar" label="avatar url" value="${this._avatar}"></paper-input>
          <icon-slider
            class="input"
            @volume-changed="${this.settingsChanged}"
            id="volume"
            value="${this._volume}"
            iconStart="av:volume-mute"
            iconEnd="av:volume-up"
            heading="Volume">
          </icon-slider>
        </form>
        <div class="avatar-preview">
          <div class="avatar">
            <iron-image
              preload
              elevation="2"
              id="avatar-image"
              alt="avatar"
              src="${this._avatar}"
              sizing="contain">
            </iron-image>
             <paper-ripple recenters></paper-ripple>
          </div>
        </div>
        <hr>
      </section>
      <section>
        <code-sample copy-clipboard-button preserve-content>
          <template>
            ${this._state}
          </template>
        </code-sample>
      </section>
     
    `
  }

  firstUpdated () {
    this.code = this.shadowRoot.querySelector('code-sample')
    const inputs = this.shadowRoot.querySelectorAll('.input')
    inputs.forEach((input) => {
      input.addEventListener('value-changed', () => {
        input.setAttribute('value', input.value)
        const prop = `_${input.getAttribute('id')}`
        this.setAttribute(prop, input.value)
        this.requestUpdate()
      })
    })
  }

  updated (changedProperties) {
    const user = store.getState().user

    if (this._initialised && (
      (this._username !== user.name) ||
      (this._avatar !== user.image) ||
      (this._href !== user.href) ||
      (this._volume !== user.volume)
    )
    ) {
      store.dispatch(updateUserInfo(
        this._username,
        this._avatar,
        this._href,
        this._volume,
        true
      ))
      this.code.innerHTML = `
        <template>
        ${this._state}
        </template>
      `
    }
  }

  settingsChanged (e) {
    if ('volume' in e.detail) {
      this._volume = e.detail.volume
    }
  }

  stateChanged (state) {
    if (state.user) {
      this._state = JSON.stringify(state, null, 2)
      this._username = state.user.name
      this._avatar = state.user.image
      this._href = state.user.href
      this._volume = state.user.volume
      this._initialised = true
    }
  }
}

window.customElements.define('synci-settings', SynciSettings)
