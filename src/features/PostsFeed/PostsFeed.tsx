import { FC, useState, useEffect, useRef, useCallback, Fragment } from 'react'
import './_postsFeed.scss'
import { useQueryClient, InfiniteData } from 'react-query'
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom'

import Skeleton from 'react-loading-skeleton'
import { useTranslation } from 'react-i18next'
import { produce } from 'immer'
import { InView } from 'react-intersection-observer'
import { useUserContext } from '../../context/userContext'
import 'react-loading-skeleton/dist/skeleton.css'

import NavigationBar from '../../components/UI/NavigationBar/NavigationBar'

import { useModalContext } from '../../context/modalContext'
import PostPlaceholder from '../Post/components/PostPlaceholder'
import FriendRequestModal from '../../components/UI/Modal/FriendRequest/FriendRequestModal'
import { getAccessToken } from '../../services/storage/storage'
import { useProfileContext } from '../../context/profileContext'
import * as SvgIcons from '../../assets/svg/sprite'
import SvgIconButton from '../../components/UI/Buttons/SvgIconButton'
import CategoriesSlider from '../../components/UI/CategoriesSlider/CategoriesSlider'
import { IInfinitePage, IPost } from '../../types/interfaces/ITypes'
import { usePreviewContext } from '../../context/previewContext'
import { useImpressionsTracker, usePostsFeed } from '../../helpers/hooks'

import { IProfile } from '../../types/interfaces/IProfile'

import PostRenderer from '../Post/PostRenderer'
import { POST_FINISHED } from '../../services/notifications/notificationTypes'

