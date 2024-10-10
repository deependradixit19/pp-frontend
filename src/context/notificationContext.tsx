import React, { createContext, FC, useContext, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { useNotifications } from '../services/notifications/notificationService'
import 'react-toastify/dist/ReactToastify.min.css'
import { useUserContext } from './userContext'

export const NotificationContext = createContext<any>({})

export const NotificationProvider: FC<{
  children: React.ReactElement
}> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)

  useNotifications(token)

  return (
    <NotificationContext.Provider value={{ setToken }}>
      <div className='notificationsWrapper'>
        <ToastContainer autoClose={false} closeButton={false} hideProgressBar={false} />
      </div>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationContext = () => useContext(NotificationContext)
