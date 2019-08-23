export async function jsonFetch (url) {
  let response = await window.fetch(url)
  let data = await response.json()
  return data
}