const PostsFeed: FC<{
  feedNav: Array<string>
  userId?: number
  user: any
  isFan?: boolean
  verifyNavOpen?: boolean
  setVerifyNavOpen?(value: boolean): void
  setSubscribeModalOpen: any
}> = ({ feedNav, userId, user, verifyNavOpen = false, setSubscribeModalOpen }) => {
  const [filter] = useState<string>('all')
  const [categoriesActive, setCategoriesActive] = useState<boolean>(false)
  const [selectedCategory, setSelecetedCategory] = useState<number | string>('')
  const [initialCategorySlide, setInitialCategorySlide] = useState(0)

  const [feedStatus, setFeedStatus] = useState<string>('')
  const [feedPosts, setFeedPosts] = useState<IPost[]>([])

  const { id, feed } = useParams<{ id: string; feed: string }>()

  const location = useLocation()
  const queryClient = useQueryClient()
  const modalData = useModalContext()
  const userData = useUserContext()
  const navigate = useNavigate()

  const viewportMarkerRef = useRef<HTMLDivElement>(null)

  const { setProfileMarker } = useProfileContext()

  const isAuthenticated = !!getAccessToken()

  const { addDebounceImpression } = useImpressionsTracker(true)

  const parsedId = typeof userId === 'string' ? parseInt(userId) : userId
  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = usePostsFeed(parsedId, {
    type: filter,
    media_category: selectedCategory
  })
  const { setInitialData, setFilters, selectedPostData, setSelectedPostData } = usePreviewContext()

  const { t } = useTranslation()

  if (error) {
    console.log(error)
  }

  const updatePostInFeed = useCallback((postId: number) => {
    const cachedData = queryClient.getQueryData<InfiniteData<IInfinitePage>>([
      'getFeed',
      parsedId,
      {
        type: filter,
        media_category: selectedCategory
      }
    ])
    const newData = produce(cachedData, draft => {
      draft?.pages.forEach(page => {
        const postToUpdate = page.page.data.data.find(post => post.id === postId)
        if (postToUpdate) {
          postToUpdate.encode_status = 'finished'
        }
      })
    })

    queryClient.setQueryData(
      [
        'getFeed',
        parsedId,
        {
          type: filter,
          media_category: selectedCategory
        }
      ],
      newData
    )
  }, [])

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

  useEffect(() => {
    if (userData.notificationsChannel) {
      userData.notificationsChannel.bind(POST_FINISHED, (data: any) => updatePostInFeed(data.post))
    }
    return () => {
      if (userData.notificationsChannel) {
        userData.notificationsChannel.unbind(POST_FINISHED)
      }
    }
  }, [userData])

  useEffect(() => {
    const findActivePage = (): void => {
      if (location.pathname.split('/')[1] === 'profile') {
        if (feed === 'premium') {
          // setFilter('premium');
          setInitialData(parseInt(id ?? ''), 'premium', 'profile', {
            type: filter,
            media_category: selectedCategory
          })
          setFilters(feed, selectedCategory)
        } else if (feed === 'videos') {
          // setFilter('video');
          setInitialData(
            parseInt(id ?? ''),
            'video',
            'profile',
            {
              type: filter,
              media_category: selectedCategory
            },
            [
              'getFeed',
              parsedId,
              {
                type: filter,
                media_category: selectedCategory
              }
            ]
          )
          setFilters(feed, selectedCategory)
        } else {
          // setFilter('all');
          setInitialData(
            parseInt(id ?? ''),
            'all',
            'profile',
            {
              type: filter,
              media_category: selectedCategory
            },
            [
              'getFeed',
              parsedId,
              {
                type: filter,
                media_category: selectedCategory
              }
            ]
          )
          setFilters(feed, selectedCategory)
        }
      } else {
        // setFilter(id);
        setInitialData(
          parseInt(id ?? ''),
          id,
          'profile',
          {
            type: filter,
            media_category: selectedCategory
          },
          [
            'getFeed',
            parsedId,
            {
              type: filter,
              media_category: selectedCategory
            }
          ]
        )
        setFilters(id, selectedCategory)
      }
    }

    findActivePage()
  }, [location, feed, id, selectedCategory])

  useEffect(() => {
    if (data && !isFetching) {
      const tmp = data.pages.map(page => {
        return page.page.data.data
      })
      const filteredTmp = tmp.flat().filter(obj => obj.user_id === userId)

      setFeedPosts([...filteredTmp])

      if (!!filteredTmp.length) {
        setFeedStatus('hasPosts')
      } else {
        setFeedStatus('empty')
      }
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

  const addFriend = () => {
    modalData.addModal(
      t('friendRequest'),
      <FriendRequestModal
        id={user.id}
        online={user?.online_status}
        avatar={user?.avatar.url || user?.cropped_avatar.url}
        display_name={user?.display_name}
        username={user?.username}
        follower_count={user?.follower_count}
        friend_count={user?.friend_count}
        close={() => modalData.clearModal()}
      />
    )
  }

  const getRole = (userData: IProfile, post: IPost) => {
    if (userData.role === 'model' && post.user_id === userData.id) return 'owner'
    return userData.role
  }

  const loginAndSubscribe = () => {
    setProfileMarker && setProfileMarker({ profileId: user.id, fromAuth: true })
    navigate('/auth')
  }

  if (!isAuthenticated) {
    return (
      <div className={`profilefeed ${verifyNavOpen ? 'extraPad' : ''}`}>
        <PostPlaceholder user={user} btnFn={loginAndSubscribe} btnText={t('subscribe')} />
      </div>
    )
  }
  if (isFetching && !isFetchingNextPage) {
    return (
      <div className={`profilefeed ${verifyNavOpen ? 'extraPad' : ''} skeleton`}>
        <div className='profilefeed__nav'>
          <NavigationBar navArr={feedNav} type='light' customClass='feed' />
          <div className='profilefeed__nav--secondary'>
            <SvgIconButton
              icon={<SvgIcons.IconCategories color={categoriesActive ? '#2894FF' : ''} />}
              size='medium'
              type='outline'
              clickFn={() => setCategoriesActive(!categoriesActive)}
            />
          </div>
        </div>
        <Skeleton borderRadius={20} height={370} />
        <Skeleton style={{ marginTop: 10 }} borderRadius={20} height={50} />
      </div>
    )
  }
  if (userData.role === 'model' && !user.isSubscribed && user.friends === 'Not friend' && user.id !== userData.id) {
    return (
      <div className={`profilefeed ${verifyNavOpen ? 'extraPad' : ''}`}>
        <PostPlaceholder btnFn={addFriend} user={user} btnText={t('addFriend')} />
      </div>
    )
  }

  if (userData.role === 'model' && !user.isSubscribed && user.friends === 'Pending' && user.id !== userData.id) {
    return (
      <div className={`profilefeed ${verifyNavOpen ? 'extraPad' : ''}`}>
        <PostPlaceholder btnFn={() => setSubscribeModalOpen(true)} user={user} btnText={t('subscribe')} />
      </div>
    )
  }
  if (userData.role === 'fan' && !user.isSubscribed) {
    return (
      <div className={`profilefeed ${verifyNavOpen ? 'extraPad' : ''}`}>
        <PostPlaceholder btnFn={() => setSubscribeModalOpen(true)} user={user} btnText={t('subscribe')} />
      </div>
    )
  }
  return (
    <div className={`profilefeed ${verifyNavOpen ? 'extraPad' : ''}`}>
      <div ref={viewportMarkerRef} id='viewportMarker'></div>
      {userData.role === 'fan' && user.isSubscribed && (
        <>
          <div className='profilefeed__nav'>
            <NavigationBar navArr={feedNav} type='light' customClass='feed' />
            {user.media_categories.length > 0 && (
              <div className='profilefeed__nav--secondary'>
                <SvgIconButton
                  icon={<SvgIcons.IconCategories color={categoriesActive ? '#2894FF' : ''} />}
                  size='medium'
                  type='outline'
                  clickFn={() => setCategoriesActive(!categoriesActive)}
                />
              </div>
            )}
          </div>
          {user.media_categories.length > 0 && (
            <div className='profilefeed_nav profilefeed_nav--secondary'>
              <CategoriesSlider
                categoriesOpen={categoriesActive}
                selectedCategory={selectedCategory}
                setSelecetedCategory={setSelecetedCategory}
                initialCategorySlide={initialCategorySlide}
                setInitialCategorySlide={setInitialCategorySlide}
                categories={user?.media_categories}
              />
            </div>
          )}
        </>
      )}

      {userData.role === 'model' && (user.isSubscribed || user.friends === 'Friends' || user.id === userData.id) && (
        <>
          <div className='profilefeed__nav'>
            <NavigationBar navArr={feedNav} type='light' customClass='feed' />
            <div className='profilefeed__nav--secondary'>
              <SvgIconButton
                icon={<SvgIcons.IconCategories color={categoriesActive ? '#2894FF' : ''} />}
                size='medium'
                type='outline'
                clickFn={() => setCategoriesActive(!categoriesActive)}
              />
            </div>
          </div>
          <div className='profilefeed_nav profilefeed_nav--secondary'>
            <CategoriesSlider
              categoriesOpen={categoriesActive}
              selectedCategory={selectedCategory}
              setSelecetedCategory={setSelecetedCategory}
              initialCategorySlide={initialCategorySlide}
              setInitialCategorySlide={setInitialCategorySlide}
              categories={user?.media_categories}
            />
          </div>
        </>
      )}
      {feedStatus === 'hasPosts' && (
        <>
          {status === 'loading' ? (
            <>
              <div className='iic__loader'></div>
              <div className='iic__loader--top'></div>
              <div className='iic__loader--left'></div>
            </>
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
                        dataQuery={[
                          'getFeed',
                          userId,
                          {
                            type: filter,
                            media_category: selectedCategory
                          }
                        ]}
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
                      postIndex={index}
                      role={getRole(userData, post)}
                      postId={post.id}
                      postData={post}
                      dataQuery={[
                        'getFeed',
                        userId,
                        {
                          type: filter,
                          media_category: selectedCategory
                        }
                      ]}
                    />
                  </InView>
                )
              }
            })
          )}
          <div>
            {isFetchingNextPage ? (
              <>
                <div className='iic__loader'></div>
                <div className='iic__loader--top'></div>
                <div className='iic__loader--left'></div>
              </>
            ) : hasNextPage ? (
              ''
            ) : (
              t('nothingMoreToLoad')
            )}
          </div>
          <div>
            {isFetching && !isFetchingNextPage ? (
              <>
                <div className='iic__loader'></div>
                <div className='iic__loader--top'></div>
                <div className='iic__loader--left'></div>
              </>
            ) : null}
          </div>
        </>
      )}
      {feedStatus === 'empty' && (
        <>
          {userData.id === user.id ? (
            selectedCategory !== '' ? (
              <div className='profilefeed__noposts'>{t('noPostsInThisCategory')}</div>
            ) : (
              <Link to={'/new/post/create'}>
                <div className='profilefeed-model-no-posts'>
                  <div className='profilefeed-model-no-posts-background'></div>
                  <div className='profilefeed-model-no-posts-inner'>
                    <div className='profilefeed-model-no-posts-add-button'>
                      <SvgIcons.IconPlusInBox color='#ffffff' width='28' height='28' />
                    </div>
                    <div className='profilefeed-model-no-posts-text'>{t('addYourFirstPhotoOrVideo')}</div>
                  </div>
                </div>
              </Link>
            )
          ) : (
            <div className='profilefeed__noposts'>{t('userHasntPostedAnythingYet')}</div>
          )}
        </>
      )}
      <div className='edit__post__nav--wrapper'></div>
    </div>
  )
}

export default PostsFeed
