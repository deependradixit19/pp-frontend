import { useEffect, useState } from 'react'
import Pusher from 'pusher-js'
import { chatEvents } from './chatEvents'

export const useChatService = (token: string) => {
  const channelID = 1
  const [chatEventTrigger, setChatEventTrigger] = useState<any>(null)
  useEffect(() => {
    if (!process.env.REACT_APP_PUSHER_KEY || !process.env.REACT_APP_PUSHER_CLUSTER) return

    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: process.env.REACT_APP_PUSHER_CLUSTER
      // authEndpoint: 'https://api.beta.any-two.com/broadcasting/auth',
      //  auth: {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // },
    })
    const chatChannel = pusher.subscribe(`chat-channel-${channelID}`)

    chatEvents.forEach(chatEvent => {
      chatChannel.bind(chatEvent.chatEventType, function (data: any) {
        // chatEvent.chatCb(data)
      })
    })

    setChatEventTrigger({
      trigger: (eventName: any, data: any) => chatChannel.trigger(eventName, data)
    })

    return () => {
      pusher.unsubscribe(`chat-channel-${channelID}`)
    }
  }, [])

  return { chatEventTrigger }
}
