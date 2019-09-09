export const UPDATE_SESSION_HOST = 'UPDATE_SESSION_HOST'
export const REMOVE_SESSION_USER = 'REMOVE_SESSION_USER'
export const ADD_SESSION_USER = 'ADD_SESSION_USER'
export const UPDATE_SESSION_MEDIA = 'UPDATE_SESSION_MEDIA'
export const CREATE_SESSION = 'CREATE_SESSION'
export const LEAVE_SESSION = 'LEAVE_SESSION'

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

export const leaveSession = () => {
  return {
    type: LEAVE_SESSION
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
