import { FC, useState, useCallback, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { InfiniteData, useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { IconTrashcanMd } from '../../assets/svg/sprite'
import FeedLoader from '../../components/Common/Loader/FeedLoader/FeedLoader'
import { addToast } from '../../components/Common/Toast/Toast'
import ConfirmModal from '../../components/UI/Modal/Confirm/ConfirmModal'
// import NavigationBar from '../../components/UI/NavigationBar/NavigationBar';
// import TabNavbar from '../../components/UI/TabNavbar/TabNavbar';
import { useModalContext } from '../../context/modalContext'
import { usePreviewContext } from '../../context/previewContext'
import { useUserContext } from '../../context/userContext'
import LayoutHeader from '../../features/LayoutHeader/LayoutHeader'
import PostRenderer from '../../features/Post/PostRenderer'
import { useDebounce, useFilterQuery, useInfiniteFeed } from '../../helpers/hooks'
import { getRole, queryFromSearchParams } from '../../helpers/util'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'
import {
  deleteSingleWatchedPost,
  deleteWatchedHistory,
  getMediaAutocomplete,
  getWatchedHistoryFeed
} from '../../services/endpoints/media'
import { IInfinitePage, IPost } from '../../types/interfaces/ITypes'
import styles from './watchHistory.module.scss'
import ButtonTabNavbar from '../../components/UI/TabNavbar/ButtonTabNavbar'

const WatchHistory: FC = () => {
  const filter = useFilterQuery()
  const search = filter.get('searchTerm')
  const modelId = filter.get('model_id')
  const type = filter.get('type') ?? 'all'

  const location = useLocation()
  const values = queryString.parse(location.search)

  const [feedPosts, setFeedPosts] = useState<IPost[]>([])
  const [autocompleteTerm, setAutocompleteTerm] = useState<string>(search ?? '')

  const [shouldAutocomplete, setShouldAutocomplete] = useState(false)

  // const [searchTerm, setSearchTerm] = useState<string>('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const userData = useUserContext()
  const modalData = useModalContext()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const navigate = useNavigate()

  const { setInitialData, selectedPostData, setSelectedPostData } = usePreviewContext()

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
    ['getWatchedHistory', { filter: type, model_id: modelId, searchTerm: search }],
    getWatchedHistoryFeed
  )

  const deleteWatchedPostMutate = useMutation((postId: number) => deleteSingleWatchedPost(postId), {
    onError: () => {
      addToast('error', t('error:errorSomethingWentWrong'))
    },
    onSettled: () => {
      queryClient.invalidateQueries(['getWatchedHistory', { filter: type, model_id: modelId }])
    }
  })

  const deleteHistoryMutate = useMutation(() => deleteWatchedHistory(), {
    onMutate: async mutateData => {
      await queryClient.cancelQueries(['getWatchedHistory', { filter: type, searchTerm: modelId }])

      const previousData = queryClient.getQueryData<InfiniteData<IInfinitePage>>([
        'getWatchedHistory',
        { filter: type, model_id: modelId }
      ])

      // const newData = produce(previousData, (draft) => {
      //   draft.pages = [];
      // });
    },
    onSuccess: data => {
      queryClient.invalidateQueries(['getWatchedHistory', { filter: type, model_id: modelId }])
    },
    onError: () => {
      addToast('error', t('error:errorSomethingWentWrong'))
    },
    onSettled: () => {}
  })

  useEffect(() => {
    if (!search) {
      setShouldAutocomplete(true)
    }
  }, [])

  useEffect(() => {
    if (type) {
      if (userData) {
        setInitialData(userData.id, type, 'watched', undefined, [
          'getWatchedHistory',
          { filter: type, model_id: modelId }
        ])
      }
    } else {
      if (userData) {
        setInitialData(userData.id, 'all', 'watched', undefined, [
          'getWatchedHistory',
          { filter: type, model_id: modelId }
        ])
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
      title={t('watchHistory')}
      customContentClass='media__content__wrapper'
      handleGoBack={() => {
        if (search) {
          navigate('/watch-history')
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
            buttons={[
              {
                type: 'cta',
                icon: <IconTrashcanMd color={deleteModalOpen ? '#3099FE' : '#fff'} />,
                action: () => {
                  modalData.addModal(
                    t('deleteHistory'),
                    <ConfirmModal
                      body={t('onceYouDeleteYourWatchHistoryThisActionCannotBeUndone')}
                      customClass='confirmModal--font-light-14'
                      confirmFn={() => {
                        deleteHistoryMutate.mutate()
                        modalData.clearModal()
                      }}
                    />
                  )
                }
              }
            ]}
            selectFn={(value: string, id?: number) => {
              values.searchTerm = value
              if (id) values.model_id = `${id}`
              const searchQuery = queryFromSearchParams(values)
              setAutocompleteTerm(value)
              navigate({
                pathname: '/watch-history',
                search: searchQuery
              })
              if (shouldAutocomplete) {
                setShouldAutocomplete(false)
              }
            }}
            clearFn={() => {
              navigate('/watch-history')
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
                          dataQuery={['getWatchedHistory', { filter: type, model_id: modelId }]}
                          removeFromHistoryCb={() => deleteWatchedPostMutate.mutate(post.id)}
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
                        dataQuery={['getWatchedHistory', { filter: type, model_id: modelId }]}
                        removeFromHistoryCb={() => deleteWatchedPostMutate.mutate(post.id)}
                      />
                    )
                  }
                })}
              </>
            )}
          </div>
        </div>
      </WithHeaderSection>
    </BasicLayout>
  )
}

export default WatchHistory
