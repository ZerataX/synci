import { html } from 'lit-element'
import { PageViewElement } from '../page-view-element.js'
import words from '../wordlist.js'

// These are the shared styles needed by this element.
import { style as SharedStyles } from '../shared-styles.js'

// These are components needed by this element
import '../random-item-input.js'

class SynciIndex extends PageViewElement {
  static get styles () {
    return [
      SharedStyles
    ]
  }

  render () {
    return html`
    <section>
        <h2>Welcome</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </section>
     <section>
        <h2>Create a Session</h2>
        <p>Create a session to <b>party</b> with your friends</p>
        <p>Enter a session name and click join</p>
        <random-item-input directory="session" .listWords=${words}></random-item-input>
      </section>
      <section>
        <p>Vestibulum at est ex. Aenean id ligula id nibh dictum laoreet. Etiam non semper erat. Pellentesque eu justo rhoncus diam vulputate facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam feugiat metus ex, vel fringilla massa tincidunt sit amet. Nunc facilisis bibendum tristique. Mauris commodo, dolor vitae dapibus fermentum, odio nibh viverra lorem, eu cursus diam turpis et sapien. Nunc suscipit tortor a ligula tincidunt, id hendrerit tellus sollicitudin.</p>
      </section>
    `
  }
}

window.customElements.define('synci-index', SynciIndex)
