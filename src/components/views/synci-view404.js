import { html } from 'lit-element'
import { PageViewElement } from '../page-view-element.js'

// These are the shared styles needed by this element.
import { style as SharedStyles } from '../shared-styles.js'

class SynciView404 extends PageViewElement {
  static get styles () {
    return [
      SharedStyles
    ]
  }

  render () {
    return html`
      <section>
        <h2>Oops! You hit a 404</h2>
        <p>
          The page you're looking for doesn't seem to exist. Head back
          <a href="index">home</a> and try again?
        </p>
      </section>
    `
  }
}

window.customElements.define('synci-view404', SynciView404)
