export const UPDATE_SPOTIFY_LOGIN = 'UPDATE_SPOTIFY_LOGIN'
export const LOGOUT_SPOTIFY = 'LOGOUT_SPOTIFY'

const API_ENDPOINT = 'https://api.spotify.com/v1'


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
        return resolve()
      }
    })
  }
  