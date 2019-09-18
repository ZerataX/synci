export const UPDATE_AUTH_STATE = 'UPDATE_AUTH_STATE'
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO'
export const RESET_USER_INFO = 'RESET_USER_INFO'
export const UPDATE_SPOTIFY_LOGIN = 'UPDATE_SPOTIFY_LOGIN'
export const LOGOUT_SPOTIFY = 'LOGOUT_SPOTIFY'
export const REQUEST_USER_INFO = 'REQUEST_USER_INFO'
export const RECEIVE_USER_INFO = 'RECEIVE_USER_INFO'
export const FAIL_USER_INFO = 'FAIL_USER_INFO'

const API_ENDPOINT = 'https://api.spotify.com/v1'

export const updateAuthState = (authState) => {
  return {
    type: UPDATE_AUTH_STATE,
    authState
  }
}

export const updateUserInfo = (name, image = '', href = '', volume = 20, overwrite = false) => {
  return {
    type: UPDATE_USER_INFO,
    name,
    image,
    href,
    volume,
    overwrite
  }
}

export const resetUserInfo = () => {
  return {
    type: RESET_USER_INFO
  }
}

const requestUserInfo = (service) => {
  return {
    type: REQUEST_USER_INFO,
    service
  }
}

const receiveUserInfo = (name, image, href) => {
  return {
    type: RECEIVE_USER_INFO,
    name,
    image,
    href
  }
}

const failUserInfo = () => {
  return {
    type: FAIL_USER_INFO
  }
}

// SPOTIFY
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

export const fetchSpotifyUserInfo = () => (dispatch, getState) => {
  const url = `${API_ENDPOINT}/me`
  const headers = new window.Headers()
  headers.append('Content-Type', 'application/json')
  headers.append('Authorization', `Bearer ${getState().user.spotify.accessToken}`)
  const request = new window.Request(url, {
    method: 'GET',
    headers: headers
  })
  return new Promise((resolve) => {
    if (!getState().user.isFetching) {
      dispatch(requestUserInfo('spotify'))
      return window.fetch(request)
        .then(res => res.json())
        .then(data => dispatch(receiveUserInfo(
          data.display_name || '',
          data.images.length ? data.images[0].url : null,
          data.external_urls.spotify
        )))
        .catch(() => dispatch(failUserInfo()))
    } else {
      return Promise.resolve()
    }
  })
}
