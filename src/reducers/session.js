import {
  UPDATE_SESSION_HOST,
  REMOVE_SESSION_USER,
  ADD_SESSION_USER,
  UPDATE_SESSION_MEDIA,
  CREATE_SESSION,
  SESSION_LEFT,
  CONNECT_SESSION,
  SESSION_CONNECTED
} from '../actions/session.js'
import { User } from '../modules/auth.js'

const INITIAL_STATE = {
  name: '',
  mediaType: '',
  host: new User(),
  users: new Set(),
  media: {},
  time: -1,
  duration: -1,
  connected: false,
  isConnecting: false
}

const session = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_SESSION_HOST:
      return {
        ...state,
        host: new User(
          action.host.id,
          action.host.name,
          action.host.image,
          action.host.href
        )
      }
    case REMOVE_SESSION_USER:
      return {
        ...state,
        users: new Set([...state.users].filter(user => user.id === action.user))
      }
    case ADD_SESSION_USER:
      return {
        ...state,
        users: state.users.add(action.user)
      }
    case UPDATE_SESSION_MEDIA:
      return {
        ...state,
        media: action.media,
        mediaType: action.mediaType,
        time: action.time,
        duration: action.duration
      }
    case CREATE_SESSION:
      return {
        ...state,
        name: action.name,
        mediaType: action.mediaType,
        host: action.host,
        users: action.users,
        media: action.media,
        time: action.time,
        duration: action.duration
      }
    case CONNECT_SESSION:
      return {
        ...state,
        isConnecting: true
      }
    case SESSION_CONNECTED:
      return {
        ...state,
        isConnecting: false,
        connected: true
      }
    case SESSION_LEFT:
      return INITIAL_STATE
    default:
      return state
  }
}

export default session
