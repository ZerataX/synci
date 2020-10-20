import { WEBSOCKET_ADDR } from '../../config.js'

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