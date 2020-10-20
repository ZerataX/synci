export const UPDATE_AUTH_STATE = 'UPDATE_AUTH_STATE'
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO'
export const RESET_USER_INFO = 'RESET_USER_INFO'
export const REQUEST_USER_INFO = 'REQUEST_USER_INFO'
export const RECEIVE_USER_INFO = 'RECEIVE_USER_INFO'
export const FAIL_USER_INFO = 'FAIL_USER_INFO'


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