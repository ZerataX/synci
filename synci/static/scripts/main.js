const synci = {
  common: {
    init () {
      // application wide code
    }
  },
  index: {
    init () {
      // index page code
    }
  },
  session: {
    init () {
      // session page code
    }
  }
}

// based on https://www.viget.com/articles/extending-paul-irishs-comprehensive-dom-ready-execution/
const UTIL = {
  exec (controller, action) {
    let ns = synci

    action = (action === undefined) ? 'init' : action
    if (controller !== '' && ns[controller] && typeof ns[controller][action] === 'function') {
      ns[controller][action]()
    }
  },
  init () {
    let body = document.body

    let controller = body.getAttribute('data-controller')

    let action = body.getAttribute('data-action')
    UTIL.exec('common')
    UTIL.exec(controller)
    UTIL.exec(controller, action)
  }
}

window.onload = function () {
  UTIL.init()
}
