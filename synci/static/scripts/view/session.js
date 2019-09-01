import { Session } from '../model/session.js'

export async function updateSession (name, activeUser) {
  let activeSession = new Session(name, activeUser.accessToken)
  await activeSession.getInfo()
  if (String(activeUser.userID) === activeSession.author) {
    await activeUser.getCurrentSong()
    activeSession.setInfo(activeUser.song, activeUser, [])
  } else {
    await activeSession.getInfo()
    activeUser.song = activeSession.song
    activeUser.song.play()
  }
}
