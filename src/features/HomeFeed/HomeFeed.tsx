import React, { FC, useRef, useCallback, useState, useEffect } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { InView } from 'react-intersection-observer'
import { useUserContext } from '../../context/userContext'
import { IPost } from '../../types/interfaces/ITypes'

import './_homeFeed.scss'
import FeedNavbar from '../../components/UI/FeedNavbar/FeedNavbar'
import { usePreviewContext } from '../../context/previewContext'
import { useFilterQuery, useHomePostsFeed, useImpressionsTracker } from '../../helpers/hooks'
import PostRenderer from '../Post/PostRenderer'
import { IProfile } from '../../types/interfaces/IProfile'
import { getSubscriptionLists } from '../../services/endpoints/subscription_lists'
import EmptyFeedPost from '../Post/components/EmptyFeedPost/EmptyFeedPost'
import Loader from '../../components/Common/Loader/Loader'
import CaughtUpMessage from '../../components/UI/CaughtUpMessage/CaughtUpMessage'

interface Props {}

const HomeFeed: FC<Props> = () => {
  const [feedPosts, setFeedPosts] = useState<IPost[]>([])
  const [listId, setListId] = useState<number>(0)
  const [dataReady, setDataReady] = useState<boolean>(false)

  const userData = useUserContext()
  const queryClient = useQueryClient()
  const { addDebounceImpression } = useImpressionsTracker(true)

  const filter = useFilterQuery()
  const type = filter.get('type') ?? 'all'

  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useHomePostsFeed({
    list: listId
  })

  const { data: subscriptionLists } = useQuery('allSubscriptionLists', getSubscriptionLists, {
    refetchOnWindowFocus: false,
    staleTime: 5000
  })

  const { setInitialData, selectedPostData, setSelectedPostData } = usePreviewContext()

  useEffect(() => {
    if (subscriptionLists && subscriptionLists.data) {
      const selectedList = subscriptionLists.data.find((item: { name: string }) => item.name.toLowerCase() === type)
      if (subscriptionLists?.data?.length > 0) {
        if (selectedList) {
          setListId(selectedList.id)
        } else {
          setListId(subscriptionLists.data[0].id)
        }
      }
    }
  }, [subscriptionLists, type])

  useEffect(() => {
    if (type) {
      if (userData) {
        !!listId &&
          setInitialData(
            userData.id,
            type,
            'home',
            {
              listId
            },
            ['getHomeFeed', listId]
          )
      }
    } else {
      if (userData) {
        !!listId &&
          setInitialData(
            userData.id,
            type,
            'home',
            {
              listId
            },
            ['getHomeFeed', listId]
          )
      }
    }
  }, [type, userData, listId])

  useEffect(() => {
    queryClient.invalidateQueries(['getHomeFeed'])
  }, [listId])

  useEffect(() => {
    if (data && !isFetching) {
      const tmp = data.pages.map(page => {
        return page.page.data.data
      })
      setFeedPosts([...tmp.flat()])
      setDataReady(true)
    }
  }, [data, isFetching])

  useEffect(() => {
    if (selectedPostData) {
      const selectedPost = feedPosts.find(post => post.id === selectedPostData.id)

      if (selectedPost) {
        setSelectedPostData(selectedPost)
      }
    }
  }, [feedPosts])

  const getRole = (userData: IProfile, post: IPost) => {
    if (userData.role === 'model' && post.user_id === userData.id) return 'owner'
    return userData.role
  }

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
    <div className='home__feed'>
      <div id='viewportMarker'></div>
      <FeedNavbar onApply={(id: number) => setListId(id)} chosenListId={listId} />
      {!dataReady ? (
        <Loader />
      ) : (
        <React.Fragment>
          {!feedPosts.length ? (
            <EmptyFeedPost />
          ) : (
            feedPosts.map((post: IPost, index: number) => {
              if (feedPosts.length === index + 1) {
                return (
                  <InView
                    key={post.id}
                    as='div'
                    threshold={0.1}
                    triggerOnce
                    onChange={inView => {
                      inView && addDebounceImpression(post.id, post.user_id !== userData.id)
                    }}
                  >
                    <div key={post.id} ref={lastPostRef}>
                      <PostRenderer
                        postIndex={index}
                        role={getRole(userData, post)}
                        postId={post.id}
                        postData={post}
                        dataQuery={['getHomeFeed', listId]}
                      />
                    </div>
                  </InView>
                )
              } else {
                return (
                  <InView
                    key={post.id}
                    as='div'
                    threshold={0.1}
                    triggerOnce
                    onChange={inView => {
                      inView && addDebounceImpression(post.id, post.user_id !== userData.id)
                    }}
                  >
                    <PostRenderer
                      key={post.id}
                      postIndex={index}
                      role={getRole(userData, post)}
                      postId={post.id}
                      postData={post}
                      dataQuery={['getHomeFeed', listId]}
                    />
                  </InView>
                )
              }
            })
          )}
        </React.Fragment>
      )}
      {!!feedPosts.length && (
        <div className='moreFeed'>{isFetchingNextPage ? <Loader /> : hasNextPage ? '' : <CaughtUpMessage />}</div>
      )}
    </div>
  )
}

export default HomeFeed
