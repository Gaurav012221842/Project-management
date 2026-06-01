// src/hooks/useWebSocket.js
import {
  useEffect,
  useRef,
  useCallback,
  useState,
} from 'react'
import socketClient  from '../services/websocket/socketClient'
import { SOCKET_EVENTS } from '../services/websocket/socketEvents'

export function useWebSocket({
  projectId,
  onMessage,
  onTyping,
  onUserStatus,
  onNotification,
}) {
  const [isConnected, setIsConnected] =
    useState(false)
  const projectIdRef = useRef(projectId)

  useEffect(() => {
    projectIdRef.current = projectId
  }, [projectId])

  // ============================
  // Connect & Subscribe
  // ============================
  useEffect(() => {
    socketClient.connect(
      () => {
        setIsConnected(true)

        // Subscribe Chat
        if (onMessage) {
          socketClient.subscribe(
            SOCKET_EVENTS.CHAT.RECEIVE(projectId),
            onMessage
          )
        }

        // Subscribe Typing
        if (onTyping) {
          socketClient.subscribe(
            SOCKET_EVENTS.CHAT
              .TYPING_RECEIVE(projectId),
            onTyping
          )
        }

        // Subscribe User Status
        if (onUserStatus) {
          socketClient.subscribe(
            SOCKET_EVENTS.USER.STATUS(projectId),
            onUserStatus
          )
        }

        // Subscribe Notifications
        if (onNotification) {
          socketClient.subscribe(
            SOCKET_EVENTS.NOTIFICATION.RECEIVE,
            onNotification
          )
        }

        // Join project room
        socketClient.publish(
          SOCKET_EVENTS.USER.JOIN(projectId),
          {}
        )
      },
      () => {
        setIsConnected(false)
      }
    )

    return () => {
      // Leave project room
      socketClient.publish(
        SOCKET_EVENTS.USER.LEAVE(projectId),
        {}
      )

      // Unsubscribe all
      socketClient.unsubscribe(
        SOCKET_EVENTS.CHAT.RECEIVE(projectId)
      )
      socketClient.unsubscribe(
        SOCKET_EVENTS.CHAT.TYPING_RECEIVE(projectId)
      )
      socketClient.unsubscribe(
        SOCKET_EVENTS.USER.STATUS(projectId)
      )
    }
  }, [projectId])

  // ============================
  // Send Message
  // ============================
  const sendMessage = useCallback((content, type = 'TEXT') => {
    socketClient.publish(
      SOCKET_EVENTS.CHAT.SEND(
        projectIdRef.current
      ),
      { content, messageType: type }
    )
  }, [])

  // ============================
  // Send Typing
  // ============================
  const sendTyping = useCallback((isTyping) => {
    socketClient.publish(
      SOCKET_EVENTS.CHAT.TYPING(
        projectIdRef.current
      ),
      { isTyping }
    )
  }, [])

  return {
    isConnected,
    sendMessage,
    sendTyping,
  }
}