export const saveState = (state) => {
  const jsonLocal = window.localStorage.getItem('__synci__') || '{}'
  const jsonSession = window.sessionStorage.getItem('__synci__') || '{}'
  // seperate temporary from permament data
  const stateTemp = {
    session: Object.assign({}, state.session)
  }
  const statePerm = {
    user: Object.assign({}, state.user)
  }

  if (statePerm.user) {
    delete statePerm.user.isFetching
    delete statePerm.user.failure
  }
  if (stateTemp.session) {
    delete stateTemp.session.time
    delete stateTemp.session.connecting
    delete stateTemp.session.isConnected
    stateTemp.session.users = (stateTemp.session.users) ? [...stateTemp.session.users] : new Set()
  }

  const stringifiedNewStatePerm = JSON.stringify(statePerm)
  const stringifiedNewStateTemp = JSON.stringify(stateTemp)

  if (stringifiedNewStatePerm !== jsonLocal && stringifiedNewStatePerm !== '{}') {
    window.localStorage.setItem('__synci__', stringifiedNewStatePerm)
  }
  if (stringifiedNewStateTemp !== jsonSession && stringifiedNewStateTemp !== '{}') {
    window.sessionStorage.setItem('__synci__', stringifiedNewStateTemp)
  }
}

export const loadState = () => {
  const jsonLocal = window.localStorage.getItem('__synci__') || '{}' // permanent state
  const jsonSession = window.sessionStorage.getItem('__synci__') || '{}' // session state

  const statePerm = (window.location.hash.includes('develop')) ? {} : JSON.parse(jsonLocal)
  const stateTemp = JSON.parse(jsonSession)

  if (stateTemp.session) {
    try {
      stateTemp.session.users = new Set(stateTemp.session.users)
    } catch (error) {
      stateTemp.session.users = new Set()
    }
  }
  const state = Object.assign(statePerm, stateTemp)

  return state
}
