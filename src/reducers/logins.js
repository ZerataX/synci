import {
  UPDATE_SPOTIFY_LOGIN,
  LOGOUT_SPOTIFY,
} from '../actions/services/spotify.js'
  
const INITIAL_STATE = {
  spotify: {
      accessToken: '',
      expirationDate: ''
  }
}

const user = (state = INITIAL_STATE, action) => {
  switch (action.type) {
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
    default:
      return state
  }
}

export default user
  