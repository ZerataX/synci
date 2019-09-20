import { WEBSOCKET_MULTI_ADDR } from '../../config.js'

export const REQUEST_IPFS = 'REQUEST_IPFS'
export const REQUEST_PUBSUB = 'REQUEST_PUBSUB'
export const RECEIVED_IPFS = 'RECEIVED_IPFS'
export const RECEIVED_PUBSUB = 'RECEIVED_PUBSUB'
export const FAIL_IPFS = 'FAIL_IPFS'
export const FAIL_PUBSUB = 'FAIL_PUBSUB'
export const CONNECT_NODE = 'CONNECT_NODE'
export const CREATE_NODE = 'CREATE_NODE'
export const FAIL_NODE = 'FAIL_NODE'
export const SUBSCRIBE_ROOM = 'SUBSCRIBE_ROOM'
export const LEAVE_ROOM = 'LEAVE_ROOM'
export const BROADCAST_ROOM = 'BROADCAST_ROOM'
export const NEW_MESSAGE = 'NEW_MESSAGE'

export const leaveRoom = () => {
  return {
    type: LEAVE_ROOM
  }
}

export const subscribeRoom = (name) => {
  return {
    type: SUBSCRIBE_ROOM,
    name
  }
}

export const requestIpfs = () => {
  return {
    type: REQUEST_IPFS
  }
}

export const requestPubsub = () => {
  return {
    type: REQUEST_PUBSUB
  }
}

export const receivedIpfs = (ipfs) => {
  return {
    type: RECEIVED_IPFS,
    ipfs
  }
}

export const receivedPubsub = (Room) => {
  return {
    type: RECEIVED_PUBSUB,
    Room
  }
}

export const failIpfs = () => {
  return {
    type: FAIL_IPFS
  }
}

export const failPubsub = () => {
  return {
    type: FAIL_PUBSUB
  }
}

// based on: https://github.com/ipfs-shipyard/ipfs-companion/blob/master/docs/examples/window.ipfs-fallback.html
export const getIpfs = () => (dispatch, getState) => new Promise((resolve, reject) => {
  if (getState().ipfs.node) { return resolve() }
  dispatch(requestIpfs())
  if (window.ipfs) {
    if (window.ipfs.enable) {
      console.debug('window.ipfs.enable is available!')
      // improve UX by asking for permissions upfront
      dispatch(receivedIpfs(window.ipfs.enable({ commands: ['id', 'version'] })))
      return resolve()
    }
    console.debug('legacy window.ipfs is available!')
    dispatch(receivedIpfs(window.ipfs))
    return resolve()
  }
  console.debug('window.ipfs is not available, downloading js-ipfs...')
  const script = document.createElement('script')
  script.src = '/dist/js-ipfs.js'
  script.onload = () => {
    console.debug('starting IPFS node')
    const node = new window.Ipfs({
      EXPERIMENTAL: {
        pubsub: true
      },
      config: {
        Addresses: {
          Swarm: [
            WEBSOCKET_MULTI_ADDR
          ]
        }
      }
    })
    node.once('ready', () => {
      dispatch(receivedIpfs(node))
      return resolve()
    })
  }
  script.onerror = (error) => {
    dispatch(failIpfs())
    reject(error)
  }
  document.body.appendChild(script)
})

export const getPubsub = () => (dispatch, getState) => new Promise((resolve, reject) => {
  if (getState().ipfs.Room) { return resolve() }
  dispatch(requestPubsub())
  console.debug('loading IPFS-pubsub-room...')

  const script = document.createElement('script')
  script.src = '/dist/ipfs-pubsub-room.js'
  script.onload = () => {
    const Room = window.IpfsPubsubRoom
    console.debug('received IPFS-pubsub-room')
    dispatch(receivedPubsub(Room))
    return resolve()
  }
  script.onerror = (error) => {
    dispatch(failPubsub())
    return reject(error)
  }
  document.body.appendChild(script)
})
