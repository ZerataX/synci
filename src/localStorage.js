export const saveState = (state) => {
  const json = window.localStorage.getItem('__synci__') || '{}'
  const savestate = { ...state }
  // don't save state for these actions
  delete savestate.app
  delete savestate.session

  const stringifiedNewState = JSON.stringify(savestate)

  if (stringifiedNewState !== json && stringifiedNewState !== '{}') {
    window.localStorage.setItem('__synci__', stringifiedNewState)
  }
}

export const loadState = () => {
  const json = window.localStorage.getItem('__synci__') || '{}'

  const state = JSON.parse(json)

  if (state) {
    if (window.location.hash.includes('develop')) {
      delete state.user
    }
    if (state.user) {
      state.user.isFetching = false
    }
  }

  return state
}
