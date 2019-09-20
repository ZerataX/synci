import {
  SUBSCRIBE_ROOM,
  LEAVE_ROOM,
  BROADCAST_ROOM,
  NEW_MESSAGE
} from '../actions/ipfs.js'
import {
  changeHost,
  sessionConnected,
  leaveSession
} from '../actions/session.js'

// based on https://dev.to/aduranil/how-to-use-websockets-with-redux-a-step-by-step-guide-to-writing-understanding-connecting-socket-middleware-to-your-project-km3
const ipfsMiddleware = () => {
  let room = null
  // let Room = null // pubsub room constructor
  let node = null // ipfs node
  console.debug('middleware')

  const onSubscribed = (store, room) => {
    console.debug('Now connected')
    store.dispatch(sessionConnected(room))
  }

  const onPeerLeft = (store, peer) => {
    console.debug('Peer left', peer)
    // remove user from session
    // if no more users become host
  }

  const onPeerJoined = (store, peer) => {
    const session = store.getState().session
    console.debug('Peer joined', peer)
    if (session.host) {
      store.dispatch({
        type: NEW_MESSAGE,
        message: {
          type: 'change_host',
          host: session.host
          // user id to verify?
        }
      })
    }
  }

  const onMessage = store => (message) => {
    const payload = JSON.parse(message.data.toString())
    console.log('receiving message')

    switch (payload.type) {
      case 'change_host':
        console.debug(payload)
        store.dispatch(changeHost(payload.host))
        break
      case 'change_media':
        break
      case 'seek_timestamp':
        break
      case 'user_joined':
        break
      case 'user_left':
        break
      default:
        break
    }
  }

  // the middleware part of this function
  return store => next => action => {
    switch (action.type) {
      case SUBSCRIBE_ROOM:
        if (room !== null) {
          room.leave()
          store.dispatch(leaveSession())
        }

        // subscribe to the room
        // Room = store.getState().ipfs.Room
        node = store.getState().ipfs.node
        room = new store.getState().ipfs.Room(node, action.name) // eslint-disable-line new-cap

        // maybe? store.dispatch(setRoom(room))

        // websocket handlers
        room.on('subscribed', () => onSubscribed(store, room))
        room.on('message', (message) => onMessage(store, message))
        room.on('peer left', (peer) => onPeerLeft(store, peer))
        room.on('peer joined', (peer) => onPeerJoined(store, peer))

        break
      case LEAVE_ROOM:
        if (room !== null) {
          room.leave()
        }
        room = null
        store.dispatch(leaveSession())
        console.log('room left')
        break
      case BROADCAST_ROOM:
        console.log('sending a message', action.message)
        room.broadcast(JSON.stringify(action.message))
        break
      case NEW_MESSAGE:
        console.log('sending a message', action.message)
        room.sendTo(action.to, JSON.stringify(action.message))
        break
      default:
        return next(action)
    }
  }
}

export default ipfsMiddleware()
