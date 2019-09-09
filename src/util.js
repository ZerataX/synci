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
