export const UPDATE_AUTH_STATE = 'UPDATE_AUTH_STATE'
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO'
export const UPDATE_SPOTIFY_LOGIN = 'UPDATE_SPOTIFY_LOGIN'
export const LOGOUT_SPOTIFY = 'LOGOUT_SPOTIFY'

export const updateAuthState = (authState) => {
  return {
    type: UPDATE_AUTH_STATE,
    authState
  }
}

export const updateUserInfo = (name, image = '', href = '') => {
  return {
    type: UPDATE_USER_INFO,
    name,
    image,
    href
  }
}

export const updateSpotify = (accessToken, expirationDate) => {
  return {
    type: UPDATE_SPOTIFY_LOGIN,
    accessToken,
    expirationDate
  }
}

export const logoutSpotify = () => {
  return {
    type: LOGOUT_SPOTIFY
  }
}