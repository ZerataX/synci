export const createPopUp = (url, windowName, height = 800, width = 400) => {
  const newwindow = window.open(
    url,
    windowName,
    `height=${height},width=${width}`)
  if (window.focus) { newwindow.focus() }
  return newwindow
}

export const getBaseUrl = () => {
  const dir = window.location.pathname.split('/')[1]
  // handle ipfs callback seperately
  if (dir === 'ipfs' || dir === 'ipns') {
    return window.encodeURI(`${document.baseURI}`)
  }

  return window.encodeURI(`${window.location.protocol}//${window.location.host}/`)
}

export function storageAvailable (type) {
  var storage
  try {
    storage = window[type]
    var x = '__storage_test__'
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (e) {
    return e instanceof window.DOMException && (
    // everything except Firefox
      e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
          // acknowledge QuotaExceededError only if there's something already stored
          (storage && storage.length !== 0)
  }
}

export function getCookie (name) {
  const value = '; ' + document.cookie
  const parts = value.split('; ' + name + '=')
  if (parts.length === 2) return parts.pop().split(';').shift()
}

export function setCookie (cname, cvalue, exhours) {
  const d = new Date()
  d.setTime(Date.now() + (exhours * 60 * 60 * 1000))
  const expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}
