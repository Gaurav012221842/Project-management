// src/config/appConfig.js
const API_URL = process.env.REACT_APP_API_URL || 'https://project-management-ac99.onrender.com/'
const WS_URL  = process.env.REACT_APP_WS_URL  || 'https://project-management-ac99.onrender.com/ws'

const splitCsv = (value) =>
  value
    ? value.split(',').map((item) => item.trim()).filter(Boolean)
    : []

const STUN_URLS = splitCsv(process.env.REACT_APP_WEBRTC_STUN_URLS)
const TURN_URLS = splitCsv(process.env.REACT_APP_WEBRTC_TURN_URLS)

const iceServers = [
  {
    urls: STUN_URLS.length
      ? STUN_URLS
      : ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'],
  },
]

if (TURN_URLS.length) {
  iceServers.push({
    urls: TURN_URLS,
    username: process.env.REACT_APP_WEBRTC_TURN_USERNAME,
    credential: process.env.REACT_APP_WEBRTC_TURN_CREDENTIAL,
  })
}

const appConfig = {
  apiUrl:       API_URL,
  wsUrl:        WS_URL,
  webRtc: {
    iceServers,
    iceTransportPolicy: process.env.REACT_APP_WEBRTC_ICE_TRANSPORT_POLICY || 'all',
  },
  appName:      'ProjAI',
  version:      '1.0.0',
  tokenKey:     'token',
  refreshKey:   'refreshToken',
  userKey:      'user',
  defaultTheme: 'light',
  pagination: {
    defaultPage: 0,
    defaultSize: 20,
  },
  upload: {
    maxSizeMB:       10,
    acceptedTypes:   ['image/*', 'application/pdf', '.doc', '.docx', '.xls', '.xlsx'],
  },
}

export default appConfig
