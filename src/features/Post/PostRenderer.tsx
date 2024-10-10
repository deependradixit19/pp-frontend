import { FC, useEffect, useState } from 'react'

import { InfiniteData, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDeletePost, useEngagePost, useLikePost, usePinPost, useMediaCounters } from '../../helpers/hooks'
import { usePreviewContext } from '../../context/previewContext'
import { IInfinitePage, IPost } from '../../types/interfaces/ITypes'
import PostSidebar from './components/PostSidebar'
import OptionsDropdown from './components/OptionsDropdown/OptionsDropdown'
import StatsPopup from '../../components/UI/StatsPopup/StatsPopup'
import * as SvgIcons from '../../assets/svg/sprite'
import './_postRenderer.scss'
import { IFile } from '../../types/interfaces/IFile'
import { getSinglePost, purchasePremiumPost } from '../../services/endpoints/posts'
import PostInfoBottom from './components/PostInfoBottom/PostInfoBottom'
import Post from './Post'
import AvatarHolder from '../../components/UI/AvatarHolder/AvatarHolder'
import ShowMore from '../../components/Common/ShowMore/ShowMore'
import { someTimeAgo } from '../../lib/dayjs'
import placeholderAvatar from '../../assets/images/user_placeholder.png'
import PostInfoTop from './components/PostInfoTop/PostInfoTop'
import { addToast } from '../../components/Common/Toast/Toast'
import { useModalContext } from '../../context/modalContext'
import AddToPlaylist from '../../components/UI/Modal/AddToPlaylist/AddToPlaylist'
import { pagedPostEngageMutationOptions } from '../../helpers/mutationOptions'

interface Props {
  postIndex: number
  role: string
  postId: number
  postData: IPost
  dataQuery: any[]
  type?: string
  removeFromHistoryCb?: () => void
}

