import { FC, useState, useEffect } from 'react'
import './_notifications.scss'
import { useNavigate } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'

import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'
import NotificationCard from '../../features/NotificationCard/NotificationCard'
import noNotifications from '../../assets/images/no-notifications.png'
import { useFilterQuery, useNotificationsFeedInfinite } from '../../helpers/hooks'
import LayoutHeader from '../../features/LayoutHeader/LayoutHeader'
import { IconFilterOutline, IconSettingsOutline } from '../../assets/svg/sprite'
import LoadingDots from '../../components/UI/LoadingDots/LoadingDots'
import { apiNotificationsAsRead } from '../../services/endpoints/api_notifications'
import DesktopAdditionalContent from '../../features/DesktopAdditionalContent/DesktopAdditionalContent'

const Notifications: FC = () => {
  const [filterSelected, setFilterSelected] = useState<string>('all')
  const [notificationsFeedStatus, setNotificationsFeedStatus] = useState<string>('')
  const [notificationsFeedPosts, setNotificationsFeedPosts] = useState<any[]>([])

  const navigate = useNavigate()
  // const { wrapperStyle } = useDynamicHeight(240);
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { ref: lastNotificationRef, inView } = useInView({
    threshold: 0.1
  })

  const { data, error, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useNotificationsFeedInfinite(filterSelected)

  const filter = useFilterQuery()
  const type = filter.get('type')

  useEffect(() => {
    if (data && !isFetching) {
      const tmp = data.pages.map(page => {
        return page.page.data.data
      })
      setNotificationsFeedPosts([...tmp.flat()])
      if (!!data.pages[0].page.data.data.length) {
        setNotificationsFeedStatus('hasNotifications')
        apiNotificationsAsRead()
        queryClient.invalidateQueries(['pendingStats'])
      } else {
        setNotificationsFeedStatus('empty')
      }
    }
  }, [isFetching, data])

  useEffect(() => {
    if (type) {
      setFilterSelected(type)
    } else {
      setFilterSelected('all')
    }
  }, [type])

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, inView])

  const filterDropdownItems = [
    {
      value: 'all',
      name: t('All')
    },
    {
      value: 'interactions',
      name: t('interactions')
    },
    {
      value: 'likes',
      name: t('likes')
    },
    {
      value: 'subscriptions',
      name: t('subscriptions')
    },
    {
      value: 'tips',
      name: t('tips')
    },
    {
      value: 'messages',
      name: t('messages')
    },
    {
      value: 'premium',
      name: t('Premium')
    }
  ]

  return (
    <BasicLayout
      title={t('Notifications')}
      // headerNav={["/notifications/fans", "/notifications/site"]}
      customClass='notificationPageLayout'
    >
      <WithHeaderSection
        customClass='notifications'
        headerSection={
          <LayoutHeader
            title={filterSelected}
            type='title-with-buttons-no-icon'
            sortingProps={{ selectedSort: filterSelected, selectedOrder: '' }}
            buttons={[
              {
                type: 'settings',
                color: 'transparent',
                icon: <IconSettingsOutline color='#262A33' />,
                action: '/settings/notifications'
              },
              {
                type: 'filter',
                elements: {
                  first_section: filterDropdownItems
                },
                color: 'transparent',
                icon: <IconFilterOutline />
              }
            ]}
            applyFn={(val: string, val1?: string) => {
              if (val === 'all') {
                navigate({
                  pathname: '/notifications'
                })
              } else {
                navigate({
                  pathname: '/notifications',
                  search: `?type=${val}`
                })
              }
            }}
          />
        }
      >
        {isFetching && !isFetchingNextPage && <div className='loader'>{t('loading')}</div>}

        {notificationsFeedStatus === 'hasNotifications' && (
          <div
            className='notificationsList'
            // style={wrapperStyle}
          >
            {notificationsFeedPosts.map((notification: any, index: number) => {
              if (notificationsFeedPosts.length - 1 === index) {
                return (
                  <div key={notification.id} ref={lastNotificationRef}>
                    <NotificationCard
                      data={{
                        is_online: notification?.is_online,
                        is_liked: notification?.is_liked,
                        friendship_status: notification?.friendship_status,
                        subscription_status: notification?.subscription_status,
                        ...notification.data
                      }}
                      type={notification.data.notification_type}
                      time={notification.created_at}
                    />
                  </div>
                )
              } else {
                return (
                  <div key={notification.id}>
                    <NotificationCard
                      data={{
                        is_online: notification?.is_online,
                        is_liked: notification?.is_liked,
                        friendship_status: notification?.friendship_status,
                        subscription_status: notification?.subscription_status,
                        ...notification.data
                      }}
                      type={notification.data.notification_type}
                      time={notification.created_at}
                    />
                  </div>
                )
              }
            })}
            <LoadingDots visible={isFetchingNextPage} />
          </div>
        )}

        {notificationsFeedStatus === 'empty' && (
          <div className='notificationsList__empty'>
            <img src={noNotifications} alt='noNotifications' />
            <div className='notificationsList__empty__text'>
              <div className='notificationsList__empty__text--title'>{t('noNotifications')}</div>
              <div className='notificationsList__empty__text--sub'>{t('noNotifications')}</div>
            </div>
          </div>
        )}
      </WithHeaderSection>
      <DesktopAdditionalContent />
    </BasicLayout>
  )
}

export default Notifications
