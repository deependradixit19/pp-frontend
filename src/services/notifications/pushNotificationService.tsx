import * as PusherPushNotifications from '@pusher/push-notifications-web'
import { useEffect } from 'react'

export const usePushNotifications = () => {
  const currentUserId = 1
  useEffect(() => {
    const beamsClient = new PusherPushNotifications.Client({
      instanceId: '6b9c0e87-0810-4970-8282-4f9e15b2219f'
    })
    // const beamsTokenProvider = new PusherPushNotifications.TokenProvider({
    //   url: 'YOUR_BEAMS_AUTH_URL_HERE',
    // });

    beamsClient
      .start()
      // .then(() => beamsClient.setUserId(`${currentUserId}`, beamsTokenProvider))
      .then(() => beamsClient.addDeviceInterest('hello'))
      .catch(console.error)

    return () => {
      beamsClient.stop().catch(console.error)
    }
  }, [])
}
