import { FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { useQuery, UseQueryResult } from 'react-query'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'
import style from './_user_activity.module.scss'
import * as spriteIcons from '../../assets/svg/sprite'
import { useModalContext } from '../../context/modalContext'
import SortModal from '../../components/UI/Modal/Sort/SortModal'
import NotificationCard from '../../features/NotificationCard/NotificationCard'
import LoadingDots from '../../components/UI/LoadingDots/LoadingDots'
import { getPerformer } from '../../services/endpoints/profile'
import { IProfile } from '../../types/interfaces/IProfile'
import noNotifications from '../../assets/images/no-notifications.png'
import { useFilterQuery, useUserActivityFeedInfinite } from '../../helpers/hooks'

const UserActivity: FC = () => {
  const { t } = useTranslation()
  const { id } = useParams<any>()
  const modalData = useModalContext()

  const filter = useFilterQuery()
  const type = filter.get('type')

  const [filterSelected, setFilterSelected] = useState<string>('all')
  const [notificationsFeedStatus, setNotificationsFeedStatus] = useState<string>('')
  const [notificationsFeedPosts, setNotificationsFeedPosts] = useState<any[]>([])
  const { ref: lastNotificationRef, inView } = useInView({
    threshold: 0.1
  })

  const { data: user }: UseQueryResult<IProfile, Error> = useQuery<IProfile, Error>(
    ['profile', id],
    () => getPerformer(id),
    {
      enabled: !!id
    }
  )

  const reqFilter = useMemo(
    () => ({
      type: filterSelected,
      userId: id ? Number(id) : 0
    }),
    [filterSelected, id]
  )

  const { data, error, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useUserActivityFeedInfinite(reqFilter)

  const fitlerElements = {
    first_section: [
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
      }
    ]
  }

  if (error) console.error('pages > UserActivity.tsx', error)

  useEffect(() => {
    if (data && !isFetching) {
      const tmp = data.pages.map(page => {
        return page.page.data.data
      })
      setNotificationsFeedPosts([...tmp.flat()])
      if (!!data.pages[0].page.data.data.length) {
        setNotificationsFeedStatus('hasNotifications')
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

  return (
    <BasicLayout
      title={
        <div className={style.layout_title}>
          <div className={`${style.avatar} ${style.avatar_small}`}>
            <img src={user?.avatar.url} alt='avatar' />
          </div>
          {user?.display_name}
        </div>
      }
    >
      <WithHeaderSection
        customClass={style.header_section}
        headerSection={
          <div className={style.title}>
            {fitlerElements.first_section.find(filterOption => filterOption.value === filterSelected)?.name}{' '}
            {t('activity')}
            <div
              className={style.filter_button}
              onClick={() =>
                modalData.addModal(
                  t('filter'),
                  <SortModal
                    elements={fitlerElements}
                    applyFn={(val: any) => setFilterSelected(val)}
                    hasResetBtn={true}
                    resetFn={() => {
                      modalData.clearModal()
                      setFilterSelected('')
                    }}
                    sortingProps={{ selectedOrder: '', selectedSort: filterSelected }}
                  />
                )
              }
            >
              <spriteIcons.IconFilterOutline />
            </div>
          </div>
        }
      >
        {isFetching && !isFetchingNextPage && <div className='loader'>{t('loading')}</div>}

        {notificationsFeedStatus === 'hasNotifications' && (
          <div className='notificationsList'>
            {notificationsFeedPosts.map((notification: any, index: number) => {
              if (notificationsFeedPosts.length - 1 === index) {
                return (
                  <div key={notification.id} ref={lastNotificationRef}>
                    <NotificationCard
                      data={{
                        is_online: notification?.is_online,
                        is_liked: notification?.is_liked,
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
              <div className='notificationsList__empty__text--title'>{t('noActivity')}</div>
              <div className='notificationsList__empty__text--sub'>{t('noActivity')}</div>
            </div>
          </div>
        )}
      </WithHeaderSection>
    </BasicLayout>
  )
}

export default UserActivity
