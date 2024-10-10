import { FC, useState, useRef, useCallback } from 'react'
import { useInfiniteQuery, useQuery, UseQueryResult } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import CreatorsList from '../../features/CreatorsList/CreatorsList'
import LayoutHeader from '../../features/LayoutHeader/LayoutHeader'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'
import styles from './PublicFriends.module.scss'
import { getModelFriends } from '../../services/endpoints/friends'
import { getPerformer } from '../../services/endpoints/profile'
import { IProfile } from '../../types/interfaces/IProfile'
import avatarPlaceholder from '../../assets/images/user_placeholder.png'
import BellLink from '../../components/UI/BellLink/BellLink'

const PublicFriends: FC = () => {
  const { modelId } = useParams<{ modelId: string | undefined }>()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchSubmit, setSearchSubmit] = useState('')
  const [sort, setSort] = useState<'asc' | 'desc'>('asc')
  const [friends, setFriends] = useState<any>([])
  const [friendsNumber, setFriendsNumber] = useState<number>()
  const navigate = useNavigate()
  const perPage = 20

  const { data: modelData }: UseQueryResult<IProfile, Error> = useQuery<IProfile, Error>(
    ['profile', modelId],
    () => getPerformer(modelId),
    {
      enabled: !!modelId,
      staleTime: 15 * 1000
    }
  )

  if (modelData?.show_friend_list === false) navigate('/404', { replace: true })

  const { hasNextPage, isFetching, fetchNextPage, isLoading } = useInfiniteQuery(
    ['friends', searchSubmit, sort],
    ({ pageParam = 1 }) =>
      getModelFriends(parseInt(modelId ?? '0'), {
        search: searchSubmit,
        sort,
        page: pageParam,
        perPage
      }),
    {
      getNextPageParam: lastPage => {
        const nextPage = lastPage?.meta?.current_page + 1
        return nextPage <= lastPage.meta.last_page ? nextPage : undefined
      },
      onSuccess: resp => {
        const newArray = resp.pages
          .map(page => page.data)
          .reduce((prevVal, currentVal) => prevVal.concat(currentVal, []))
        const newObjects = newArray.map((friend: any) => {
          return {
            coverUrl: friend.cover,
            avatarUrl: friend.avatar?.url,
            name: friend.name,
            handle: friend.username,
            isLive: friend.live_status || false,
            isOnline: friend.online_status || false,
            userId: friend.id,
            subscribed: friend.auth_user_is_subscribed || false
          }
        })

        setFriendsNumber(resp.pages?.[0]?.meta?.total)
        setFriends(newObjects)
      }
    }
  )

  const observer = useRef<IntersectionObserver>()

  const lastCreatorRef = useCallback(
    (node: any) => {
      if (isFetching) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })

      if (node) observer.current.observe(node)
    },
    [fetchNextPage, hasNextPage, isFetching]
  )

  return (
    <BasicLayout
      customClass={styles.basic_layout}
      title={
        <>
          <img
            className={`footer__link--avatar ${styles.header_avatar}`}
            src={modelData?.cropped_avatar.url || modelData?.avatar.url || avatarPlaceholder}
            alt='Profile'
          />
          <span className={styles.header_text}>{`${modelData?.display_name ?? 'Model'}'s Friends`}</span>
        </>
      }
      headerRightEl={<BellLink />}
      customContentClass={styles.creators__content__wrapper}
    >
      <WithHeaderSection
        headerSection={
          <LayoutHeader
            type='search-with-buttons'
            searchValue={searchTerm}
            searchFn={(term: string) => setSearchTerm(term)}
            clearFn={() => setSearchTerm('')}
            searchSettings={{
              isForm: true,
              formSubmitFn: e => {
                e.preventDefault()
                setSearchSubmit(searchTerm)
              },
              iconClickFn: () => setSearchSubmit(searchTerm)
            }}
            additionalProps={{
              placeholder: `Search Friends`
            }}
            buttons={[
              {
                type: 'sort',
                customClickFn: () => {
                  setSort(sort === 'asc' ? 'desc' : 'asc')
                }
              }
            ]}
          />
        }
      >
        <>
          {isLoading && <div className='loader'></div>}

          {!isLoading && (
            <>
              <div className={styles.list__header}>
                <div className={styles.friends__number}>
                  <span>{friendsNumber}</span> Friends
                </div>
              </div>
              <CreatorsList
                creators={friends}
                customClass='browse-creators-list'
                renderLocation='publicFriends'
                creatorRef={lastCreatorRef}
                customPlaceholderText='Friends appear here'
              />
            </>
          )}
        </>
      </WithHeaderSection>
    </BasicLayout>
  )
}

export default PublicFriends
