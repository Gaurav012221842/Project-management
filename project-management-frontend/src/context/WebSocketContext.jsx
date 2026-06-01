// src/context/WebSocketContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useSelector } from 'react-redux'
import { selectToken } from '../features/auth/authSlice'
import appConfig from '../config/appConfig'

const WebSocketContext = createContext(null)

export function WebSocketProvider({ children }) {
  const token       = useSelector(selectToken)
  const clientRef   = useRef(null)
  const [connected, setConnected] = useState(false)
  const subscriptions = useRef({})

  useEffect(() => {
    if (!token) return

    const client = new Client({
      webSocketFactory: () => new SockJS(`${appConfig.wsUrl}`),
      connectHeaders:   { Authorization: `Bearer ${token}` },
      reconnectDelay:   5000,
      onConnect:    ()  => setConnected(true),
      onDisconnect: ()  => setConnected(false),
      onStompError: (frame) => console.error('STOMP error', frame),
    })

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
      setConnected(false)
    }
  }, [token])

  const subscribe = useCallback((destination, callback) => {
    const client = clientRef.current
    if (!client?.connected) return () => {}
    if (subscriptions.current[destination]) {
      subscriptions.current[destination].unsubscribe()
    }
    const sub = client.subscribe(destination, (msg) => {
      try { callback(JSON.parse(msg.body)) } catch { callback(msg.body) }
    })
    subscriptions.current[destination] = sub
    return () => { sub.unsubscribe(); delete subscriptions.current[destination] }
  }, [])

  const publish = useCallback((destination, body) => {
    clientRef.current?.publish({
      destination,
      body: JSON.stringify(body),
    })
  }, [])

  return (
    <WebSocketContext.Provider value={{ connected, subscribe, publish }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocketContext() {
  return useContext(WebSocketContext)
}

export default WebSocketContext
