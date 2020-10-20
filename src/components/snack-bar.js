import { LitElement, html } from 'lit-element'

class SnackBar extends LitElement {
  static get properties () {
    return {
      active: { type: Boolean }
    }
  }

  static get styles () {
    return css``
  }

  render () {
    return html`
      <slot></slot>
    `
  }
}

window.customElements.define('snack-bar', SnackBar)
