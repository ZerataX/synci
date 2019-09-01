export class NoResponseBody extends Error {
  constructor (message) {
    super(message)
    this.name = this.constructor.name
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = (new Error(message)).stack
    }
  }
}

export async function jsonFetch (url, accessToken = null, method = 'GET', body = null) {
  const headers = new window.Headers()
  headers.append('Content-Type', 'application/json')
  if (accessToken) {
    headers.append('Authorization', `Bearer ${accessToken}`)
  }
  const request = new window.Request(url, {
    method: method,
    headers: headers,
    body: body
  })
  const response = await window.fetch(request)
  const data = await response
  if (data.status === 204) {
    throw new NoResponseBody('successful, but no json response')
  }

  return data.json()
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
