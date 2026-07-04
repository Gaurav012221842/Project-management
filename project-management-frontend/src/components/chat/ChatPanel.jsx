// src/components/chat/ChatPanel.jsx
import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams }                from 'react-router-dom'
import { motion, AnimatePresence }  from 'framer-motion'
import {
  PhoneIcon,
  PhoneXMarkIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  VideoCameraIcon,
  VideoCameraSlashIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

// Components
import ChatHeader   from './ChatHeader'
import ChatMessages from './ChatMessages'
import ChatInput    from './ChatInput'

// Redux
import {
  fetchMessages,
  loadMoreMessages,
  addMessage,
  setTypingUser,
  setUserOnlineStatus,
  clearChat,
  selectMessages,
  selectTypingUsers,
  selectOnlineUsers,
  selectChatLoading,
  selectHasMore,
  selectCurrentPage,
} from '../../features/chat/chatSlice'

import { selectUser } from '../../features/auth/authSlice'

// Hooks
import { useWebSocket } from '../../hooks/useWebSocket'

export default function ChatPanel({
  isOpen,
  onClose
}) {
  const dispatch      = useDispatch()
  const { projectId } = useParams()
  const currentUser   = useSelector(selectUser)

  // Redux State
  const messages    = useSelector(selectMessages)
  const typingUsers = useSelector(selectTypingUsers)
  const onlineUsers = useSelector(selectOnlineUsers)
  const loading     = useSelector(selectChatLoading)
  const hasMore     = useSelector(selectHasMore)
  const currentPage = useSelector(selectCurrentPage)

  const [isTyping, setIsTyping] = useState(false)
  const [activeCall, setActiveCall] = useState(null)
  const [callState, setCallState] = useState('idle')
  const [callType, setCallType] = useState('audio')
  const [micEnabled, setMicEnabled] = useState(true)
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [remoteMediaReady, setRemoteMediaReady] = useState(false)
  const typingTimeoutRef        = useRef(null)
  const localVideoRef           = useRef(null)
  const remoteVideoRef          = useRef(null)
  const remoteAudioRef          = useRef(null)
  const peerConnectionRef       = useRef(null)
  const localStreamRef          = useRef(null)
  const pendingIceCandidatesRef = useRef([])
  const offerSentRef            = useRef(false)
  const handledRemoteOfferRef   = useRef('')
  const handledRemoteAnswerRef  = useRef('')
  const currentUserRef          = useRef(currentUser)
  const callStateRef            = useRef(callState)
  const callTypeRef             = useRef(callType)

  const isOwnCallEvent = useCallback((data) => {
    const sender = data?.from?.toString().toLowerCase()
    const email = currentUserRef.current?.email?.toLowerCase()
    const username = currentUserRef.current?.username?.toLowerCase()
    return Boolean(sender && (sender === email || sender === username))
  }, [])

  // ============================
  // WebSocket Handlers
  // ============================
  const handleNewMessage = useCallback((msg) => {
    dispatch(addMessage(msg))
  }, [dispatch])

  const handleTyping = useCallback((data) => {
    if (data.userId !== currentUser?.id) {
      dispatch(setTypingUser(data))
    }
  }, [dispatch, currentUser])

  const handleUserStatus = useCallback((data) => {
    dispatch(setUserOnlineStatus(data))
  }, [dispatch])

  const handleIncomingCall = useCallback((data) => {
    if (!data?.event || isOwnCallEvent(data)) return
    setActiveCall(data)
  }, [isOwnCallEvent])

  const { isConnected, sendMessage, sendTyping, sendCallRequest, sendCallEvent } =
    useWebSocket({
      projectId,
      onMessage:    handleNewMessage,
      onTyping:     handleTyping,
      onUserStatus: handleUserStatus,
      onCall:       handleIncomingCall,
    })

  // ============================
  // Fetch Initial Messages
  // ============================
  useEffect(() => {
    if (projectId) {
      dispatch(fetchMessages({
        projectId,
        page:      0
      }))
    }
    return () => dispatch(clearChat())
  }, [projectId, dispatch])

  // ============================
  // Load More (Pagination)
  // ============================
  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      dispatch(loadMoreMessages({
        projectId,
        page:      currentPage + 1
      }))
    }
  }, [hasMore, loading, projectId, currentPage])

  // ============================
  // Send Message
  // ============================
  const handleSendMessage = useCallback((
    content,
    type = 'TEXT'
  ) => {
    if (!content.trim()) return
    sendMessage(content, type)

    // Stop typing
    if (isTyping) {
      setIsTyping(false)
      sendTyping(false)
    }
  }, [sendMessage, sendTyping, isTyping])

  // ============================
  // Typing Handler
  // ============================
  const handleTypingStart = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true)
      sendTyping(true)
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      sendTyping(false)
    }, 2000)
  }, [isTyping, sendTyping])

  const cleanupCall = useCallback(() => {
    peerConnectionRef.current?.close()
    peerConnectionRef.current = null

    localStreamRef.current?.getTracks().forEach((track) => track.stop())
    localStreamRef.current = null
    pendingIceCandidatesRef.current = []
    offerSentRef.current = false
    handledRemoteOfferRef.current = ''
    handledRemoteAnswerRef.current = ''
    setRemoteMediaReady(false)
    setCallState('idle')
    setActiveCall(null)
    setMicEnabled(true)
    setCameraEnabled(true)
  }, [])

  const ensureLocalMedia = useCallback(async (type) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === 'video',
      })
      localStreamRef.current = stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      return stream
    } catch (error) {
      toast.error(type === 'video'
        ? 'Camera and microphone access are required for video calls.'
        : 'Microphone access is required to start a call.')
      return null
    }
  }, [])

  const applyPendingIceCandidates = useCallback(async (connection) => {
    const pending = pendingIceCandidatesRef.current
    pendingIceCandidatesRef.current = []
    for (const candidate of pending) {
      await connection.addIceCandidate(new window.RTCIceCandidate(candidate))
    }
  }, [])

  const createPeerConnection = useCallback(async (type) => {
    const connection = new window.RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    })

    connection.onicecandidate = (event) => {
      if (event.candidate) {
        sendCallEvent('ICE', {
          candidate: event.candidate,
          from: currentUserRef.current?.id || 'anonymous',
        })
      }
    }

    connection.ontrack = (event) => {
      const [remoteStream] = event.streams
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream
      }
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream
      }
      setRemoteMediaReady(true)
    }

    connection.onconnectionstatechange = () => {
      if (connection.connectionState === 'connected') {
        setCallState('connected')
      }

      if (connection.connectionState === 'disconnected' || connection.connectionState === 'failed' || connection.connectionState === 'closed') {
        cleanupCall()
      }
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        connection.addTrack(track, localStreamRef.current)
      })
    }

    peerConnectionRef.current = connection
    return connection
  }, [cleanupCall, sendCallEvent])

  const handleStartCall = useCallback(async (type) => {
    if (callStateRef.current !== 'idle') {
      toast.error('Finish the current call before starting another one.')
      return
    }

    const label = type === 'video' ? 'Video' : 'Audio'
    setCallType(type)
    setCallState('calling')
    setActiveCall({ type, from: currentUser?.email || 'You', message: `${label} call requested` })

    const stream = await ensureLocalMedia(type)
    if (!stream) {
      setCallState('idle')
      setActiveCall(null)
      return
    }

    await createPeerConnection(type)
    sendCallRequest(type)
    toast.success(`${label} call request sent to this project chat.`)
  }, [createPeerConnection, currentUser, ensureLocalMedia, sendCallRequest])

  const handleAcceptCall = useCallback(async () => {
    if (!activeCall) return
    setCallState('connecting')
    const stream = await ensureLocalMedia(callType)
    if (!stream) {
      setCallState('idle')
      setActiveCall(null)
      return
    }

    const connection = await createPeerConnection(callType)
    sendCallEvent('ACCEPT', {
      type: callType,
      from: currentUserRef.current?.id || 'anonymous',
    })
    await applyPendingIceCandidates(connection)
  }, [activeCall, callType, createPeerConnection, ensureLocalMedia, sendCallEvent])

  const handleDeclineCall = useCallback(() => {
    sendCallEvent('REJECT', { from: currentUserRef.current?.id || 'anonymous' })
    cleanupCall()
  }, [cleanupCall, sendCallEvent])

  const handleEndCall = useCallback(() => {
    sendCallEvent('END', { from: currentUserRef.current?.id || 'anonymous' })
    cleanupCall()
  }, [cleanupCall, sendCallEvent])

  useEffect(() => {
    currentUserRef.current = currentUser
  }, [currentUser])

  useEffect(() => {
    const handleCallEvent = async (data) => {
      if (!data?.event || isOwnCallEvent(data)) return

      if (data.type) {
        setCallType(data.type)
        callTypeRef.current = data.type
      }

      if (data.event === 'REQUEST') {
        if (callStateRef.current !== 'idle') {
          sendCallEvent('BUSY', {
            type: data.type || callTypeRef.current,
            from: currentUserRef.current?.id || 'anonymous',
          })
          return
        }

        setCallType(data.type || 'audio')
        setCallState('incoming')
        toast.success(data.message || `Incoming ${data.type || 'call'} from ${data.from}`)
        return
      }

      if (data.event === 'BUSY') {
        toast.error(`${data.from || 'The recipient'} is already in another call.`)
        cleanupCall()
        return
      }

      if (data.event === 'ACCEPT' && callStateRef.current === 'calling') {
        if (offerSentRef.current) return

        setCallState('connecting')
        const type = data.type || callTypeRef.current
        const stream = localStreamRef.current || await ensureLocalMedia(type)
        if (!stream) return
        const connection = peerConnectionRef.current || await createPeerConnection(type)
        if (connection.signalingState !== 'stable') return

        const offer = await connection.createOffer()
        await connection.setLocalDescription(offer)
        offerSentRef.current = true
        sendCallEvent('OFFER', {
          type,
          sdp: offer,
          from: currentUserRef.current?.id || 'anonymous',
        })
        await applyPendingIceCandidates(connection)
        return
      }

      if (data.event === 'OFFER') {
        if (callStateRef.current !== 'connecting' && callStateRef.current !== 'incoming') {
          return
        }

        const type = data.type || callTypeRef.current
        const stream = localStreamRef.current || await ensureLocalMedia(type)
        if (!stream) return
        const connection = peerConnectionRef.current || await createPeerConnection(type)
        const offerKey = data.sdp?.sdp || JSON.stringify(data.sdp)
        if (offerKey && handledRemoteOfferRef.current === offerKey) return
        if (connection.signalingState !== 'stable' && connection.signalingState !== 'have-remote-offer') {
          return
        }

        await connection.setRemoteDescription(new window.RTCSessionDescription(data.sdp))
        if (connection.signalingState !== 'have-remote-offer') {
          return
        }

        handledRemoteOfferRef.current = offerKey
        const answer = await connection.createAnswer()
        await connection.setLocalDescription(answer)
        sendCallEvent('ANSWER', {
          type,
          sdp: answer,
          from: currentUserRef.current?.id || 'anonymous',
        })
        await applyPendingIceCandidates(connection)
        setCallState('connecting')
        return
      }

      if (data.event === 'ANSWER' && peerConnectionRef.current) {
        const connection = peerConnectionRef.current
        const answerKey = data.sdp?.sdp || JSON.stringify(data.sdp)
        if (!offerSentRef.current) return
        if (answerKey && handledRemoteAnswerRef.current === answerKey) return
        if (connection.signalingState !== 'have-local-offer') return

        await connection.setRemoteDescription(new window.RTCSessionDescription(data.sdp))
        handledRemoteAnswerRef.current = answerKey
        await applyPendingIceCandidates(connection)
        setCallState('connecting')
        return
      }

      if (data.event === 'ICE' && data.candidate) {
        if (peerConnectionRef.current?.remoteDescription) {
          await peerConnectionRef.current.addIceCandidate(new window.RTCIceCandidate(data.candidate))
        } else {
          pendingIceCandidatesRef.current.push(data.candidate)
        }
        return
      }

      if (data.event === 'REJECT' || data.event === 'END') {
        toast(data.event === 'REJECT' ? 'Call declined.' : 'Call ended.')
        cleanupCall()
      }
    }

    handleCallEvent(activeCall)
  }, [activeCall, applyPendingIceCandidates, cleanupCall, createPeerConnection, ensureLocalMedia, isOwnCallEvent, sendCallEvent])

  useEffect(() => {
    callStateRef.current = callState
  }, [callState])

  useEffect(() => {
    callTypeRef.current = callType
  }, [callType])

  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = micEnabled
      })
    }
  }, [micEnabled])

  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = cameraEnabled
      })
    }
  }, [cameraEnabled])

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      cleanupCall()
    }
  }, [cleanupCall])

  const callTitle = callState === 'incoming'
    ? 'Incoming call'
    : callState === 'calling'
      ? 'Ringing...'
      : callState === 'connecting'
        ? 'Connecting...'
        : 'Live call'
  const callerLabel = activeCall?.from || currentUser?.email || 'Project teammate'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{
            type:      'spring',
            damping:   25,
            stiffness: 200,
          }}
          className="fixed right-0 top-0 h-full
                      w-96 bg-white shadow-2xl
                      border-l border-gray-200
                      flex flex-col z-50"
        >
          {/* Header */}
          <ChatHeader
            isConnected={isConnected}
            onlineCount={onlineUsers.length}
            onClose={onClose}
            onStartCall={handleStartCall}
          />

          {callState !== 'idle' && (
            <div className="mx-3 mt-3 overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 text-white shadow-xl">
              <audio ref={remoteAudioRef} autoPlay playsInline />

              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${callState === 'connected' ? 'bg-emerald-400' : 'bg-amber-300'}`} />
                    <div className="truncate text-sm font-semibold">{callTitle}</div>
                  </div>
                  <div className="mt-0.5 truncate text-xs text-gray-400">
                    {callType === 'video' ? 'Video' : 'Audio'} with {callerLabel}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setMicEnabled((value) => !value)}
                    className={`rounded-full border p-2 transition-colors ${micEnabled ? 'border-white/15 bg-white/10' : 'border-red-400/40 bg-red-500/20 text-red-100'}`}
                    title={micEnabled ? 'Mute microphone' : 'Unmute microphone'}
                  >
                    {micEnabled ? <SpeakerWaveIcon className="h-4 w-4" /> : <SpeakerXMarkIcon className="h-4 w-4" />}
                  </button>
                  {callType === 'video' && (
                    <button
                      onClick={() => setCameraEnabled((value) => !value)}
                      className={`rounded-full border p-2 transition-colors ${cameraEnabled ? 'border-white/15 bg-white/10' : 'border-red-400/40 bg-red-500/20 text-red-100'}`}
                      title={cameraEnabled ? 'Turn camera off' : 'Turn camera on'}
                    >
                      {cameraEnabled ? <VideoCameraIcon className="h-4 w-4" /> : <VideoCameraSlashIcon className="h-4 w-4" />}
                    </button>
                  )}
                </div>
              </div>

              <div className="p-3">
                {callType === 'video' ? (
                  <div className="relative h-52 overflow-hidden rounded-xl border border-white/10 bg-black">
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className="h-full w-full object-cover"
                    />
                    {!remoteMediaReady && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-center">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-lg font-bold">
                          {callerLabel.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-sm font-semibold">{callerLabel}</div>
                        <div className="mt-1 text-xs text-gray-400">{callState === 'incoming' ? 'Wants to start video' : 'Waiting for video...'}</div>
                      </div>
                    )}
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute bottom-3 right-3 h-20 w-24 rounded-lg border border-white/20 bg-gray-800 object-cover shadow-lg"
                    />
                    {!cameraEnabled && (
                      <div className="absolute bottom-3 right-3 flex h-20 w-24 items-center justify-center rounded-lg bg-gray-800 text-gray-300">
                        <VideoCameraSlashIcon className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center rounded-xl border border-white/10 bg-gray-900 px-4 py-6 text-center">
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 text-xl font-bold">
                      {callerLabel.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-sm font-semibold">{callerLabel}</div>
                    <div className="mt-1 text-xs text-gray-400">
                      {callState === 'connected' ? 'Audio is live' : callState === 'incoming' ? 'Incoming audio call' : 'Setting up secure audio...'}
                    </div>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-center gap-2">
                  {callState === 'incoming' ? (
                    <>
                      <button
                        onClick={handleDeclineCall}
                        className="flex h-10 min-w-24 items-center justify-center gap-2 rounded-full bg-red-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                      >
                        <PhoneXMarkIcon className="h-4 w-4" />
                        Decline
                      </button>
                      <button
                        onClick={handleAcceptCall}
                        className="flex h-10 min-w-24 items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                      >
                        {callType === 'video' ? <VideoCameraIcon className="h-4 w-4" /> : <PhoneIcon className="h-4 w-4" />}
                        Accept
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-gray-300"
                        title="Call is shown inside chat"
                      >
                        <ArrowsPointingOutIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleEndCall}
                        className="flex h-10 min-w-28 items-center justify-center gap-2 rounded-full bg-red-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                      >
                        <PhoneXMarkIcon className="h-4 w-4" />
                        End call
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <ChatMessages
            messages={messages}
            currentUser={currentUser}
            typingUsers={typingUsers}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            projectId={projectId}
          />

          {/* Input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            onTyping={handleTypingStart}
            isConnected={isConnected}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
