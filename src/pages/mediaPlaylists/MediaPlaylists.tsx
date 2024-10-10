import { FC, useState, useCallback, useRef, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'

// Services
import { usePreviewContext } from '../../context/previewContext'
import { useUserContext } from '../../context/userContext'
import { useFilterQuery, useInfiniteFeed } from '../../helpers/hooks'
import { getRole } from '../../helpers/util'
import { getPlaylistFeed, getPlaylists } from '../../services/endpoints/media'
import { IPlaylist, IPost } from '../../types/interfaces/ITypes'

// Components
import FeedLoader from '../../components/Common/Loader/FeedLoader/FeedLoader'
import ButtonTabNavbar from '../../components/UI/TabNavbar/ButtonTabNavbar'
import PostRenderer from '../../features/Post/PostRenderer'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'

// Styling
import styles from '../likesHistory/likesHistory.module.scss'

const MediaPlaylists: FC = () => {
  const filter = useFilterQuery()
  const search = filter.get('searchTerm')
  const modelId = filter.get('model_id')
  const type = filter.get('type') ?? 'all'

  const navigate = useNavigate()
  const { id: playlistId } = useParams<{ id: string }>()
  const userData = useUserContext()

  const { setInitialData, selectedPostData, setSelectedPostData } = usePreviewContext()

  const [, setAutocompleteTerm] = useState<string>(search ?? '')
  const [, setShouldAutocomplete] = useState(false)
  const [feedPosts, setFeedPosts] = useState<IPost[]>([])
  const [title, setTitle] = useState<string>('')

  const { data: playlistsData } = useQuery(['getPlaylists'], () => getPlaylists(), {
    refetchOnWindowFocus: false,
    staleTime: 10000
  })

  const { data, error, isFetching, isFetchingNextPage, hasNextPage, status, fetchNextPage } = useInfiniteFeed(
    ['getPlaylistFeed', { filter: type, playlistId, model_id: modelId }],
    getPlaylistFeed
  )

  useEffect(() => {
    if (!search) {
      setShouldAutocomplete(true)
    }
  }, [search])

  useEffect(() => {
    if (playlistsData) {
      const playlist = playlistsData.find(
        (playlist: IPlaylist) => playlist.playlist_info.id === parseInt(playlistId ?? '')
      )
      if (playlist) {
        setTitle(playlist.playlist_info.playlist_name)
      }
    }
  }, [playlistsData, playlistId])

  useEffect(() => {
    if (type) {
      if (userData) {
        setInitialData(userData.id, type, 'playlist')
      }
    } else {
      if (userData) {
        setInitialData(userData.id, 'all', 'playlist')
      }
    }
  }, [type, userData, setInitialData])

  useEffect(() => {
    if (selectedPostData) {
      const selectedPost = feedPosts.find(post => post.id === selectedPostData.id)

      if (selectedPost) {
        setSelectedPostData(selectedPost)
      }
    }
  }, [feedPosts, selectedPostData, setSelectedPostData])

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
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  )

  status === 'error' && <p>Error: {error?.message}</p>
  return (
    <BasicLayout
      title={title}
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
                        dataQuery={['getPlaylistFeed', { filter: type, user_id: modelId }]}
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
                      dataQuery={['getPlaylistFeed', { filter: type, user_id: modelId, playlistId }]}
                    />
                  )
                }
              })}
            </>
          )}
        </div>
      </div>
    </BasicLayout>
  )
}

export default MediaPlaylists
