import {
  createStore,
  compose,
  applyMiddleware,
  combineReducers
} from 'redux'
import thunk from 'redux-thunk'
import ipfsMiddleware from './middleware/ipfsMiddleware.js'
import { lazyReducerEnhancer } from 'pwa-helpers/lazy-reducer-enhancer.js'
import { loadState, saveState } from './localStorage.js'
import app from './reducers/app.js'

const devCompose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const middleware = [thunk, ipfsMiddleware]

export const store = createStore(
  state => state,
  loadState(),
  devCompose(
    lazyReducerEnhancer(combineReducers),
    applyMiddleware(...middleware)
  )
)

// Initially loaded reducers.
store.addReducers({
  app
})

// This subscriber writes to local storage anytime the state updates.
store.subscribe(() => {
  saveState(store.getState())
})
