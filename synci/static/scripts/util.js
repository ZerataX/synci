export async function jsonFetch (url, accessToken = null, method = 'GET', body = null) {
  let myHeaders = new window.Headers()
  myHeaders.append('Content-Type', 'application/json')
  if (accessToken) {
    myHeaders.append('Content-Type', `Authorization: Bearer ${accessToken}`)
  }

  let response = await window.fetch(url, {
    method: method,
    headers: myHeaders,
    body: body
  })
  let data = await response.json()

  return data
}
