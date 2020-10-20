import {
  subscribeRoom,
  leaveRoom
} from './websocket.js'

export const UPDATE_SESSION_HOST = 'UPDATE_SESSION_HOST'
export const REMOVE_SESSION_USER = 'REMOVE_SESSION_USER'
export const ADD_SESSION_USER = 'ADD_SESSION_USER'
export const UPDATE_SESSION_MEDIA = 'UPDATE_SESSION_MEDIA'
export const CREATE_SESSION = 'CREATE_SESSION'
export const CONNECT_SESSION = 'CONNECT_SESSION'
export const SESSION_LEFT = 'SESSION_LEFT'
export const SESSION_CONNECTED = 'SESSION_CONNECTED'

export const createSession = (name, host, mediaType, users = new Set(), media = {}, time = 0, duration = -1) => {
  return {
    type: CREATE_SESSION,
    name,
    host,
    mediaType,
    users,
    media,
    time,
    duration
  }
}

export const leaveSession = () => (dispatch, getState) => {
  dispatch(leaveRoom())
}

export const SessionLeft = () => {
  return {
    type: SESSION_LEFT
  }
}

export const changeMedia = (media, mediaType, duration, time = 0) => {
  return {
    type: UPDATE_SESSION_MEDIA,
    media,
    mediaType,
    duration,
    time
  }
}

export const seekTimestamp = (time) => {
  return {
    type: UPDATE_SESSION_MEDIA,
    time
  }
}


export const sessionConnected = (room) => (dispatch, getState) => {
  return new Promise((resolve) => {
    // if nobody already connected
    {
      const me = getState().user
      dispatch(changeHost(
        {
          host: {
            id: me.id,
            name: me.name,
            image: me.image,
            href: me.href
          }
        }
      ))
    }
    dispatch({
      type: SESSION_CONNECTED
    })
    return resolve()
  })
}

export const connectSession = (name) => (dispatch, getState) => {
  dispatch(subscribeRoom(name))
}

export const changeHost = (host) => {
  return {
    type: UPDATE_SESSION_HOST,
    host
  }
}
