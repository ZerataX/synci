import {
  createStore,
  compose,
  applyMiddleware,
  combineReducers
} from 'redux'
import thunk from 'redux-thunk'
import { lazyReducerEnhancer } from 'pwa-helpers/lazy-reducer-enhancer.js'

import { loadState, saveState } from './localStorage.js'
import app from './reducers/app.js'

const devCompose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(
  state => state,
  loadState(),
  devCompose(
    lazyReducerEnhancer(combineReducers),
    applyMiddleware(thunk))
)

// Initially loaded reducers.
store.addReducers({
  app
})

// This subscriber writes to local storage anytime the state updates.
store.subscribe(() => {
  saveState(store.getState())
})
