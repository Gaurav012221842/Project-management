// src/app/App.jsx
import { BrowserRouter }       from 'react-router-dom'
import { Provider }            from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster }             from 'react-hot-toast'
import store                   from './store'
import queryClient             from '../config/queryClient'
import AppRoutes               from '../routes'
import GlobalLoader            from '../components/common/Loader/GlobalLoader'
import ScrollToTop             from '../components/common/ScrollToTop'
import { ThemeProvider }       from '../context/ThemeContext'

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter>
          <ScrollToTop />
          <AppRoutes />
          <GlobalLoader />

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            gutter={12}
            containerStyle={{
              top:   20,
              right: 20,
            }}
            toastOptions={{
              duration: 4000,
              style: {
                background:   '#fff',
                color:        '#374151',
                padding:      '14px 16px',
                borderRadius: '16px',
                boxShadow:    '0 10px 40px rgba(0,0,0,0.12)',
                fontSize:     '14px',
                fontWeight:   '500',
                maxWidth:     '380px',
                border:       '1px solid #f3f4f6',
              },
              success: {
                iconTheme: {
                  primary:   '#6366f1',
                  secondary: '#fff',
                },
                style: {
                  borderLeft: '4px solid #6366f1',
                },
              },
              error: {
                iconTheme: {
                  primary:   '#ef4444',
                  secondary: '#fff',
                },
                style: {
                  borderLeft: '4px solid #ef4444',
                },
              },
            }}
          />
        </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  )
}