'use strict'
import { activeUser, checkToken } from './controller/auth.js'
import { updateSession } from './view/session.js'

const synci = {
  common: {
    async init () {
      await activeUser.loggedIn
      const authInterval = window.setInterval(() => { checkToken() }, 60 * 1000) // eslint-disable-line no-unused-vars
      console.log(`logged in as ${activeUser.username}`)
    }
  },
  index: {
    async init () {
      // index page code
    }
  },
  session: {
    'name': window.location.pathname.replace('/session/', '').replace('/', ''),
    async init () {
      const SessionInterval = window.setInterval(() => { updateSession(synci.session.name, activeUser) }, 1000) // eslint-disable-line no-unused-vars
    }
  }
}

// based on https://www.viget.com/articles/extending-paul-irishs-comprehensive-dom-ready-execution/
const UTIL = {
  async exec (controller, action) {
    let ns = synci

    action = (action === undefined) ? 'init' : action
    if (controller !== '' && ns[controller] && typeof ns[controller][action] === 'function') {
      await ns[controller][action]()
    }
  },
  async init () {
    let body = document.body

    let controller = body.getAttribute('data-controller')

    let action = body.getAttribute('data-action')
    await UTIL.exec('common')
    await UTIL.exec(controller)
    await UTIL.exec(controller, action)
  }
}

window.onload = async function () {
  await UTIL.init()
}
