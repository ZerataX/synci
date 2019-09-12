/* global buffer */
import { LitElement, html, css } from 'lit-element'
import 'https://unpkg.com/ipfs/dist/index.min.js'
import 'https://bundle.run/buffer@5.4.2'

class SyncPlayer extends LitElement {
  static get properties () {
    return {
      mediaType: { type: String },
      media: { type: String },
      time: { type: Number },
      duration: { type: Number },
      host: { type: Boolean }
    }
  }

  static get styles () {
    return css`
    `
  }

  render () {
    return html`
    `
  }

  firstUpdated () {
    this.main()
  }

  async main () {
    const NODE = await window.Ipfs.create({
      EXPERIMENTAL: {
        pubsub: true
      },
      config: {
        Addresses: {
          Swarm: [
            '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
          ]
        }
      }
    })
    const topic = 'fruit-of-the-day'
    const receiveMsg = (msg) => console.log(msg.data.toString())

    console.log(NODE)
    NODE.pubsub.subscribe(topic, receiveMsg, (err) => {
      if (err) {
        return console.error(`failed to subscribe to ${topic}`, err)
      }
      console.log(`subscribed to ${topic}`)
    })
    const msg = buffer.Buffer('hey')

    NODE.pubsub.publish(topic, msg, (err) => {
      if (err) {
        return console.error(`failed to publish to ${topic}`, err)
      }
      // msg was broadcasted
      console.log(`published to ${topic}`)
    })

    NODE.pubsub.peers(topic, (err, peerIds) => {
      if (err) {
        return console.error(`failed to get peers subscribed to ${topic}`, err)
      }
      console.log(peerIds)
    })
  }
}
window.customElements.define('sync-player', SyncPlayer)
