import { FC, useEffect, useState, useRef } from 'react'
import { useQuery, useQueryClient, UseQueryResult, useMutation } from 'react-query'

import { useTranslation } from 'react-i18next'
import * as spriteIcons from '../../../assets/svg/sprite'
import { AllIcons } from '../../../helpers/allIcons'
import { Icons } from '../../../helpers/icons'
import { useUserContext } from '../../../context/userContext'
import ActionCard from '../../../features/ActionCard/ActionCard'
import '../_settings.scss'
import { getNotificationSettings, putNotifications } from '../../../services/endpoints/settings'
import { addToast } from '../../../components/Common/Toast/Toast'
import { iNotificationsSettings } from '../../../types/iTypes'

const RenderSettingsCards: FC<{
  type: string
  hasBottomSettings?: boolean
  searchTerm: string
}> = ({ type, hasBottomSettings, searchTerm }) => {
  type SingleCard = {
    icon?: JSX.Element | JSX.Element[] | string
    body: string
    subtext?: string
    link?: string
    absfix?: boolean
    hasArrow?: boolean
    roles: string[]
    fanOrder?: number
    modelOrder?: number
    info?: string | JSX.Element | JSX.Element[]
    hasToggle?: boolean
    toggleActive?: boolean
    toggleFn?: () => void
  }
  type CardsObject = {
    general: {
      top: SingleCard[]
      bottom: SingleCard[] | []
    }
    account: {
      top: SingleCard[]
      bottom: SingleCard[] | []
    }
    notifications: {
      top: SingleCard[]
      bottom: SingleCard[] | []
    }
  }
  const userData = useUserContext()
  const queryClient = useQueryClient()
  const filterContainerRef = useRef<any>()
  const { t } = useTranslation()

  const [searchResultsEmpty, setSearchResultsEmpty] = useState(false)

  const [notificationsSettings, setNotificationsSettings] = useState<{
    [key: string]: boolean
  }>({
    push_notifications_enabled: false,
    in_app_notifications_enabled: false,
    sms_notifications_enabled: false,
    email_notifications_enabled: false
  })
  const {
    data: notificationData,
    error: notificationError,
    isLoading: isNotificationsLoading
  }: UseQueryResult<iNotificationsSettings> = useQuery('globalNotificationSettings', () => getNotificationSettings(), {
    refetchOnMount: true,
    refetchOnWindowFocus: false
  })

  useEffect(() => {
    if (notificationData) {
      setNotificationsSettings({
        push_notifications_enabled: notificationData?.notificationSettings.push_notifications_enabled,
        in_app_notifications_enabled: notificationData?.notificationSettings.in_app_notifications_enabled,
        sms_notifications_enabled: notificationData?.notificationSettings.sms_notifications_enabled,
        email_notifications_enabled: notificationData?.notificationSettings.email_notifications_enabled
      })
    }
    if (notificationError) {
      addToast('error', t('error:errorSomethingWentWrong'))
    }
    //eslint-disable-next-line
  }, [notificationData, notificationError])

  const updateNotificationsPreferences = useMutation(
    (newPreferences: {
      data: {
        [key: string]: boolean
      }
      key: string
      value: boolean
    }) => {
      const { data, key, value } = newPreferences
      setNotificationsSettings({
        ...notificationsSettings,
        [key]: value
      })
      return putNotifications(data)
    },
    {
      onError: err => {
        addToast('error', t('error:errorSomethingWentWrong'))
      },
      onSuccess: () => {
        addToast('success', t('notificationsUpdated'))
        queryClient.invalidateQueries('globalNotificationSettings')
      }
    }
  )

  const allSettingsCards: CardsObject = {
    general: {
      top: [
        {
          icon: <spriteIcons.IconDollarCircleArrows />,
          body: t('settings:subscriptionSettings'),
          link: '/settings/general/subscription-options',
          hasArrow: true,
          absfix: true,
          roles: ['model']
        },
        {
          icon: <spriteIcons.IconWallet />,
          body: t('settings:payoutSettings'),
          link: '/settings/general/payout-settings',
          hasArrow: true,
          absfix: true,
          roles: ['model']
        },
        {
          icon: <spriteIcons.IconNotePencil />,
          body: t('settings:postSettings'),
          link: '/settings/general/post-settings',
          hasArrow: true,
          absfix: true,
          roles: ['model']
        },
        {
          icon: <spriteIcons.IconManCircleBlue />,
          body: t('settings:profileSettings'),
          link: '/settings/general/profile-settings',
          hasArrow: true,
          absfix: true,
          roles: ['model']
        },
        {
          icon: <spriteIcons.IconChatBubble />,
          body: t('settings:chatSettings'),
          link: '/settings/general/chat-settings',
          hasArrow: true,
          absfix: true,
          roles: ['model', 'fan'],
          fanOrder: 3
        },
        {
          icon: <spriteIcons.IconLiveStream />,
          body: t('settings:liveStream'),
          link: '/settings/general/live-stream',
          hasArrow: true,
          absfix: true,
          roles: ['model']
        },
        {
          icon: <spriteIcons.IconPlusInCircle />,
          body: t('settings:story'),
          link: '/settings/general/story-settings',
          hasArrow: true,
          absfix: true,
          roles: ['model']
        },
        {
          icon: <spriteIcons.IconGlobeMagnified />,
          body: t('settings:language'),
          link: '/settings/general/language',
          hasArrow: true,
          absfix: true,
          roles: ['model', 'fan'],
          fanOrder: 4
        },
        {
          icon: <spriteIcons.IconWallet />,
          body: t('settings:payment'),
          link: '/settings/general/wallet',
          hasArrow: true,
          absfix: true,
          roles: ['fan'],
          fanOrder: 1
        },
        {
          icon: <spriteIcons.IconCogWheelBlue />,
          body: t('settings:activity'),
          link: '/settings/general/activity',
          hasArrow: true,
          absfix: true,
          roles: ['model', 'fan'],
          fanOrder: 2
        }
      ],
      bottom: []
    },
    account: {
      top: [
        {
          icon: <spriteIcons.IconManCircleBlue />,
          body: t('settings:changeDisplayName'),
          subtext: userData.display_name,
          link: '/settings/account/change-display-name',
          hasArrow: true,
          absfix: true,
          roles: ['model', 'fan']
        },
        {
          icon: <spriteIcons.IconManCircleBlue />,
          body: t('settings:changeUsername'),
          link: '/settings/account/change-username',
          hasArrow: true,
          absfix: true,
          subtext: userData.username,
          roles: ['model', 'fan']
        },
        {
          icon: <spriteIcons.IconLockBlue />,
          body: t('settings:changePassword'),
          link: '/settings/account/change-password',
          info: '******',
          hasArrow: true,
          absfix: true,
          roles: ['model', 'fan']
        },
        {
          icon: <spriteIcons.IconPhoneBlue />,
          body: t('settings:changePhoneNumber'),
          link: '/settings/account/change-phone',
          hasArrow: true,
          subtext: userData.phone_number ? userData.phone_number : '',
          absfix: true,
          roles: ['model', 'fan']
        },
        {
          icon: <spriteIcons.IconMail />,
          body: t('settings:changeEmail'),
          subtext: userData.email,
          link: '/settings/account/change-email',
          info: <span style={{ marginTop: '17px', display: 'block' }}>{t('linkWithEmailOrFacebookWillKeep')}</span>,
          hasArrow: true,
          roles: ['model', 'fan']
        },
        {
          icon: <spriteIcons.IconManCircleBlue />,
          body: t('settings:connectAnotherAccount'),
          info: t('connectASecondaryAccount'),
          link: '/settings/account/connect-another-account',
          hasArrow: true,
          absfix: true,
          roles: ['model', 'fan']
        },
        {
          icon: <spriteIcons.IconChatBubbles />,
          body: t('settings:connectSocialMediaAccounts'),
          info: t('linkWithEmailOrFacebookWillKeep'),
          link: '/settings/account/connect-social-accounts',
          hasArrow: true,
          absfix: true,
          roles: ['model', 'fan']
        }
      ],
      bottom: [
        {
          icon: <spriteIcons.IconPrivacyShield />,
          body: t('settings:privacySecurity'),
          link: '/settings/account/privacy-and-security',
          hasArrow: true,
          roles: ['model', 'fan']
        }
      ]
    },
    notifications: {
      top: [
        {
          icon: Icons.notification,
          body: t('settings:pushNotifications'),
          link: '/settings/notifications/push-notifications',
          absfix: true,
          hasArrow: true,
          hasToggle: true,
          toggleActive: notificationsSettings.push_notifications_enabled,
          toggleFn: () =>
            updateNotificationsPreferences.mutate({
              data: {
                push_notifications_enabled: !notificationsSettings.push_notifications_enabled
              },
              key: 'push_notifications_enabled',
              value: !notificationsSettings.push_notifications_enabled
            }),
          roles: ['model', 'fan']
        },
        {
          icon: AllIcons.settings_notifications_inapp,
          body: t('settings:inAppNotifications'),
          link: '/settings/notifications/in-app-notifications',
          hasArrow: true,
          absfix: true,
          hasToggle: true,
          toggleActive: notificationsSettings.in_app_notifications_enabled,
          toggleFn: () =>
            updateNotificationsPreferences.mutate({
              data: {
                in_app_notifications_enabled: !notificationsSettings.in_app_notifications_enabled
              },
              key: 'in_app_notifications_enabled',
              value: !notificationsSettings.in_app_notifications_enabled
            }),
          roles: ['model', 'fan']
        },
        {
          icon: Icons.mobile,
          body: t('settings:smsNotifications'),
          link: '/settings/notifications/sms-notifications',
          absfix: true,
          hasArrow: true,
          hasToggle: true,
          toggleActive: notificationsSettings.sms_notifications_enabled,
          toggleFn: () =>
            updateNotificationsPreferences.mutate({
              data: {
                sms_notifications_enabled: !notificationsSettings.sms_notifications_enabled
              },
              key: 'sms_notifications_enabled',
              value: !notificationsSettings.sms_notifications_enabled
            }),
          roles: ['model', 'fan']
        },
        {
          icon: Icons.mail,
          body: t('settings:emailNotifications'),
          link: '/settings/notifications/email-notifications',
          hasArrow: true,
          hasToggle: true,
          toggleActive: notificationsSettings.email_notifications_enabled,
          toggleFn: () =>
            updateNotificationsPreferences.mutate({
              data: {
                email_notifications_enabled: !notificationsSettings.email_notifications_enabled
              },
              key: 'email_notifications_enabled',
              value: !notificationsSettings.email_notifications_enabled
            }),
          roles: ['model', 'fan']
        }
      ],
      bottom: []
    }
  }

  const renderTopCards = () => {
    return allSettingsCards[type as keyof typeof allSettingsCards].top.map(
      (
        {
          icon,
          body,
          subtext,
          link,
          absfix,
          hasArrow,
          roles,
          fanOrder,
          modelOrder,
          info,
          toggleActive,
          toggleFn,
          hasToggle
        }: SingleCard,
        index
      ) => {
        if (roles.includes(userData.role)) {
          return (
            <div
              key={index}
              style={
                userData.role === 'model'
                  ? modelOrder
                    ? { order: modelOrder }
                    : { order: 'initial' }
                  : fanOrder
                  ? { order: fanOrder }
                  : { order: 'initial' }
              }
            >
              <ActionCard
                icon={icon}
                text={body}
                subtext={subtext}
                link={link}
                absFix={absfix ? true : false}
                hasArrow={hasArrow ? true : false}
                description={info}
                hasToggle={hasToggle}
                toggleActive={toggleActive}
                toggleFn={toggleFn}
              />
            </div>
          )
        }
      }
    )
  }

  const renderBottomCards = () => {
    if (hasBottomSettings && allSettingsCards[type as keyof typeof allSettingsCards].bottom.length > 0) {
      return allSettingsCards[type as keyof typeof allSettingsCards].bottom?.map(
        (
          {
            icon,
            body,
            subtext,
            link,
            absfix,
            hasArrow,
            roles,
            fanOrder,
            modelOrder,
            info,
            toggleActive,
            toggleFn,
            hasToggle
          }: SingleCard,
          index
        ) => {
          if (roles.includes(userData.role)) {
            return (
              <div
                key={index}
                style={
                  userData.role === 'model'
                    ? modelOrder
                      ? { order: modelOrder }
                      : { order: 'initial' }
                    : fanOrder
                    ? { order: fanOrder }
                    : { order: 'initial' }
                }
              >
                <ActionCard
                  icon={icon}
                  text={body}
                  subtext={subtext}
                  link={link}
                  absFix={absfix ? true : false}
                  hasArrow={hasArrow ? true : false}
                  description={info}
                  hasToggle={hasToggle}
                  toggleActive={toggleActive}
                  toggleFn={toggleFn}
                />
              </div>
            )
          }
        }
      )
    }
  }

  const renderFilteredCards = (type: string, title: string) => {
    const filterArray = {
      general: [...allSettingsCards.general.top, ...allSettingsCards.general.bottom].filter(
        (item: any) => item.body.toLowerCase().includes(searchTerm.toLowerCase()) && item.roles.includes(userData.role)
      ),
      account: [...allSettingsCards.account.top, ...allSettingsCards.account.bottom].filter(
        (item: any) => item.body.toLowerCase().includes(searchTerm.toLowerCase()) && item.roles.includes(userData.role)
      ),
      notifications: [...allSettingsCards.notifications.top, ...allSettingsCards.notifications.bottom].filter(
        (item: any) => item.body.toLowerCase().includes(searchTerm.toLowerCase()) && item.roles.includes(userData.role)
      )
    }
    if (filterArray[type as keyof typeof filterArray].length > 0) {
      return (
        <div className='settings__filtered'>
          <h2>{title}</h2>
          {filterArray[type as keyof typeof filterArray].map(
            (
              {
                icon,
                body,
                subtext,
                link,
                absfix,
                hasArrow,
                roles,
                fanOrder,
                modelOrder,
                info,
                toggleActive,
                toggleFn,
                hasToggle
              }: SingleCard,
              index
            ) => {
              if (roles.includes(userData.role)) {
                return (
                  <ActionCard
                    key={index}
                    icon={icon}
                    text={body}
                    subtext={subtext}
                    link={link}
                    absFix={absfix ? true : false}
                    hasArrow={hasArrow ? true : false}
                    description={info}
                    hasToggle={hasToggle}
                    toggleActive={toggleActive}
                    toggleFn={toggleFn}
                  />
                )
              }
            }
          )}
        </div>
      )
    }
  }

  useEffect(() => {
    if (filterContainerRef.current) {
      if (filterContainerRef.current.children.length === 0) {
        setSearchResultsEmpty(true)
      } else {
        setSearchResultsEmpty(false)
      }
    }
  }, [filterContainerRef, searchTerm])

  return searchTerm.trim() === '' ? (
    <div className='settings settings__fields'>
      {renderTopCards()}
      {hasBottomSettings ? <hr className='settings__fields__break' /> : ''}
      {hasBottomSettings ? renderBottomCards() : ''}
    </div>
  ) : (
    <>
      <div ref={filterContainerRef}>
        {renderFilteredCards('general', t('settings:generalSettings'))}
        {renderFilteredCards('account', t('settings:accountSettings'))}
        {renderFilteredCards('notifications', t('settings:notificationSettings'))}
      </div>
      {searchResultsEmpty && <div className='settings-search-no-results'>{t('noResults')}</div>}
    </>
  )
}

export default RenderSettingsCards
