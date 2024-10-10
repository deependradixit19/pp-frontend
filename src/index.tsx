import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import i18n from './services/i18n/i18n'

import Router from './routes'
import './_style.scss'
import './fonts/SF-Pro-Display/FontsFree-Net-SFProDisplay-Regular.ttf'

import { UserProvider } from './context/userContext'
import { ModalProvider } from './context/modalContext'
import { PreviewProvider } from './context/previewContext'
import { ProfileMarkerProvider } from './context/profileContext'

import { LoadingProvider } from './context/loadingContext'
import { NotificationProvider } from './context/notificationContext'
import { TrackingProvider } from './context/trackingContext'
import { GOOGLE_LOGIN_CLIENT_ID } from './constants/constants'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <ReactQueryDevtools initialIsOpen={false} />
          <TrackingProvider>
            <ModalProvider>
              <NotificationProvider>
                <PreviewProvider>
                  <ProfileMarkerProvider>
                    <LoadingProvider>
                      <I18nextProvider i18n={i18n}>
                        <Toaster position='bottom-left' reverseOrder={false} />
                        <GoogleOAuthProvider
                          clientId={GOOGLE_LOGIN_CLIENT_ID}
                          onScriptLoadError={() => console.error('Google script load failed')}
                        >
                          <Router />
                        </GoogleOAuthProvider>
                      </I18nextProvider>
                    </LoadingProvider>
                  </ProfileMarkerProvider>
                </PreviewProvider>
              </NotificationProvider>
            </ModalProvider>
          </TrackingProvider>
        </UserProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
)
