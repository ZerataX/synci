function msToMinSec (millis) {
  const minutes = Math.floor(millis / 60000)
  const seconds = ((millis % 60000) / 1000).toFixed(0)
  return `${minutes}:${(seconds < 10 ? '0' : '') + seconds}`
}

export async function updateSession (activeSession, activeUser) {
  console.debug('updating Session...')

  await activeSession.getInfo()
  if (!activeSession.host || String(activeUser.userID) === activeSession.host) {
    console.debug('... setting song...')

    await activeUser.getCurrentSong()
    if (activeUser.song) { // host is playing a song
      activeSession.setInfo(activeUser.song, activeUser)
    }
  } else {
    // api check active playback, but more requests?
    console.debug('... getting song...')

    const now = (new Date()).getTime()
    console.debug(`your song time: ${(activeUser.song) ? msToMinSec(activeUser.song.time) : 'no song'}`)
    console.debug(`session song time: ${msToMinSec(activeSession.song.time)}`)
    console.debug(`last update: ${Math.round((now - activeSession.timestamp) / 1000)} seconds ago`)
    
    if (activeUser.song) {
      activeUser.song.increaseTime() // time spent since last update
    }
    if (!activeUser.song || // no song is playing
        activeUser.song.uri !== activeSession.song.uri || // host changed to a new song
        Math.abs(activeUser.song.time - activeSession.song.time) > 20 * 1000) { // songs are not in sync
      console.debug(`updating song playback to ${activeSession.song.name} @ ${msToMinSec(activeSession.song.time)}`)
      activeUser.song = activeSession.song
      await activeUser.song.play()
    }
  }

  console.debug('... finished.')
}
