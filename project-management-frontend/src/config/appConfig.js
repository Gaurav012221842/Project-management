// src/config/appConfig.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:9989'
const WS_URL  = process.env.REACT_APP_WS_URL  || 'http://localhost:9989/ws'

const appConfig = {
  apiUrl:       API_URL,
  wsUrl:        WS_URL,
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
