import { LitElement, html, css } from 'lit-element'
import { PageViewElement } from './page-view-element.js'

// chooses players from players/*.js

class SyncPlayer extends PageViewElement {
  static get properties () {
    return {
      mediaType: { type: String },
      media: { type: String },
      time: { type: Number },
      duration: { type: Number },
      host: { type: Boolean }
    }
  }

  static get styles () {
    return css`
    `
  }

  render () {
    return html`
    `
  }
}
window.customElements.define('sync-player', SyncPlayer)
