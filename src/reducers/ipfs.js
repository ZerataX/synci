import {
  REQUEST_IPFS,
  REQUEST_PUBSUB,
  RECEIVED_IPFS,
  RECEIVED_PUBSUB,
  FAIL_IPFS,
  FAIL_PUBSUB
} from '../actions/ipfs.js'

const INITIAL_STATE = {
  node: null, // ipfs node
  Room: null, // constructor
  room: null, // current pubsub room
  ipfsFetching: false,
  pubsubFetching: false,
  isConnecting: false,
  failure: false
}

const ipfs = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUEST_IPFS:
      return {
        ...state,
        ipfsFetching: true,
        failure: false
      }
    case RECEIVED_IPFS:
      return {
        ...state,
        ipfsFetching: false,
        failure: false,
        node: action.ipfs
      }
    case FAIL_IPFS:
      return {
        ...state,
        ipfsFetching: false,
        failure: true
      }
    case REQUEST_PUBSUB:
      return {
        ...state,
        pubsubFetching: true,
        failure: false
      }
    case RECEIVED_PUBSUB:
      return {
        ...state,
        pubsubFetching: false,
        failure: false,
        Room: action.Room
      }
    case FAIL_PUBSUB:
      return {
        ...state,
        pubsubFetching: false,
        failure: true
      }
    default:
      return state
  }
}

export default ipfs
