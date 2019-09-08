import { html } from 'lit-element'
import { PageViewElement } from '../page-view-element.js'

// These are the shared styles needed by this element.
import { style as SharedStyles } from '../shared-styles-css.js'

class SynciSettings extends PageViewElement {
  static get styles () {
    return [
      SharedStyles
    ]
  }

  render () {
    return html`
      <section>
        <h2>Settings</h2>
      </section>
     
    `
  }
}

window.customElements.define('synci-settings', SynciSettings)
