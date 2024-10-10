import { FC, useState, useEffect } from 'react'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import { useTranslation } from 'react-i18next'
import { addToast } from '../../../components/Common/Toast/Toast'

import {
  putNotifications,
  getNotificationSettings,
  updateNotificationSettings
} from '../../../services/endpoints/settings'

import WithHeaderSection from '../../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../../features/LayoutHeader/LayoutHeader'
import ActionCard from '../../../features/ActionCard/ActionCard'
import { useUserContext } from '../../../context/userContext'
import ChangeStateTabs from '../../../components/UI/ChangeStateTabs/ChangeStateTabs'
import styles from './EditNotifications.module.scss'

const EditNotifications: FC<{ type: string }> = ({ type }) => {
  const userData = useUserContext()
  const [notificationsSettingsType, setNotificationsSettingsType] = useState<string>('')
  const [notificationsSettings, setNotificationsSettings] = useState<{
    [key: string]: boolean
  }>({
    monthly_newsletter: false,
    show_full_notification_email: false
  })
  const [pushSettings, setPushSettings] = useState<{
    [key: string]: boolean
  }>({
    new_comment: false,
    new_like: false,
    new_subscriber: false,
    new_tip: false,
    new_premium_video_purchase: false,
    new_message_purchase: false,
    upcoming_stream_reminders: false,
    subscription_renewal: false,
    new_referal: false,
    incoming_friend_request: false,
    accepted_friend_request: false,
    new_tags: false,
    new_message: false,
    poll_responses: false
  })
  const [inAppSettings, setInAppSettings] = useState<{
    [key: string]: boolean
  }>({
    new_comment: false,
    new_like: false,
    new_subscriber: false,
    new_tip: false,
    new_premium_video_purchase: false,
    new_message_purchase: false,
    upcoming_stream_reminders: false,
    subscription_renewal: false,
    new_referal: false,
    incoming_friend_request: false,
    accepted_friend_request: false,
    new_tags: false,
    poll_responses: false
  })
  const [smsSettings, setSmsSettings] = useState<{
    [key: string]: boolean
  }>({
    upcoming_stream_reminders: false
  })
  const [emailSettings, setEmailSettings] = useState<{
    [key: string]: boolean
  }>({
    new_comment: false,
    new_like: false,
    new_subscriber: false,
    new_tip: false,
    new_premium_video_purchase: false,
    new_message_purchase: false,
    upcoming_stream_reminders: false,
    subscription_renewal: false,
    new_referal: false,
    incoming_friend_request: false,
    accepted_friend_request: false,
    new_tags: false,
    new_message: false,
    poll_responses: false
  })
  const [activeTab, setActiveTab] = useState<string>('creator')

  const [headerSwitchSettings, setHeaderSwitchSettings] = useState<{
    name: string
    value: boolean
  }>({
    name: '',
    value: false
  })

  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { data, error } = useQuery('notificationSettings', () => getNotificationSettings(), {
    refetchOnWindowFocus: false
  })

  const updateNotificationsPreferences = useMutation(
    () =>
      putNotifications({
        [headerSwitchSettings.name]: !headerSwitchSettings.value
      }),
    {
      onError: err => {
        addToast('error', t('error:errorSomethingWentWrong'))
      },
      onSuccess: () => {
        addToast('success', t('notificationsUpdated'))
        queryClient.invalidateQueries('notificationSettings')
      }
    }
  )

  const updateNotificationsCards = useMutation(
    (newNotificationSettings: { note: string; val: boolean }) =>
      updateNotificationSettings({
        type: notificationsSettingsType,
        [newNotificationSettings.note]: newNotificationSettings.val
      }),
    {
      onSuccess: () => queryClient.invalidateQueries('notificationSettings'),
      onError: err => {
        addToast('error', t('error:errorSomethingWentWrong'))
      }
    }
  )

  useEffect(() => {
    if (userData.role === 'model' && activeTab !== 'subscriptions') {
      const modelCheckSwitchStatus = () => {
        if (type === '?push-notifications') {
          setPushSettings({
            new_comment: data?.push?.new_comment,
            new_like: data?.push?.new_like,
            new_subscriber: data?.push?.new_subscriber,
            new_tip: data?.push?.new_tip,
            new_premium_video_purchase: data?.push?.new_premium_video_purchase,
            new_message_purchase: data?.push?.new_message_purchase,
            upcoming_stream_reminders: data?.push?.upcoming_stream_reminders,
            subscription_renewal: data?.push?.subscription_renewal,
            new_referal: data?.push?.new_referal,
            incoming_friend_request: data?.push?.incoming_friend_request,
            accepted_friend_request: data?.push?.accepted_friend_request,
            new_tags: data?.push?.new_tags,
            new_message: data?.push?.new_message,
            poll_responses: data?.push?.poll_responses
          })
          setNotificationsSettingsType('push')
          setHeaderSwitchSettings({
            name: 'push_notifications_enabled',
            value: data?.notificationSettings?.push_notifications_enabled
          })
        }
        if (type === '?in-app-notifications') {
          setInAppSettings({
            new_comment: data?.in_app?.new_comment,
            new_like: data?.in_app?.new_like,
            new_subscriber: data?.in_app?.new_subscriber,
            new_tip: data?.in_app?.new_tip,
            new_premium_video_purchase: data?.in_app?.new_premium_video_purchase,
            new_message_purchase: data?.in_app?.new_message_purchase,
            upcoming_stream_reminders: data?.in_app?.upcoming_stream_reminders,
            subscription_renewal: data?.in_app?.subscription_renewal,
            new_referal: data?.in_app?.new_referal,
            incoming_friend_request: data?.in_app?.incoming_friend_request,
            accepted_friend_request: data?.in_app?.accepted_friend_request,
            new_tags: data?.in_app?.new_tags,
            poll_responses: data?.in_app?.poll_responses
          })
          setNotificationsSettingsType('in_app')
          setHeaderSwitchSettings({
            name: 'in_app_notifications_enabled',
            value: data?.notificationSettings?.in_app_notifications_enabled
          })
        }
        if (type === '?sms-notifications') {
          setSmsSettings({
            upcoming_stream_reminders: data?.sms?.upcoming_stream_reminders
          })
          setNotificationsSettingsType('sms')
          setHeaderSwitchSettings({
            name: 'sms_notifications_enabled',
            value: data?.notificationSettings?.sms_notifications_enabled
          })
        }
        if (type === '?email-notifications') {
          setEmailSettings({
            new_comment: data?.email?.new_comment,
            new_like: data?.email?.new_like,
            new_subscriber: data?.email?.new_subscriber,
            new_tip: data?.email?.new_tip,
            new_premium_video_purchase: data?.email?.new_premium_video_purchase,
            new_message_purchase: data?.email?.new_message_purchase,
            upcoming_stream_reminders: data?.email?.upcoming_stream_reminders,
            subscription_renewal: data?.email?.subscription_renewal,
            new_referal: data?.email?.new_referal,
            incoming_friend_request: data?.email?.incoming_friend_request,
            accepted_friend_request: data?.email?.accepted_friend_request,
            new_tags: data?.email?.new_tags,
            new_message: data?.email?.new_message,
            poll_responses: data?.email?.poll_responses
          })
          setNotificationsSettings({
            monthly_newsletter: data?.email?.monthly_newsletter,
            show_full_notification_email: data?.email?.show_full_notification_email
          })
          setNotificationsSettingsType('email')
          setHeaderSwitchSettings({
            name: 'email_notifications_enabled',
            value: data?.notificationSettings?.email_notifications_enabled
          })
        }
      }
      modelCheckSwitchStatus()
    } else {
      const fanCheckSwitchStatus = () => {
        if (type === '?push-notifications') {
          setPushSettings({
            new_replies: data?.push?.new_replies,
            new_like: data?.push?.new_like,
            expired_subscription: data?.push?.expired_subscription,
            live_stream_invite: data?.push?.live_stream_invite,
            stream_started: data?.push?.stream_started,
            new_message: data?.push?.new_message
          })
          setNotificationsSettingsType('push')
          setHeaderSwitchSettings({
            name: 'push_notifications_enabled',
            value: data?.notificationSettings?.push_notifications_enabled
          })
        }
        if (type === '?in-app-notifications') {
          setInAppSettings({
            new_replies: data?.in_app?.new_replies,
            new_like: data?.in_app?.new_like,
            expired_subscription: data?.in_app?.expired_subscription,
            live_stream_invite: data?.in_app?.live_stream_invite,
            stream_started: data?.in_app?.stream_started
          })
          setNotificationsSettingsType('in_app')
          setHeaderSwitchSettings({
            name: 'in_app_notifications_enabled',
            value: data?.notificationSettings?.in_app_notifications_enabled
          })
        }
        if (type === '?sms-notifications') {
          setSmsSettings({
            expired_subscription: data?.sms?.expired_subscription,
            stream_started: data?.sms?.stream_started
          })
          setNotificationsSettingsType('sms')
          setHeaderSwitchSettings({
            name: 'sms_notifications_enabled',
            value: data?.notificationSettings?.sms_notifications_enabled
          })
        }
        if (type === '?email-notifications') {
          setEmailSettings({
            new_replies: data?.email?.new_replies,
            new_like: data?.email?.new_like,
            expired_subscription: data?.email?.expired_subscription,
            live_stream_invite: data?.email?.live_stream_invite,
            stream_started: data?.email?.stream_started,
            new_message: data?.email?.new_message
          })
          setNotificationsSettings({
            monthly_newsletter: data?.email?.monthly_newsletter,
            show_full_notification_email: data?.email?.show_full_notification_email
          })
          setNotificationsSettingsType('email')
          setHeaderSwitchSettings({
            name: 'email_notifications_enabled',
            value: data?.notificationSettings?.email_notifications_enabled
          })
        }
      }
      fanCheckSwitchStatus()
    }
  }, [type, data, userData, activeTab])

  const renderTitle = () => {
    switch (type) {
      case '?push-notifications':
        return t('notifications:push')
      case '?in-app-notifications':
        return t('notifications:inApp')
      case '?sms-notifications':
        return t('notifications:sms')
      case '?email-notifications':
        return t('notifications:email')
    }
  }

  const itemsList = (() => {
    if (userData.role === 'model' && activeTab !== 'subscriptions') {
      switch (type) {
        case '?push-notifications':
          return [
            {
              id: 'new_comment',
              text: t('notifications:newComment'),
              status: pushSettings.new_comment,
              key: 1
            },
            {
              id: 'new_like',
              text: t('notifications:newLike'),
              status: pushSettings.new_like,
              key: 2
            },
            {
              id: 'new_subscriber',
              text: t('notifications:newSubscriber'),
              status: pushSettings.new_subscriber,
              key: 3
            },
            {
              id: 'new_tip',
              text: t('notifications:newTip'),
              status: pushSettings.new_tip,
              key: 4
            },
            {
              id: 'new_premium_video_purchase',
              text: t('notifications:newPremiumVideoPurchase'),
              status: pushSettings.new_premium_video_purchase,
              key: 5
            },
            {
              id: 'new_message_purchase',
              text: t('notifications:newMessagePurchase'),
              status: pushSettings.new_message_purchase,
              key: 6
            },
            {
              id: 'upcoming_stream_reminders',
              text: t('notifications:upcomingStreamReminders'),
              status: pushSettings.upcoming_stream_reminders,
              key: 7
            },
            {
              id: 'subscription_renewal',
              text: t('notifications:subscriptionRenewal'),
              status: pushSettings.subscription_renewal,
              key: 8
            },
            {
              id: 'new_referal',
              text: t('notifications:newReferral'),
              status: pushSettings.new_referal,
              key: 9
            },
            {
              id: 'incoming_friend_request',
              text: t('notifications:incomingFriendRequest'),
              status: pushSettings.incoming_friend_request,
              key: 10
            },
            {
              id: 'accepted_friend_request',
              text: t('notifications:acceptedFriendRequest'),
              status: pushSettings.accepted_friend_request,
              key: 11
            },
            {
              id: 'new_tags',
              text: t('notifications:newTags'),
              status: pushSettings.new_tags,
              key: 12
            },
            {
              id: 'new_message',
              text: t('notifications:newMessage'),
              status: pushSettings.new_message,
              key: 13
            }
            // {
            //   id: 'poll_responses',
            //   text: 'Poll Responses',
            //   status: pushSettings.poll_responses,
            //   key: 14,
            // }
          ]

        case '?in-app-notifications':
          return [
            {
              id: 'new_comment',
              text: t('notifications:newComment'),
              status: inAppSettings.new_comment,
              key: 1
            },
            {
              id: 'new_like',
              text: t('notifications:newLike'),
              status: inAppSettings.new_like,
              key: 2
            },
            {
              id: 'new_subscriber',
              text: t('notifications:newSubscriber'),
              status: inAppSettings.new_subscriber,
              key: 3
            },
            {
              id: 'new_tip',
              text: t('notifications:newTip'),
              status: inAppSettings.new_tip,
              key: 4
            },
            {
              id: 'new_premium_video_purchase',
              text: t('notifications:newPremiumVideoPurchase'),
              status: inAppSettings.new_premium_video_purchase,
              key: 5
            },
            {
              id: 'new_message_purchase',
              text: t('notifications:newMessagePurchase'),
              status: inAppSettings.new_message_purchase,
              key: 6
            },
            {
              id: 'upcoming_stream_reminders',
              text: t('notifications:upcomingStreamReminders'),
              status: inAppSettings.upcoming_stream_reminders,
              key: 7
            },
            {
              id: 'subscription_renewal',
              text: t('notifications:subscriptionRenewal'),
              status: inAppSettings.subscription_renewal,
              key: 8
            },
            {
              id: 'new_referal',
              text: t('notifications:newReferral'),
              status: inAppSettings.new_referal,
              key: 9
            },
            {
              id: 'incoming_friend_request',
              text: t('notifications:incomingFriendRequest'),
              status: inAppSettings.incoming_friend_request,
              key: 10
            },
            {
              id: 'accepted_friend_request',
              text: t('notifications:acceptedFriendRequest'),
              status: inAppSettings.accepted_friend_request,
              key: 11
            },
            {
              id: 'new_tags',
              text: t('notifications:newTags'),
              status: inAppSettings.new_tags,
              key: 12
            }
            // {
            //   id: 'poll_responses',
            //   text: 'Poll Responses',
            //   status: pushSettings.poll_responses,
            //   key: 13,
            // },
          ]

        case '?sms-notifications':
          return [
            {
              id: 'upcoming_stream_reminders',
              text: t('notifications:upcomingStreamReminders'),
              status: smsSettings.upcoming_stream_reminders,
              key: 1
            }
          ]

        case '?email-notifications':
          return [
            {
              id: 'new_comment',
              text: t('notifications:newComment'),
              status: emailSettings.new_comment,
              key: 1
            },
            {
              id: 'new_like',
              text: t('notifications:newLike'),
              status: emailSettings.new_like,
              key: 2
            },
            {
              id: 'new_subscriber',
              text: t('notifications:newSubscriber'),
              status: emailSettings.new_subscriber,
              key: 3
            },
            {
              id: 'new_tip',
              text: t('notifications:newTip'),
              status: emailSettings.new_tip,
              key: 4
            },
            {
              id: 'new_premium_video_purchase',
              text: t('notifications:newPremiumVideoPurchase'),
              status: emailSettings.new_premium_video_purchase,
              key: 5
            },
            {
              id: 'new_message_purchase',
              text: t('notifications:newMessagePurchase'),
              status: emailSettings.new_message_purchase,
              key: 6
            },
            {
              id: 'upcoming_stream_reminders',
              text: t('notifications:upcomingStreamReminders'),
              status: emailSettings.upcoming_stream_reminders,
              key: 7
            },
            {
              id: 'subscription_renewal',
              text: t('notifications:subscriptionRenewal'),
              status: emailSettings.subscription_renewal,
              key: 8
            },
            {
              id: 'new_referal',
              text: t('notifications:newReferral'),
              status: emailSettings.new_referal,
              key: 9
            },
            {
              id: 'incoming_friend_request',
              text: t('notifications:incomingFriendRequest'),
              status: emailSettings.incoming_friend_request,
              key: 10
            },
            {
              id: 'accepted_friend_request',
              text: t('notifications:acceptedFriendRequest'),
              status: emailSettings.accepted_friend_request,
              key: 11
            },
            {
              id: 'new_tags',
              text: t('notifications:newTags'),
              status: emailSettings.new_tags,
              key: 12
            },
            {
              id: 'new_message',
              text: t('notifications:newMessage'),
              status: emailSettings.new_message,
              key: 13
            }
            // {
            //   id: 'poll_responses',
            //   text: 'Poll Responses',
            //   status: emailSettings.poll_responses,
            //   key: 14,
            // }
          ]
      }
    } else {
      switch (type) {
        case '?push-notifications':
          return [
            {
              id: 'new_replies',
              text: t('notifications:newReplies'),
              status: pushSettings.new_replies,
              key: 1
            },
            {
              id: 'new_like',
              text: t('notifications:newLikes'),
              status: pushSettings.new_like,
              key: 2
            },
            {
              id: 'expired_subscription',
              text: t('notifications:expiredSubscriptions'),
              status: pushSettings.expired_subscription,
              key: 3
            },
            {
              id: 'live_stream_invite',
              text: t('notifications:liveStreamInvite'),
              status: pushSettings.live_stream_invite,
              key: 4
            },
            {
              id: 'stream_started',
              text: t('notifications:streamStarted'),
              status: pushSettings.stream_started,
              key: 5
            },
            {
              id: 'new_message',
              text: t('notifications:newMessages'),
              status: pushSettings.new_message,
              key: 6
            }
          ]

        case '?in-app-notifications':
          return [
            {
              id: 'new_replies',
              text: t('notifications:newReplies'),
              status: inAppSettings.new_replies,
              key: 1
            },
            {
              id: 'new_like',
              text: t('notifications:newLikes'),
              status: inAppSettings.new_like,
              key: 2
            },
            {
              id: 'expired_subscription',
              text: t('notifications:expiredSubscriptions'),
              status: inAppSettings.expired_subscription,
              key: 3
            }
            // {
            //   id: 'poll_responses',
            //   text: t('notifications:pollResponses'),
            //   status: emailSettings.poll_responses,
            //   key: 14,
            // },
          ]
      }

      return undefined
    }
  })()

  const editState = (item: string) => {
    switch (type) {
      case '?push-notifications':
        setPushSettings({
          ...pushSettings,
          [item]: !pushSettings[item]
        })
        break
      case '?in-app-notifications':
        setInAppSettings({
          ...inAppSettings,
          [item]: !inAppSettings[item]
        })
        break
      case '?sms-notifications':
        setSmsSettings({
          ...smsSettings,
          [item]: !smsSettings[item]
        })
        break
      case '?email-notifications':
        setEmailSettings({
          ...emailSettings,
          [item]: !emailSettings[item]
        })
        break
    }
  }

  return (
    <WithHeaderSection
      customClass={styles.settings_notifications}
      headerSection={
        <LayoutHeader
          type='switch'
          section={t('Notifications')}
          title={renderTitle()}
          switchActive={headerSwitchSettings.value}
          switchFn={() => {
            setHeaderSwitchSettings({
              ...headerSwitchSettings,
              value: !headerSwitchSettings.value
            })
            updateNotificationsPreferences.mutate()
          }}
        />
      }
    >
      {userData.role === 'model' ? (
        <ChangeStateTabs
          customClass={styles.tabs_switch}
          activeTab={activeTab}
          tabs={[
            {
              name: t('creator'),
              value: 'creator'
            },
            {
              name: t('subscriptions'),
              value: 'subscriptions'
            }
          ]}
          clickFn={(val: string) => setActiveTab(val)}
          width='fit'
        />
      ) : (
        ''
      )}
      {itemsList?.map((item: { id: string; text: string; status: boolean; key: number }) => (
        <ActionCard
          key={item.key}
          disabled={!headerSwitchSettings.value}
          inputId={item.id}
          text={item.text}
          toggleActive={item.status}
          toggleFn={() => {
            editState(item.id)
            updateNotificationsCards.mutate({
              note: item.id,
              val: !item.status
            })
          }}
          hasRadio={true}
        />
      ))}

      {type === '?email-notifications' ? (
        <>
          <hr className='settings__fields__break' />
          {[
            {
              id: 'monthly_newsletter',
              text: t('monthlyNewsletter'),
              status: notificationsSettings.monthly_newsletter,
              key: itemsList?.length ?? 1
            },
            {
              id: 'show_full_notification_email',
              text: t('showFullTextOfTheMessagesInTheNotificationEmail'),
              status: notificationsSettings.show_full_notification_email,
              key: (itemsList?.length ?? 1) + 1
            }
          ].map((item: { id: string; text: string; status: boolean; key: number }) => (
            <ActionCard
              key={item.key}
              disabled={!headerSwitchSettings.value}
              inputId={item.id}
              text={item.text}
              toggleActive={item.status}
              toggleFn={() => {
                setNotificationsSettings({
                  ...notificationsSettings,
                  [item.id]: !notificationsSettings[item.id]
                })
                updateNotificationsCards.mutate({
                  note: item.id,
                  val: !item.status
                })
              }}
              hasToggle={true}
            />
          ))}
        </>
      ) : (
        ''
      )}
    </WithHeaderSection>
  )
}

export default EditNotifications
