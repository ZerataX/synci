import { html } from 'lit-element'
import { PageViewElement } from '../page-view-element.js'

// These are the shared styles needed by this element.
import { SharedStyles } from '../shared-styles.js'

// These are the elements needed by this element.
import '../random-item-input.js'

class SynciSession extends PageViewElement {
  constructor () {
    super()
    this.listWords = ['alpha', 'beta', 'omega']
  }

  static get styles () {
    return [
      SharedStyles
    ]
  }

  render () {
    return html`
      <section>
        <h2>Create a Session</h2>
        <p>Create a session to <b>party</b> with your friends</p>
        <p>Enter a session name and click join</p>
        <random-item-input directory="session" .listWords=${this.listWords}></random-item-input>
      </section>
     
    `
  }
}

window.customElements.define('synci-session', SynciSession)
