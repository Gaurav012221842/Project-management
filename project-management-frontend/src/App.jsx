// src/app/App.jsx
import { BrowserRouter }       from 'react-router-dom'
import { Provider }            from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster }             from 'react-hot-toast'
import store                   from './store'
import queryClient             from '../config/queryClient'
import AppRoutes               from '../routes'

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color:      '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                }
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                }
              }
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  )
}

// ================================
