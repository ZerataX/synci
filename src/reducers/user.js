import {
  UPDATE_AUTH_STATE,
  UPDATE_USER_INFO,
  RESET_USER_INFO,
  REQUEST_USER_INFO,
  RECEIVE_USER_INFO,
  FAIL_USER_INFO
} from '../actions/user.js'

const ID = function () {
  return '_' + Math.random().toString(36).substr(2, 9)
}

const INITIAL_STATE = {
  name: '',
  image: '',
  href: '',
  volume: 20,
  overwrite: false,
  id: ID(),
  authState: '',
  isFetching: false,
  failure: false,
  logins: {}
}

const user = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_AUTH_STATE:
      return {
        ...state,
        authState: action.authState
      }
    case UPDATE_USER_INFO:
      return {
        ...state,
        name: (action.overwrite || !state.name) ? action.name : state.name,
        image: (action.overwrite || !state.image) ? action.image : state.image,
        href: (action.overwrite || !state.href) ? action.href : state.href,
        volume: (action.overwrite || !state.volume) ? action.volume : state.volume,
        overwrite: action.overwrite
      }
    case RESET_USER_INFO:
      return {
        ...state,
        name: '',
        image: '',
        href: '',
        volume: 20,
        overwrite: false
      }
    case REQUEST_USER_INFO:
      return {
        ...state,
        isFetching: true,
        failure: false
      }
    case RECEIVE_USER_INFO:
      return {
        ...state,
        name: action.name,
        image: action.image,
        href: action.href,
        isFetching: false,
        failure: false
      }
    case FAIL_USER_INFO:
      return {
        ...state,
        isFetching: false,
        failure: true
      }
    default:
      return state
  }
}

export default user
