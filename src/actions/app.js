export const UPDATE_PAGE = 'UPDATE_PAGE'
export const UPDATE_ITEM = 'UPDATE_ITEM'
export const UPDATE_OFFLINE = 'UPDATE_OFFLINE'
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE'
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR'
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR'
export const OPEN_MODAL = 'OPEN_MODAL'
export const CLOSE_MODAL = 'CLOSE_MODAL'
export const STORAGE_AVAILABILITY = 'STORAGE_AVAILABILITY'

export const navigate = (path) => (dispatch) => {
  // adjust for ipfs
  const dir = path.split('/')[1]
  if (dir === 'ipfs' || dir === 'ipns') {
    const baseURI = document.baseURI.replace(`${window.location.protocol}//${window.location.host}`, '')
    path = path.replace(baseURI, '')
  }
  if (path.startsWith('/')) {
    path = path.substring(1)
  }

  dispatch(loadPage(path || 'index'))

  dispatch(updateDrawerState(false))
}

const loadPage = (path) => (dispatch) => {
  let [page, item] = path.split('/')
  /* eslint-disable no-unused-expressions */
  switch (page) {
    case 'index':
      import('../components/views/synci-index.js').then((module) => {
      })
      break
    case 'session':
      import('../components/views/synci-session.js')
      break
    case 'settings':
      import('../components/views/synci-settings.js')
      break
    case 'callback':
      import('../components/views/synci-callback.js')
      break
    default:
      page = 'view404'
      import('../components/views/synci-view404.js')
  }
  /* eslint-enable no-unused-expressions */

  dispatch(updatePage(page))
  dispatch(updateItem(item))
}

const updatePage = (page) => {
  return {
    type: UPDATE_PAGE,
    page
  }
}

const updateItem = (item) => {
  return {
    type: UPDATE_ITEM,
    item
  }
}

export const updateDrawerState = (opened) => {
  return {
    type: UPDATE_DRAWER_STATE,
    opened
  }
}

export const openModal = (id, props = {}) => {
  return {
    type: OPEN_MODAL,
    id,
    props
  }
}

export const closeModal = () => {
  return {
    type: CLOSE_MODAL
  }
}

export const checkStorageAvailability = (local, session) => {
  return {
    type: STORAGE_AVAILABILITY,
    local,
    session
  }
}

let snackbarTimer

export const showSnackbar = () => (dispatch) => {
  dispatch({
    type: OPEN_SNACKBAR
  })
  window.clearTimeout(snackbarTimer)
  snackbarTimer = window.setTimeout(() =>
    dispatch({ type: CLOSE_SNACKBAR }), 3000)
}

export const updateOffline = (offline) => (dispatch, getState) => {
  if (offline !== getState().app.offline) {
    dispatch(showSnackbar())
  }
  dispatch({
    type: UPDATE_OFFLINE,
    offline
  })
}
