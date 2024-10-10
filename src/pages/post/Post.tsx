import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { useUserContext } from '../../context/userContext'
import 'react-loading-skeleton/dist/skeleton.css' // ?
import { usePreviewContext } from '../../context/previewContext'
import { getComment, getPaginatedPost } from '../../services/endpoints/posts'
import SinglePostPreview from '../../features/Preview/SinglePostPreview/SinglePostPreview'
import Loader from '../../components/Common/Loader/Loader'
import styles from './Post.module.scss'
import PreviewComments from '../../features/Preview/PreviewComments/PreviewComments'
import { IComment, IPost } from '../../types/interfaces/ITypes'
import { IconStatsClose } from '../../assets/svg/sprite'
import { useEngagePost, useFilterQuery } from '../../helpers/hooks'
import { pagedPostEngageMutationOptions } from '../../helpers/mutationOptions'
import { apiViewPost, postsImpression } from '../../services/endpoints/tracking'

const Post: FC = () => {
  const params = useParams<{ id: string }>()
  const postId = useMemo(() => Number(params.id), [params])
  const navigate = useNavigate()
  const [singleComment, setSingleComment] = useState<IComment>()
  const searchParams = useFilterQuery()
  const [hasControls, setHasControls] = useState(true)

  const userData = useUserContext()
  const queryClient = useQueryClient()
  const {
    setInitialData,
    selectedPostData,
    setSelectedPostData,
    setCommentsActive,
    commentsActive,
    resetPreviewState
  } = usePreviewContext()

  const removeSearchQuery = useCallback(() => {
    navigate({
      search: undefined
    })
  }, [navigate])

  const { data, isFetching } = useQuery(['paginatedSinglePost', postId], () => getPaginatedPost(postId), {
    refetchOnWindowFocus: false
  })

  const postData = useMemo<IPost>(() => data?.pages?.[0]?.page?.data?.data?.[0], [data])

  const { engagePost } = useEngagePost(
    postData?.id,
    postData?.is_engage,
    pagedPostEngageMutationOptions(queryClient, ['paginatedSinglePost', postId])
  )

  useEffect(() => {
    engagePost()
  }, [engagePost])

  useEffect(() => {
    if (postData?.id && postData?.user_id && userData?.id && postData?.user_id !== userData?.id) {
      postsImpression([postData.id])
      apiViewPost(postData.id)
    }
  }, [postData?.id, postData?.user_id, userData?.id])

  useEffect(() => {
    const commentId = searchParams.get('commentId')
    if (commentId) {
      getComment(parseInt(commentId)).then(data => {
        setSingleComment(data.data)
        setCommentsActive(true)
      })
    } else {
      setSingleComment(undefined)
    }
  }, [
    searchParams
    // setCommentsActive
  ])

  useEffect(() => {
    if (userData && userData.id && data && !isFetching) {
      setInitialData(userData.id, 'all', '', undefined, undefined, {
        selectedPost: postId,
        selectedSlide: 0,
        query: ['paginatedSinglePost', postId]
      })
      setSelectedPostData(postData)
    }
  }, [
    userData,
    data,
    isFetching,
    postId,
    postData
    // setInitialData,
    // setSelectedPostData,
  ])

  useEffect(
    () => {
      return () => {
        resetPreviewState()
      }
    },
    [
      // resetPreviewState
    ]
  )

  if (isFetching || !selectedPostData) {
    return <Loader />
  }

  return (
    <div className={styles.postContainer}>
      <div
        className={styles.close}
        onClick={() => {
          navigate(-1)
        }}
      >
        <IconStatsClose />
      </div>
      <SinglePostPreview
        post={selectedPostData}
        showControls={hasControls}
        isFirstPost={false}
        hasNextPage={false}
        isInViewport={true}
        minimizeFn={() => {}}
        toggleControls={() => setHasControls(!hasControls)}
      />
      {selectedPostData &&
        commentsActive &&
        (singleComment ? (
          <PreviewComments
            commentsActive={commentsActive}
            setCommentsActive={setCommentsActive}
            activeCommentsPostId={postId}
            initialComments={singleComment ? [singleComment] : selectedPostData?.['last_3_comments']}
            commentCount={selectedPostData?.comment_count}
            isMyPost={userData.id === selectedPostData.user?.id}
            isSingleCommentLink={!!singleComment}
            viewAllCommentsFn={() => {
              removeSearchQuery()
            }}
          />
        ) : (
          <PreviewComments
            commentsActive={commentsActive}
            setCommentsActive={setCommentsActive}
            activeCommentsPostId={postId}
            initialComments={selectedPostData?.['last_3_comments']}
            commentCount={selectedPostData?.comment_count}
            isMyPost={userData.id === selectedPostData?.user?.id}
          />
        ))}
    </div>
  )
}

export default Post
