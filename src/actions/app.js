export const UPDATE_PAGE = 'UPDATE_PAGE'
export const UPDATE_OFFLINE = 'UPDATE_OFFLINE'
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE'
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR'
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR'

export const navigate = (path) => (dispatch) => {
  // adjust for non root paths, e.g. if hosted on ipfs
  const baseURI = document.baseURI.replace(`${window.location.protocol}//${window.location.host}`, '')
  path = path.replace(baseURI, '')

  const page = path || 'index'

  dispatch(loadPage(page))

  dispatch(updateDrawerState(false))
}

const loadPage = (page) => (dispatch) => {
  /* eslint-disable no-unused-expressions */
  switch (page) {
    case 'index':
      import('../components/views/synci-index.js').then((module) => {
      })
      break
    default:
      page = 'view404'
      import('../components/views/synci-view404.js')
  }
  /* eslint-enable no-unused-expressions */

  dispatch(updatePage(page))
}

const updatePage = (page) => {
  return {
    type: UPDATE_PAGE,
    page
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

export const updateDrawerState = (opened) => {
  return {
    type: UPDATE_DRAWER_STATE,
    opened
  }
}
