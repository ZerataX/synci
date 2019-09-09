import { LitElement, html } from 'lit-element'
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js'
import { installOfflineWatcher } from 'pwa-helpers/network.js'
import { installRouter } from 'pwa-helpers/router.js'
import { updateMetadata } from 'pwa-helpers/metadata.js'
import { storageAvailable } from '../util.js'

// This element is connected to the Redux store.
import { store } from '../store.js'

// These are the actions needed by this element.
import {
  navigate,
  updateOffline,
  updateDrawerState,
  checkStorageAvailability
} from '../actions/app.js'

// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer/app-drawer.js'
import '@polymer/app-layout/app-header/app-header.js'
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js'
import '@polymer/app-layout/app-toolbar/app-toolbar.js'
import './snack-bar.js'

import { style } from './synci-app-css.js'

class SynciApp extends connect(store)(LitElement) {
  static get properties () {
    return {
      appTitle: { type: String },
      _page: { type: String },
      _drawerOpened: { type: Boolean },
      _snackbarOpened: { type: Boolean },
      _offline: { type: Boolean }
    }
  }

  static get styles () {
    return style
  }

  render () {
    // Anything that's related to rendering should be done in here.
    return html`
      <!-- Header -->
      <app-header condenses reveals effects="waterfall">
        <app-toolbar class="toolbar-top">
          <button class="menu-btn" title="Menu" @click="${this._menuButtonClicked}"></button>
          <div main-title>${this.appTitle}</div>
        </app-toolbar>

        <!-- This gets hidden on a small screen-->
        <nav class="toolbar-list">
          <a ?selected="${this._page === 'index'}" href="index">Index</a>
          <a ?selected="${this._page === 'session'}" href="session">Session</a>
          <a ?selected="${this._page === 'settings'}" href="settings">Settings</a>
        </nav>
      </app-header>

      <!-- Drawer content -->
      <app-drawer
          .opened="${this._drawerOpened}"
          @opened-changed="${this._drawerOpenedChanged}">
        <nav class="drawer-list">
          <a ?selected="${this._page === 'index'}" href="index">Index</a>
          <a ?selected="${this._page === 'session'}" href="session">Session</a>
          <a ?selected="${this._page === 'settings'}" href="settings">Settings</a>
        </nav>
      </app-drawer>

      <!-- Main content -->
      <main role="main" class="main-content">
        <synci-index class="page" ?active="${this._page === 'index'}"></synci-index>
        <synci-session class="page" ?active="${this._page === 'session'}"></synci-session>
        <synci-settings class="page" ?active="${this._page === 'settings'}"></synci-settings>
        <synci-callback class="page" ?active="${this._page === 'callback'}"></synci-callback>
        <synci-view404 class="page" ?active="${this._page === 'view404'}"></synci-view404>
      </main>

      <footer>
        <p>Made with &hearts by the <a href='https://dmnd.sh/'>DMND</a> team.</p>
      </footer>

      <snack-bar ?active="${this._snackbarOpened}">
        You are now ${this._offline ? 'offline' : 'online'}.
      </snack-bar>
    `
  }

  constructor () {
    super()
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true)
  }

  firstUpdated () {
    store.dispatch(checkStorageAvailability(
      storageAvailable('localStorage'),
      storageAvailable('sessionStorage')
    ))
    installRouter((location) => store.dispatch(navigate(decodeURIComponent(location.pathname))))
    installOfflineWatcher((offline) => store.dispatch(updateOffline(offline)))
    installMediaQueryWatcher('(min-width: 460px)',
      () => store.dispatch(updateDrawerState(false)))
  }

  updated (changedProps) {
    if (changedProps.has('_page')) {
      const pageTitle = this.appTitle + ' - ' + this._page
      updateMetadata({
        title: pageTitle,
        description: pageTitle
        // This object also takes an image property, that points to an img src.
      })
    }
  }

  _menuButtonClicked () {
    store.dispatch(updateDrawerState(true))
  }

  _drawerOpenedChanged (e) {
    store.dispatch(updateDrawerState(e.target.opened))
  }

  stateChanged (state) {
    this._page = state.app.page
    this._offline = state.app.offline
    this._snackbarOpened = state.app.snackbarOpened
    this._drawerOpened = state.app.drawerOpened
  }
}

window.customElements.define('synci-app', SynciApp)