const PostRenderer: FC<Props> = ({ postIndex, role, postId, postData, dataQuery, type, removeFromHistoryCb }) => {
  const [statsOpen, setStatsOpen] = useState<boolean>(false)
  const [isOptionsNavOpen, setIsOptionsNavOpen] = useState<boolean>(false)
  const [allFiles, setAllFiles] = useState<IFile[]>([])

  const [like, setLike] = useState<{
    status: boolean
    count: number
  }>({
    status: false,
    count: 0
  })

  const queryClient = useQueryClient()
  const previewData = usePreviewContext()
  const modalContext = useModalContext()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { engagePost } = useEngagePost(
    postData?.id,
    postData?.is_engage,
    pagedPostEngageMutationOptions(queryClient, dataQuery)
  )

  const { counter, handleUpdateCounters } = useMediaCounters(postData)

  const optionsArray = () => {
    if (role === 'owner') {
      return [
        {
          icon: <SvgIcons.IconOptionsEdit />,
          text: t('editPost'),
          disabled: false,
          action: (id: number) => {
            navigate(`/edit/post/${id}`)
          }
        },
        {
          icon: <SvgIcons.IconOptionsPin />,
          text: postData.is_pinned ? t('unpinPost') : t('pinPost'),
          disabled: false,
          action: () => {
            pin.mutate(postId)
          }
        },
        {
          icon: <SvgIcons.IconOptionsStats />,
          text: t('viewStats'),
          disabled: false,
          action: () => {
            !statsOpen && setStatsOpen(true)
            isOptionsNavOpen && setIsOptionsNavOpen(false)
          }
        },
        {
          icon: <SvgIcons.IconOptionsCopy />,
          text: t('copyLinkToPost'),
          disabled: false,
          action: () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
              isOptionsNavOpen && setIsOptionsNavOpen(false)
              addToast('success', t('urlCopiedToClipboard'))
            })
          }
        },
        ...(removeFromHistoryCb
          ? [
              {
                icon: <SvgIcons.IconOptionsStats />,
                text: t('removeFromWatchHistory'),
                disabled: false,
                action: () => {
                  isOptionsNavOpen && setIsOptionsNavOpen(false)
                  removeFromHistoryCb()
                }
              }
            ]
          : [])
      ]
    } else {
      return [
        {
          icon: <SvgIcons.IconOptionsPlaylist />,
          text: t('addToList'),
          disabled: !allFiles.length,
          action: () => {
            modalContext.addModal(
              '',
              <AddToPlaylist
                postId={postId}
                closeFn={() => {
                  modalContext.clearModal()
                }}
              />,
              true,
              true
            )
          }
        },
        {
          icon: <SvgIcons.IconOptionsCopy />,
          text: t('copyLinkToPost'),
          disabled: false,
          action: () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
              isOptionsNavOpen && setIsOptionsNavOpen(false)
              addToast('success', t('urlCopiedToClipboard'))
            })
          }
        },
        ...(removeFromHistoryCb
          ? [
              {
                icon: <SvgIcons.IconOptionsStats />,
                text: t('removeFromWatchHistory'),
                disabled: false,
                action: () => {
                  isOptionsNavOpen && setIsOptionsNavOpen(false)
                  removeFromHistoryCb()
                }
              }
            ]
          : [])
      ]
    }
  }

  useEffect(() => {
    if (postData) {
      let allData: IFile[] = []
      if (postData.is_purchased) {
        allData = [...postData.photos, ...postData.videos, ...postData.sounds].sort((a, b) => a.order - b.order)

        setAllFiles(allData)
      } else {
        setAllFiles([])
      }
      setLike({
        status: postData.isLiked,
        count: postData.likes_count
      })
    }
  }, [postData])

  const onLikeMutate = async () => {
    await queryClient.cancelQueries(dataQuery)
    const cachedData = queryClient.getQueryData<InfiniteData<IInfinitePage>>(dataQuery)

    if (cachedData) {
      const newLikeState = postData.isLiked ? 'unlike' : 'like'
      const newData = {
        ...cachedData,
        pages: cachedData.pages.map(singleFeedPage => {
          return {
            ...singleFeedPage,
            page: {
              ...singleFeedPage.page,
              data: {
                ...singleFeedPage.page.data,
                data: singleFeedPage.page.data.data.map(post =>
                  post.id === postData.id
                    ? {
                        ...post,
                        isLiked: !post.isLiked,
                        likes_count: newLikeState === 'like' ? post.likes_count + 1 : post.likes_count - 1
                      }
                    : post
                )
              }
            }
          }
        })
      }

      queryClient.setQueryData(dataQuery, newData)
    }
    return { cachedData }
  }
  const onPinPostMutate = async () => {
    await queryClient.cancelQueries({ queryKey: dataQuery })

    const cachedData = queryClient.getQueryData<InfiniteData<IInfinitePage>>(dataQuery)
    if (cachedData) {
      const newData = {
        ...cachedData,
        pages: cachedData.pages.map(singleFeedPage => {
          return {
            ...singleFeedPage,
            page: {
              ...singleFeedPage.page,
              data: {
                ...singleFeedPage.page.data,
                data: singleFeedPage.page.data.data.map(post =>
                  post.id === postData.id
                    ? {
                        ...post,
                        is_pinned: !post.is_pinned
                      }
                    : post
                )
              }
            }
          }
        })
      }

      queryClient.setQueryData(dataQuery, newData)
    }
    return { cachedData }
  }
  const onDeletePostMutate = async () => {
    await queryClient.cancelQueries({ queryKey: dataQuery })

    const cachedData = queryClient.getQueryData<InfiniteData<IInfinitePage>>(dataQuery)
    if (cachedData) {
      const newData = {
        ...cachedData,
        pages: cachedData.pages.map(singleFeedPage => {
          return {
            ...singleFeedPage,
            page: {
              ...singleFeedPage.page,
              data: {
                ...singleFeedPage.page.data,
                data: singleFeedPage.page.data.data.filter(post => post.id !== postData.id)
              }
            }
          }
        })
      }

      queryClient.setQueryData(dataQuery, newData)
    }
    return { cachedData }
  }

  const onMutateError = (
    err: any,
    context: {
      cachedData: InfiniteData<IInfinitePage> | undefined
    }
  ) => {
    if (context) {
      queryClient.setQueryData(dataQuery, context.cachedData)
    }
  }

  const { deletePostMutation } = useDeletePost({
    onMutate: () => onDeletePostMutate(),
    onError: (
      err: any,
      context: {
        cachedData: InfiniteData<IInfinitePage> | undefined
      }
    ) => onMutateError(err, context)
  })

  const onSuccessLike = () => queryClient.invalidateQueries(dataQuery)

  const { likePost } = useLikePost(postId, onLikeMutate, undefined, onSuccessLike)

  const { pin } = usePinPost({
    onMutate: () => onPinPostMutate(),
    onError: (
      err: any,
      context: {
        cachedData: InfiniteData<IInfinitePage> | undefined
      }
    ) => onMutateError(err, context)
  })
  const purchasePost = useMutation(
    (postId: number) => {
      return purchasePremiumPost(postId)
    },
    {
      onSettled: () => {
        // queryClient.invalidateQueries(dataQuery);
        getSinglePost(postId).then(purchasedPost => {
          const cachedData = queryClient.getQueryData<InfiniteData<IInfinitePage>>(dataQuery)
          if (cachedData) {
            const newData = {
              ...cachedData,
              pages: cachedData.pages.map(singleFeedPage => {
                return {
                  ...singleFeedPage,
                  page: {
                    ...singleFeedPage.page,
                    data: {
                      ...singleFeedPage.page.data,
                      data: singleFeedPage.page.data.data.map(post => {
                        return post.id === purchasedPost.data.id ? purchasedPost.data : post
                      })
                    }
                  }
                }
              })
            }
            queryClient.setQueryData(dataQuery, newData)
          }
        })
      }
    }
  )

  const openComments = (postId: number, activeFile: string, postData: IPost) => {
    if (activeFile === 'img') {
      previewData.addModal(postId, 0, 'photo', postData)
    } else if (activeFile === 'vid') {
      previewData.addModal(postId, 0, 'video', postData)
    } else {
      previewData.addModal(postId, 0, 'text', postData)
    }
    previewData.setCommentsActive(true)
    previewData.handleMinimize(false)
  }

  const getCounterOffset = (allData: IFile[]) => {
    const hasAudio = allData.find(data => data.type === 'audio' || data.type === 'sound')
    if (allData.length > 1 && hasAudio) return 5
    return 0
  }

  if (postData.encode_status === 'processing')
    return (
      <div className='postRenderer'>
        <div
          className='postRenderer__options-nav'
          onClick={() => {
            setIsOptionsNavOpen(true)
          }}
        >
          <SvgIcons.IconThreeDots />
        </div>
        <OptionsDropdown
          role={role}
          content='post'
          isOptionsNavOpen={isOptionsNavOpen}
          setIsOptionsNavOpen={setIsOptionsNavOpen}
          postId={postId}
          options={optionsArray()}
          deleteFn={() => deletePostMutation.mutate(postId)}
        />
        <div className='post__files__processing'>
          <div className='post__files__processing--bg'></div>
          <div className='post__files__processing__content'>
            <div className='processingFile__loader'>
              <span className='processingFileLoader'></span>
            </div>
            <div className='post__files__processing__text'>{t('yourMediaIsCurrentlyProsessing')}</div>
          </div>
        </div>
        <div className='post__info'>
          <div className='post__info__body'>
            <AvatarHolder img={postData.user.avatar.url || placeholderAvatar} size='50' userId={postData.user.id} />
            <ShowMore
              userId={postData.user.id}
              customClass='post'
              name={postData.user.display_name}
              time={someTimeAgo(postData.created_at)}
              tags={['#bowieblue', '#bluechowchow']}
              text={postData.body || ''}
              mentions={postData.tags}
            />
          </div>
        </div>
      </div>
    )

  return (
    <div className={`postRenderer ${postData.stories && postData.stories?.length ? 'postRenderer__story' : ''}`}>
      {statsOpen && (
        <StatsPopup
          statsData={{
            overallRevenue: postData.overall_revenue,
            purchasesCount: postData.purchases_count,
            purchasesSum: postData.purchases_sum,
            tipsCount: postData.tips_count,
            tipsSum: postData.tips_sum,
            conversionRate: postData.conversion_rate ? postData.conversion_rate : 0,
            uniqueImpressions: postData.unique_impressions,
            views: postData.views,
            uniqueViews: postData.unique_views
          }}
          closeStats={() => setStatsOpen(false)}
        />
      )}
      {(!postData.stories || !postData.stories?.length) && (
        <>
          <div
            className='postRenderer__options-nav'
            onClick={() => {
              setIsOptionsNavOpen(true)
            }}
          >
            <SvgIcons.IconThreeDots />
          </div>
          <OptionsDropdown
            role={role}
            content='post'
            isOptionsNavOpen={isOptionsNavOpen}
            setIsOptionsNavOpen={setIsOptionsNavOpen}
            postId={postId}
            options={optionsArray()}
            deleteFn={() => deletePostMutation.mutate(postId)}
          />
        </>
      )}
      {!postData.live?.schedule_date && (!postData.stories || !postData.stories?.length) && (
        <PostSidebar
          showStats={role === 'owner'}
          hideTip={role === 'owner' || (!!postData.price && !postData.is_purchased)}
          openStats={() => !statsOpen && setStatsOpen(true)}
          like={like}
          modelData={{
            postId: postData.id,
            modelId: postData.user.id,
            avatarSrc: postData.user.avatar.url || postData.user.cropped_avatar.url || placeholderAvatar
          }}
          onTipModal={() => engagePost()}
          likePost={() => likePost.mutate()}
          commentsCount={postData.comment_count || 0}
          amount={postData.overall_revenue}
          openComments={() => openComments(postIndex, '', postData)}
          isEnabled={postData.is_purchased}
        />
      )}

      <div className='postRenderer__media'>
        <PostInfoTop pinned={postData.is_pinned} live={!!postData.live?.active} liveEnded={!!postData.live?.finished} />
        <Post
          role={role}
          postIndex={postIndex}
          postData={postData}
          isMyPost={role === 'owner'}
          allFiles={allFiles}
          dataQuery={dataQuery}
          purchaseProcessing={purchasePost.isLoading}
          purchasePostCb={(postId: number) => purchasePost.mutate(postId)}
          updateCounter={handleUpdateCounters}
          toggleStats={() => setStatsOpen(prevState => !prevState)}
        />
        <PostInfoBottom
          postId={postData.id}
          role={role}
          price={postData.price}
          mediaCount={counter}
          hideCounter={false}
          countOnly={!!postData.price}
          offset={getCounterOffset(allFiles)}
          premium={postData.is_purchased && Boolean(postData.price)}
        />
      </div>
      {postData.stories?.length === 0 && (
        <div className='post__info'>
          <div className='post__info__body'>
            <AvatarHolder img={postData.user.avatar.url || placeholderAvatar} size='50' userId={postData.user.id} />
            <ShowMore
              userId={postData.user.id}
              customClass='post'
              name={postData.user.display_name}
              time={someTimeAgo(postData.created_at)}
              tags={['#bowieblue', '#bluechowchow']}
              text={postData.body && allFiles.length ? postData.body : ''}
              mentions={postData.tags}
            />
          </div>
        </div>
      )}
    </div>
  )
}
export default PostRenderer
