import { FC, useState, useCallback, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import FeedLoader from '../../components/Common/Loader/FeedLoader/FeedLoader'
// import NavigationBar from '../../components/UI/NavigationBar/NavigationBar';
import ButtonTabNavbar from '../../components/UI/TabNavbar/ButtonTabNavbar'
import { usePreviewContext } from '../../context/previewContext'
import { useUserContext } from '../../context/userContext'
import LayoutHeader from '../../features/LayoutHeader/LayoutHeader'
import PostRenderer from '../../features/Post/PostRenderer'
import { useDebounce, useFilterQuery, useInfiniteFeed } from '../../helpers/hooks'
import { getRole, queryFromSearchParams } from '../../helpers/util'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'
import { getLikedHistoryFeed, getMediaAutocomplete } from '../../services/endpoints/media'
import { IPost } from '../../types/interfaces/ITypes'
import styles from './likesHistory.module.scss'

const LikesHistory: FC = () => {
  const filter = useFilterQuery()
  const search = filter.get('searchTerm')
  const modelId = filter.get('model_id')
  const type = filter.get('type') ?? 'all'

  const location = useLocation()
  const values = queryString.parse(location.search)
  const navigate = useNavigate()
  const userData = useUserContext()
  const { t } = useTranslation()

  const { setInitialData, selectedPostData, setSelectedPostData } = usePreviewContext()

  const [autocompleteTerm, setAutocompleteTerm] = useState<string>(search ?? '')
  const [shouldAutocomplete, setShouldAutocomplete] = useState(false)
  const [feedPosts, setFeedPosts] = useState<IPost[]>([])

  const debouncedAutocompleteTerm = useDebounce(autocompleteTerm, 500)
  const {
    data: autocompleteResults,
    error: autocompleteError,
    status: autocompleteStatus,
    isFetching: autocompleteIsFetching
  } = useQuery(
    ['getMediaAutocomplete', debouncedAutocompleteTerm],
    () => getMediaAutocomplete({ searchTerm: debouncedAutocompleteTerm }),
    { enabled: !!debouncedAutocompleteTerm && shouldAutocomplete }
  )

  const { data, error, isFetching, isFetchingNextPage, hasNextPage, status, fetchNextPage } = useInfiniteFeed(
    ['getLikedHistory', { searchTerm: search, filter: type, model_id: modelId }],
    getLikedHistoryFeed
  )

  useEffect(() => {
    if (!search) {
      setShouldAutocomplete(true)
    }
  }, [])

  useEffect(() => {
    if (type) {
      if (userData) {
        setInitialData(userData.id, type, 'liked')
      }
    } else {
      if (userData) {
        setInitialData(userData.id, 'all', 'liked')
      }
    }
  }, [type, userData])

  useEffect(() => {
    if (selectedPostData) {
      const selectedPost = feedPosts.find(post => post.id === selectedPostData.id)

      if (selectedPost) {
        setSelectedPostData(selectedPost)
      }
    }
  }, [feedPosts])

  useEffect(() => {
    if (data && !isFetching) {
      const tmp = data.pages.map(page => {
        return page.page.data.data
      })
      setFeedPosts([...tmp.flat()])
    }
  }, [data, isFetching])

  const observer = useRef<IntersectionObserver>()

  const lastPostRef = useCallback(
    (node: any) => {
      if (isFetchingNextPage) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage()
          }
        },
        { rootMargin: '1500px' }
      )

      if (node) observer.current.observe(node)
    },
    [isFetchingNextPage, hasNextPage]
  )

  status === 'error' && <p>Error: {error?.message}</p>
  return (
    <BasicLayout
      title={t('likes')}
      customContentClass='media__content__wrapper'
      handleGoBack={() => {
        if (search) {
          navigate('/likes')
          setAutocompleteTerm('')
        } else {
          navigate('/media')
        }
      }}
    >
      <WithHeaderSection
        headerSection={
          <LayoutHeader
            type='search-with-buttons'
            searchValue={autocompleteTerm}
            searchFn={(term: string) => {
              if (!shouldAutocomplete) {
                setShouldAutocomplete(true)
              }
              setAutocompleteTerm(term)
            }}
            additionalProps={{ placeholder: t('searchMedia') }}
            buttons={[]}
            applyFn={(val: string, val1?: string) => console.log(val, val1)}
            selectFn={(value: string, id?: number) => {
              values.searchTerm = value
              if (id) values.model_id = `${id}`
              const searchQuery = queryFromSearchParams(values)
              setAutocompleteTerm(value)
              navigate({
                pathname: '/likes',
                search: searchQuery
              })
              if (shouldAutocomplete) {
                setShouldAutocomplete(false)
              }
            }}
            clearFn={() => {
              navigate('/likes')
              setAutocompleteTerm('')
            }}
            mediaSearchResults={autocompleteResults}
          />
        }
      >
        <div className={styles.wrapper}>
          <div className={styles.navigation}>
            <ButtonTabNavbar type='light' navArr={['photos', 'videos']} />
          </div>

          <div className={styles.content}>
            {status === 'loading' ? (
              <div className={styles.loader}>
                <FeedLoader />
              </div>
            ) : (
              <>
                {feedPosts.map((post: IPost, index: number) => {
                  if (feedPosts.length === index + 1) {
                    return (
                      <div key={post.id} ref={lastPostRef}>
                        <PostRenderer
                          postIndex={index}
                          role={getRole(userData, post)}
                          postId={post.id}
                          postData={post}
                          dataQuery={['getLikedHistory', { filter: type, model_id: modelId }]}
                        />
                      </div>
                    )
                  } else {
                    return (
                      <PostRenderer
                        key={post.id}
                        postIndex={index}
                        role={getRole(userData, post)}
                        postId={post.id}
                        postData={post}
                        dataQuery={['getLikedHistory', { filter: type, model_id: modelId }]}
                      />
                    )
                  }
                })}
              </>
            )}
            {/* <div>
              {isFetchingNextPage ? (
                <div className={styles.loader}>
                  {console.log('2222')}
                  <FeedLoader />
                </div>
              ) : hasNextPage ? (
                ''
              ) : (
                t('nothingMoreToLoad')
              )}
            </div> */}
            {/* <div>
              {isFetching && !isFetchingNextPage ? (
                <div className={styles.loader}>
                  {console.log('3333')}
                  <FeedLoader />
                </div>
              ) : null}
            </div> */}
          </div>
        </div>
      </WithHeaderSection>
    </BasicLayout>
  )
}

export default LikesHistory
