import Pusher from 'pusher-js'
import { useCallback, useEffect } from 'react'
import { useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import NotificationCard from '../../features/NotificationCard/NotificationCard'
import * as notificationTypes from './notificationTypes'
import { debounce } from '../../helpers/hooks'
import { useUserContext } from '../../context/userContext'

export const notificationTypesFilter = Object.values(notificationTypes).reduce(
  (p: { [k: string]: boolean }, c: string) => {
    p[c] = true
    return p
  },
  {}
)

export const useNotifications = (token: string | null) => {
  const { id: userId, setNotificationsChannel } = useUserContext()
  const queryClient = useQueryClient()
  const invalidateNotifications = useCallback(
    () =>
      debounce(() => {
        queryClient.invalidateQueries('pendingStats')
        queryClient.invalidateQueries('notifications')
      }, 300)(),
    [queryClient]
  )

  useEffect(() => {
    if (!process.env.REACT_APP_PUSHER_KEY || !process.env.REACT_APP_PUSHER_CLUSTER || !token || !userId) {
      return
    }
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: process.env.REACT_APP_PUSHER_CLUSTER,
      authEndpoint: `${process.env.REACT_APP_API_URL}/api/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    })

    const notificationsChannel = pusher.subscribe(`private-notification.${userId}`)

    setNotificationsChannel(notificationsChannel)

    Pusher.log = function (message) {
      if (window.console && window.console.log) {
        window.console.log(message)
      }
    }

    notificationsChannel.bind_global((eventName: string, data: any) => {
      if (!(eventName?.startsWith('pusher:') ?? true)) {
        if (notificationTypesFilter[data?.notification_type]) {
          invalidateNotifications()
          if (eventName === 'new-message-notification' && data.sender && window.location.href.includes('/chat/')) {
            const params = window.location.href.split('/chat/')[1]
            if (parseFloat(params) === parseFloat(data.sender.id)) return // Dont display chat notification if user is on same page from where it came
          }
          if (eventName === 'new-message-notification' && window.location.href.includes('/messages/inbox')) return // Dont display chat notifications on inbox page
          if (!document.hidden) {
            toast(
              () => (
                <NotificationCard data={data} type={data?.notification_type} time={data?.timestamp} isToast={true} />
              ),
              {
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                pauseOnFocusLoss: false,
                draggable: true,
                autoClose: 5000,
                progress: undefined
              }
            )
          }
        }
      }
    })

    return () => {
      pusher.unsubscribe(`private-notification.${userId}`)
    }
  }, [token, userId, invalidateNotifications, setNotificationsChannel])
}
