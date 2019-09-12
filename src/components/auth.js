export class User {
    constructor(id, name, image, href) {
        this._id = id
        this._name = name
        this._image = image
        this._href = href
    }

    get id() {
        return this._id
    }
    get name() {
        return this._name
    }
    set name(name) {
        this._name = name
    }
    get image() {
        return this._image
    }
    set image(image) {
        this._image = image
    }
    get href() {
        return this._href
    }
    set href(href) {
        this._href = href
    }
}

export function loggedIn (accessToken, expirationDate) {
    if (accessToken) {
        if (expirationDate - Date.now() > 10 * 60 * 1000) {
            return true
        }
    }
    return false
}

export function createState () {
    const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let array = new Uint8Array(40)
    window.crypto.getRandomValues(array)
    array = array.map(x => validChars.charCodeAt(x % validChars.length))
    const randomState = String.fromCharCode.apply(null, array)

    return randomState
}