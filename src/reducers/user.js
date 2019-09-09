import {
  UPDATE_AUTH_STATE,
  UPDATE_USER_INFO,
  UPDATE_SPOTIFY_LOGIN,
  LOGOUT_SPOTIFY,
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
  id: ID(),
  authState: '',
  isFetching: false,
  failure: false,
  spotify: {
    accessToken: '',
    expirationDate: ''
  }
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
        name: action.name,
        image: action.image,
        href: action.href
      }
    case UPDATE_SPOTIFY_LOGIN:
      return {
        ...state,
        spotify: {
          accessToken: action.accessToken,
          expirationDate: action.expirationDate
        }
      }
    case LOGOUT_SPOTIFY:
      return {
        ...state,
        spotify: {}
      }
    case REQUEST_USER_INFO:
      return {
        ...state,
        isFetching: false,
        failure: false
      }
    case RECEIVE_USER_INFO:
      return {
        ...state,
        name: action.name,
        image: action.image,
        href: action.href,
        isFetching: true,
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
