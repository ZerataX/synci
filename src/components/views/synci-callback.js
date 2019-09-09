import { html } from 'lit-element'
import { PageViewElement } from '../page-view-element.js'
import { connect } from 'pwa-helpers/connect-mixin.js'

// These are the shared styles needed by this element.
import { style as SharedStyles } from '../shared-styles-css.js'

// This element is connected to the Redux store.
import { store } from '../../store.js'

import user from '../../reducers/user.js'
store.addReducers({
  user
})

class SynciCallback extends connect(store)(PageViewElement) {
  static get properties () {
    return {
      _type: { type: String },
      _accessToken: { type: String },
      _expirationDate: { type: Date }
    }
  }

  static get styles () {
    return [
      SharedStyles
    ]
  }

  render () {
    return html`
      <section>
        <h2>Callback</h2>
        <p>Please wait until you're logged in...</p>
      </section>
     
    `
  }

  stateChanged (state) {
    const hashes = window.location.hash.substring(1)
    const params = {}

    if (hashes) {
      hashes.split('&').map(hash => {
        const [key, val] = hash.split('=')
        params[key] = decodeURIComponent(val)
      })
    }

    const type = state.app.item
    const authState = state.user.authState
    switch (type) {
      case 'spotify':
        if (authState !== params.state) {
          window.alert(`state does not match ${authState} != ${params.state}`)
        } else {
          const exDate = new Date(Date.now() + parseInt(params.expires_in) * 1000)
          window.localStorage.setItem('__synci_spotify_token__', params.access_token)
          window.localStorage.setItem('__synci_spotify_exdate__', exDate)
        }
        break
      default:
    }
  }
}

window.customElements.define('synci-callback', SynciCallback)
