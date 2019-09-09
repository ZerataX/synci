export const createPopUp = (url, windowName, height = 800, width = 400) => {
  const newwindow = window.open(
    url,
    windowName,
    `height=${height},width=${width}`)
  if (window.focus) { newwindow.focus() }
  return newwindow
}
