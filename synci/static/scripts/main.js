'use strict'
import { Session } from './model/session.js'
import { activeUser, checkToken } from './controller/auth.js'
import { updateSession } from './controller/session.js'

const synci = {
  common: {
    async init () {
      await activeUser.loggedIn
      const authInterval = window.setInterval(() => { checkToken() }, 3 * 60 * 1000) // eslint-disable-line no-unused-vars
      console.log(`logged in as ${activeUser.username}`)
    }
  },
  index: {
    async init () {
      // index page code
    }
  },
  session: {
    name: window.location.pathname.replace('/session/', '').replace('/', ''),
    async init () {
      const activeSession = new Session(synci.session.name, activeUser.accessToken)
      const SessionInterval = window.setInterval(() => { updateSession(activeSession, activeUser) }, 10 * 1000) // eslint-disable-line no-unused-vars
      updateSession(activeSession, activeUser)
    }
  }
}

// based on https://www.viget.com/articles/extending-paul-irishs-comprehensive-dom-ready-execution/
const UTIL = {
  async exec (controller, action) {
    const ns = synci

    action = (action === undefined) ? 'init' : action
    if (controller !== '' && ns[controller] && typeof ns[controller][action] === 'function') {
      await ns[controller][action]()
    }
  },
  async init () {
    const body = document.body

    const controller = body.getAttribute('data-controller')

    const action = body.getAttribute('data-action')
    await UTIL.exec('common')
    await UTIL.exec(controller)
    await UTIL.exec(controller, action)
  }
}

window.onload = async function () {
  await UTIL.init()
}
