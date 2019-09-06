import { LitElement, html } from 'lit-element'
import { style } from './snack-bar-css.js'

class SnackBar extends LitElement {
  static get properties () {
    return {
      active: { type: Boolean }
    }
  }

  static get styles () {
    return style
  }

  render () {
    return html`
      <slot></slot>
    `
  }
}

window.customElements.define('snack-bar', SnackBar)
