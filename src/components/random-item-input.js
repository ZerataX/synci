import { LitElement, html } from 'lit-element'

import { SharedStyles } from './shared-styles.js'

class RandomItemInput extends LitElement {
  static get properties () {
    return {
      listWords: { type: Array },
      placeholder: { type: String },
      value: { type: String },
      directory: { type: String }
    }
  }

  static get styles () {
    return [
      SharedStyles
    ]
  }

  constructor () {
    super()
    this.listWords = ['']
    this.word = ''
    this.value = ''
    this.placeholder = ''
    this.directory = ''
  }

  render () {
    return html`
      <input type="text" placeholder="${this.placeholder}" value="${this.value}" @input="${this.setInput}" >
      <a ?hidden="${!(this.value || this.word)}" href="${this.directory}/${this.value || this.word}">join session</a>
    `
  }

  firstUpdated (changedProperties) {
    this.newWord()
  }

  setInput (e) {
    this.value = e.target.value
  }

  randomWords () {
    let result = ''
    for (let index = 0; index < 3; index++) {
      const word = this.listWords[Math.floor(Math.random() * this.listWords.length)]
      if (word) {
        result += word.charAt(0).toUpperCase() + word.slice(1)
      }
    }

    return result
  }

  typeWriter (txt) {
    const index = (this.placeholder) ? this.placeholder.length : 0
    this.placeholder += txt.charAt(index)
    if (index < txt.length) {
      setTimeout(() => this.typeWriter(txt), 100)
    }
  }

  newWord () {
    if (this.word === '' || this.word.length === this.placeholder.length) {
      this.placeholder = ''
      this.word = this.randomWords()
      this.typeWriter(this.word)
    }
    setTimeout(() => this.newWord(), 3000)
  }
}

window.customElements.define('random-item-input', RandomItemInput)
