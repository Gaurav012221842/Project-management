// src/services/websocket/socketClient.js
import { Client }   from '@stomp/stompjs'
import SockJS       from 'sockjs-client'

const BASE_URL = process.env.REACT_APP_API_URL ||
                 'https://project-management-ac99.onrender.com/'

class SocketClient {
  constructor() {
    this.client      = null
    this.connected   = false
    this.subscribers = new Map()
  }

  // ============================
  // Connect
  // ============================
  connect(onConnect, onDisconnect) {
    const token = localStorage.getItem('token')

    this.client = new Client({
      webSocketFactory: () =>
        new SockJS(`${BASE_URL}/ws`),

      connectHeaders: {
        Authorization: `Bearer ${token}`
      },

      reconnectDelay:    5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: (frame) => {
        this.connected = true
        console.log('✅ WebSocket Connected')
        if (onConnect) onConnect(frame)
      },

      onDisconnect: () => {
        this.connected = false
        console.log('❌ WebSocket Disconnected')
        if (onDisconnect) onDisconnect()
      },

      onStompError: (frame) => {
        console.error('STOMP Error:', frame)
      },

      onWebSocketError: (error) => {
        console.error('WS Error:', error)
      },
    })

    this.client.activate()
  }

  // ============================
  // Disconnect
  // ============================
  disconnect() {
    if (this.client) {
      this.client.deactivate()
      this.connected = false
      this.subscribers.clear()
    }
  }

  // ============================
  // Subscribe
  // ============================
  subscribe(destination, callback) {
    if (!this.client?.connected) {
      console.warn('WS not connected')
      return null
    }

    const sub = this.client.subscribe(
      destination,
      (message) => {
        try {
          const data = JSON.parse(message.body)
          callback(data)
        } catch (e) {
          callback(message.body)
        }
      }
    )

    this.subscribers.set(destination, sub)
    return sub
  }

  // ============================
  // Unsubscribe
  // ============================
  unsubscribe(destination) {
    const sub = this.subscribers.get(destination)
    if (sub) {
      sub.unsubscribe()
      this.subscribers.delete(destination)
    }
  }

  // ============================
  // Publish
  // ============================
  publish(destination, body) {
    if (!this.client?.connected) {
      console.warn('WS not connected, cannot publish')
      return
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body)
    })
  }

  // ============================
  // Check Connection
  // ============================
  isConnected() {
    return this.connected &&
           this.client?.connected
  }
}

// Singleton instance
const socketClient = new SocketClient()
export default socketClient