import { LitElement, html } from 'lit-element'
import { style } from './user-card-css.js'

import '@polymer/iron-icon/iron-icon.js'
import '@polymer/iron-icons/iron-icons.js'
import '@polymer/iron-icons/social-icons.js'
import '@polymer/iron-image/iron-image.js'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-styles/element-styles/paper-material-styles.js';
import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-ripple/paper-ripple.js'
import { createPopUp } from '../util.js';

class UserCard extends LitElement {
  static get properties () {
    return {
      icon: { type: String },
      iconSrc: { type: String },
      label: { type: String },
      sizing: { type: String },
      href: { type: String }
    }
  }

  static get styles () {
    return [
      style
    ]
  }

  constructor () {
    super()
    this.icon = 'social:person-outline'
    this.iconSrc = ''
    this.label = ''
    this.href = ''
    this.sizing = 'contain'
    this.modal = null
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

        .avatar-image {
          position: relative;
          width: 14vh;
          height: 14vh;
        }
        .avatar-icon {
          position: relative;
        }
        .card-content {
          display:flex;
          justify-content:center;
          align-items:center;
        }
        iron-image {
          width: 100%;
          height: 100%;
          background: #ddd;
          --iron-image-placeholder: {
            background: var(--app-primary-color);
          };
          border-radius: 50%;
        }
        iron-icon {
          width: 10vh;
          height: 10vh;
          padding: 2vh;
          border-radius: 50%;
        }
        paper-card {
          display:flex;
          width: 100%;
          height: 20vh;
          position: relative;
        }
        span {
          margin-left: 10vh;
          font-size: 1.3em;
        }
        </style>
        
      </custom-style>

      <paper-dialog id="modal">
        <h2>Open User Profile</h2>
        <p>This will open a window to an external site.</p>
        <div class="buttons">
          <paper-button dialog-dismiss>Decline</paper-button>
          <paper-button @click="${this._openLink}" dialog-confirm autofocus>Accept</paper-button>
        </div>
      </paper-dialog>

      <paper-card @click="${this._checkLink}">
        <div class="card-content">
          <div class="avatar-icon">
          <iron-icon
            elevation="2"
              ?hidden=${!!(this.iconSrc)}
              id="icon"
              tabindex="1"
              icon="${this.icon}"></iron-icon>
              <paper-ripple class="circle" recenters></paper-ripple>
          </div>
          <div ?hidden=${!(this.iconSrc)} class="avatar-image">
            <iron-image
              elevation="2"
              preload
              id="avatar-image"
              alt="avatar"
              src="${this.iconSrc}"
              sizing="${this.sizing}">
              </iron-image>
              <paper-ripple class="circle" recenters></paper-ripple>
          </div>
          <span>${this.label}</span>
        </div>
      </paper-card>
    `
  }

  firstUpdated () {
    this.modal = this.shadowRoot.getElementById('modal')
  }

  _checkLink (e) {
    this.modal.open()
  }

  _openLink (e) {
    window.open(this.href, '_blank')
  }
}

window.customElements.define('user-card', UserCard)
