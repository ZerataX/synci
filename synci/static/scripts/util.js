export async function jsonFetch (url, accessToken = null, method = 'GET', body = null) {
  let headers = new window.Headers()
  headers.append('Content-Type', 'application/json')
  if (accessToken) {
    headers.append('Authorization', `Bearer ${accessToken}`)
  }
  let request = new window.Request(url, {
    method: method,
    headers: headers,
    body: body
  })

  let response = await window.fetch(request)
  let data = await response.json()

  return data
}

export function getCookie (name) {
  let value = '; ' + document.cookie
  let parts = value.split('; ' + name + '=')
  if (parts.length === 2) return parts.pop().split(';').shift()
}

export function setCookie (cname, cvalue, exhours) {
  let d = new Date()
  d.setTime(d.getTime() + (exhours * 60 * 60 * 1000))
  let expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}
