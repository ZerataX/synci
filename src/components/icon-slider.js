import { LitElement, html, css } from 'lit-element'

class IconSlider extends LitElement {
  static get properties () {
    return {
      iconStart: { type: String },
      iconEnd: { type: String },
      heading: { type: String },
      value: { type: Number }
    }
  }

  static get styles () {
    return css`
      .slider {
        width: 100%;
        display: flex;
        justify-content:center;
        align-items:center;
      }
      #heading {
        color: rgb(115, 115, 115);
        font-size: 12px;
        pointer-events: none;
      }
      paper-slider {
          width: 100%;
        }
    `
  }

  constructor () {
    super()
    this.iconStart = ''
    this.iconEnd = ''
    this.heading = ''
    this.value = 20
  }

  render () {
    return html`
      <custom-style>
        <style include="paper-material-styles">
            .active {
                color: blue !important;
            }
        </style>
      </custom-style>

      <label id="heading" aria-hidden="true">${this.heading}</label>
      <span class="slider">
        <iron-icon icon="${this.iconStart}"></iron-icon>
        <paper-slider id="slider" pin value="${this.value}"></paper-slider>
        <iron-icon icon="${this.iconEnd}"></iron-icon>
      </span>
    `
  }

  firstUpdated () {
    const slider = this.shadowRoot.getElementById('slider')
    const heading = this.shadowRoot.querySelector('#heading')
    const observer = new window.MutationObserver(() => {
      if (slider.hasAttribute('pressed')) {
        heading.classList.add('active')
      } else {
        heading.classList.remove('active')
      }
      this.value = slider.getAttribute('value')
      this.dispatchEvent(
        new window.CustomEvent(
          'volume-changed', {
            detail: { volume: this.value },
            bubbles: true,
            composed: true
          }
        )
      )
    })
    observer.observe(slider, { attributes: true })
  }
}
window.customElements.define('icon-slider', IconSlider)
