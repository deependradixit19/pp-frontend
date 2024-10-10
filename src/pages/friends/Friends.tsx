import React, { FC, useEffect, useState } from 'react'
import { useInfiniteQuery } from 'react-query'

import { useTranslation } from 'react-i18next'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../features/LayoutHeader/LayoutHeader'
import UsersList from '../../features/UsersList/UsersList'

import './_friends.scss'

import { getFriends, getFriendRequests, FriendsSorting } from '../../services/endpoints/profile'
import ChangeStateTabs from '../../components/UI/ChangeStateTabs/ChangeStateTabs'
import { ListFilter } from '../../types/types'
import DesktopAdditionalContent from '../../features/DesktopAdditionalContent/DesktopAdditionalContent'

const defaultSorting: FriendsSorting = {
  sort: 'created_at',
  order: ''
}

const getNextPageParam = (lastPage: any) => {
  const { current_page, last_page } = lastPage.meta
  return current_page < last_page ? current_page + 1 : false
}

const Friends: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [activeTab, setActiveTab] = useState<string>('all')
  const [sorting, setSorting] = useState(defaultSorting)
  const [friends, setFriends] = useState<Array<any>>([])
  const [friendsRequests, setFriendsRequests] = useState<Array<any>>([])
  const [friendsNumber, setFriendsNumber] = useState<string | number>('-')
  const [friendsRequestsNumber, setFriendsRequestsNumber] = useState<number | undefined>(undefined)

  const { t } = useTranslation()

  const {
    data: friendsData,
    hasNextPage: hasNextFriendsPage,
    fetchNextPage: fetchNextFriendsPage,
    refetch: refetchFriends
  } = useInfiniteQuery(
    ['friends'],
    ({ pageParam = 1 }) => getFriends({ page: pageParam, ...{ sort_value: sorting.order } }),
    {
      getNextPageParam
    }
  )

  const {
    data: friendsRequestsData,
    hasNextPage: hasNextFriendsRequestsPage,
    fetchNextPage: fetchNextFriendsRequestsPage,
    refetch: refetchFriendsRequests
  } = useInfiniteQuery(
    ['friendsRequests'],
    ({ pageParam = 1 }) => getFriendRequests({ page: pageParam, ...{ sort_value: sorting.order } }),
    {
      getNextPageParam
    }
  )

  useEffect(() => {
    const friends = friendsData?.pages?.reduce((all, page) => all.concat(page.data), [])
    setFriends(friends)
    setFriendsNumber(friendsData?.pages[0]?.meta?.total ?? '-')
  }, [friendsData])

  useEffect(() => {
    const friendsRequests = friendsRequestsData?.pages?.reduce((all, page) => all.concat(page.data), [])
    setFriendsRequests(friendsRequests)
    setFriendsRequestsNumber(friendsRequestsData?.pages[0]?.meta?.total)
  }, [friendsRequestsData])

  const renderUsersList = () => {
    switch (activeTab) {
      case 'requests':
        return (
          <UsersList
            activeTab={activeTab}
            users={friendsRequests || []}
            userCardType='friendReq'
            loadMoreCb={handleLoadMoreFriendsRequests}
          />
        )

      default:
        return (
          <UsersList
            activeTab={activeTab}
            users={friends || []}
            userCardType='friend'
            loadMoreCb={handleLoadMoreFriends}
          />
        )
    }
  }

  const handleLoadMoreFriends = () => {
    if (hasNextFriendsPage) {
      fetchNextFriendsPage()
    }
  }

  const handleLoadMoreFriendsRequests = () => {
    if (hasNextFriendsRequestsPage) {
      fetchNextFriendsRequestsPage()
    }
  }

  const filterButtons: Array<ListFilter> = [
    {
      type: 'sort',
      elements: {
        first_section: [
          {
            value: 'created_at',
            name: t('mostRecent'),
            default: sorting.sort === 'created_at'
          },
          {
            value: 'name',
            name: t('name'),
            default: sorting.sort === 'name'
          }
        ],
        second_section: [
          {
            value: 'asc',
            name: t('ascending'),
            default: sorting.order === 'asc'
          },
          {
            value: 'desc',
            name: t('descending'),
            default: sorting.order === 'desc'
          }
        ]
      }
    }
  ]

  const applySorting = (val: string, val1?: string) => {
    setSorting({
      sort: val,
      order: val1 ?? defaultSorting.order
    } as FriendsSorting)
  }

  useEffect(() => {
    switch (activeTab) {
      case 'requests':
        refetchFriendsRequests()
        break
      default:
        refetchFriends()
    }
  }, [sorting])

  return (
    <BasicLayout title={t('friends')}>
      <WithHeaderSection
        headerSection={
          <LayoutHeader
            type='search-with-buttons'
            searchValue={searchTerm}
            searchFn={(term: string) => setSearchTerm(term)}
            clearFn={() => setSearchTerm('')}
            additionalProps={{ placeholder: t('searchFriends') }}
            buttons={filterButtons}
            applyFn={(val: string, val1?: string) => applySorting(val, val1)}
          />
        }
      >
        <>
          <div className='list-header'>
            <ChangeStateTabs
              activeTab={activeTab}
              tabs={[
                {
                  value: 'all',
                  name: t('All')
                },
                {
                  value: 'requests',
                  name: t('requests')
                }
              ]}
              clickFn={(val: string) => setActiveTab(val)}
              width='fit'
              hasInfoCircle={!!friendsRequestsNumber}
              infoCircleData={friendsRequestsNumber}
            />
            <div className='friends-number'>
              <span>{friendsNumber}</span> {t('friends')}
            </div>
          </div>
          {renderUsersList()}
        </>
      </WithHeaderSection>
      <DesktopAdditionalContent />
    </BasicLayout>
  )
}

export default React.memo(Friends)
