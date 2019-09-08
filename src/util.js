export const createPopUp = (url, windowName) => {
  const newwindow = window.open(url, windowName, 'height=800,width=400')
  if (window.focus) { newwindow.focus() }
  return newwindow
}
