export const saveState = (state) => {
  const jsonLocal = window.localStorage.getItem('__synci__') || '{}'
  const jsonSession = window.sessionStorage.getItem('__synci__') || '{}'
  // seperate temporary from permament data
  const stateTemp = {
    session: state.session
  }
  const statePerm = {
    user: state.user
  }

  if (statePerm.user) {
    delete statePerm.user.isFetching
    delete statePerm.user.failure
  }
  if (stateTemp.session) {
    delete stateTemp.session.time
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

  const state = Object.assign(statePerm, stateTemp)

  return state
}
