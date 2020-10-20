import { LitElement, html, css } from 'lit-element'

import '@polymer/iron-icon/iron-icon.js'
import '@polymer/iron-icons/iron-icons.js'
import '@polymer/iron-icons/social-icons.js'
import '@polymer/iron-image/iron-image.js'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-styles/element-styles/paper-material-styles.js'
import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-ripple/paper-ripple.js'

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
    return css`
        span {
          padding-left: 10%;
          font-size: 1.3em;
        }
        .avatar-image {
          z-index: 1;
          position: relative;
          width: 11vh;
          height: 11vh;
          max-width: 80px;
          max-height: 80px;
        }
        .avatar-icon {
          z-index: 1;
          position: relative;
        }
        .card-content {
          display:flex;
          justify-content:center;
          align-items:center;
        }
      `
  }

  constructor () {
    super()
    this.icon = 'social:person-outline'
    this.iconSrc = ''
    this.label = ''
    this.href = ''
    this.sizing = 'contain'
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

        paper-card {
          z-index: 0;
          cursor: pointer;
          display:flex;
          width: 100%;
          height: 20vh;
          max-height: 110px;
          position: relative;
        }
        iron-image {
          width: 100%;
          height: 100%;
          background: var(--app-secondary-color);
          --iron-image-placeholder: {
            background: var(--app-primary-color);
          };
          border-radius: 50%;
        }
        iron-icon {
          width: 7vh;
          height: 7vh;
          max-width: 50px;
          max-height: 50px;
          padding: 2vh;
          border-radius: 50%;
          --paper-icon-button-ink-color: var(--app-secondary-color);
          background-color: var(--app-primary-color);
          color: white;
        }
        </style>
      </custom-style>

      <paper-card>
        <div class="card-content">
          <div class="avatar-icon" @click="${this._checkLink}">
          <iron-icon
            elevation="2"
            ?hidden=${!!(this.iconSrc)}
            id="icon"
            tabindex="1"
            icon="${this.icon}">
          </iron-icon>
              <paper-ripple class="circle" recenters></paper-ripple>
          </div>
          <div ?hidden=${!(this.iconSrc)} class="avatar-image" @click="${this._checkLink}">
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
          <span @click="${this._checkLink}">${this.label}</span>
        </div>
        <paper-ripple></paper-ripple>
      </paper-card>
    `
  }

  _checkLink (e) {
    if (this.href) {
      this.dispatchEvent(
        new window.CustomEvent(
          'link-opened', {
            detail: { href: this.href },
            bubbles: true,
            composed: true
          }
        )
      )
    }
  }
}

window.customElements.define('user-card', UserCard)
