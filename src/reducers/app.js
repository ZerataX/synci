import {
  UPDATE_PAGE,
  UPDATE_ITEM,
  UPDATE_OFFLINE,
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR,
  OPEN_MODAL,
  CLOSE_MODAL,
  STORAGE_AVAILABILITY,
  UPDATE_DRAWER_STATE
} from '../actions/app.js'

const INITIAL_STATE = {
  page: '',
  item: '',
  modal: {
    id: '',
    open: false,
    props: {}
  },
  StorageAvailability: {
    local: false,
    session: false
  },
  offline: false,
  loading: false,
  drawerOpened: false,
  snackbarOpened: false
}

const app = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_PAGE:
      return {
        ...state,
        page: action.page
      }
    case UPDATE_ITEM:
      return {
        ...state,
        item: action.item
      }
    case UPDATE_OFFLINE:
      return {
        ...state,
        offline: action.offline
      }
    case UPDATE_DRAWER_STATE:
      return {
        ...state,
        drawerOpened: action.opened
      }
    case OPEN_SNACKBAR:
      return {
        ...state,
        snackbarOpened: true
      }
    case CLOSE_SNACKBAR:
      return {
        ...state,
        snackbarOpened: false
      }
    case OPEN_MODAL:
      return {
        ...state,
        modal: {
          open: true,
          id: action.id,
          props: action.props
        }
      }
    case CLOSE_MODAL:
      return {
        ...state,
        modal: {
          open: false,
          id: '',
          props: {}
        }
      }
    case STORAGE_AVAILABILITY:
      return {
        ...state,
        StorageAvailability: {
          local: action.local,
          session: action.session
        }
      }
    default:
      return state
  }
}

export default app
