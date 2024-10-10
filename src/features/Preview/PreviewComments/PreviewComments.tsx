import React, { FC, useState, useEffect, useRef } from 'react'
import { InfiniteData, useMutation, useQueryClient, useQuery } from 'react-query'
import EmojiPicker from 'emoji-picker-react'

import { useTranslation } from 'react-i18next'
import { AllIcons } from '../../../helpers/allIcons'
import CommentBlock from '../../Comment/CommentBlock'
import './_previewComments.scss'
import { IComment, IInfiniteCommentsPage } from '../../../types/interfaces/ITypes'
import { postNewComment, postNewReply } from '../../../services/endpoints/posts'
import { usePreviewContext } from '../../../context/previewContext'
import { useCommentsInfinite, useDeleteComment } from '../../../helpers/hooks'
import { useUserContext } from '../../../context/userContext'
import noCommentsImg from '../../../assets/images/comment-bg.png'
import { getBannedWords, putBannedWord } from '../../../services/endpoints/api_global'
import { addToast } from '../../../components/Common/Toast/Toast'

interface ICommentEntity {
  entityId: number
  parentId: number
  owner?: string
}

interface Props {
  commentsActive: boolean
  activeCommentsPostId: number
  setCommentsActive: (value: boolean) => void
  initialComments: IComment[]
  commentCount: number
  isMyPost: boolean
  isSingleCommentLink?: boolean
  viewAllCommentsFn?: () => void
}
const PreviewComments: FC<Props> = ({
  commentsActive,
  activeCommentsPostId,
  setCommentsActive,
  initialComments,
  commentCount,
  isMyPost,
  isSingleCommentLink = false,
  viewAllCommentsFn
}) => {
  const userData = useUserContext()
  const [allCommentsData, setAllCommentsData] = useState<IComment[]>([])
  const [fetchCommentsEnabled, setFetchCommentsEnabled] = useState<boolean>(false)
  const [newComment, setNewComment] = useState<string>('')
  const [toggleEmojiPicker, setToggleEmojiPicker] = useState<boolean>(false)
  const [isCommentReply, setIsCommentReply] = useState<boolean>(false)
  const [selectedEntity, setSelectedEntity] = useState<ICommentEntity | null>(null)
  const [commentInputPadding, setCommentInputPadding] = useState<number>(0)
  const [optionsActive, setOptionsActive] = useState<boolean>(false)

  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { userId, query, selectedPostData, setSelectedPostData } = usePreviewContext()
  const { first_name, last_name, id } = useUserContext()

  const inputRef = useRef<HTMLInputElement>(null)
  const replytoRef = useRef<HTMLElement>(null)

  const { data: bannedWordsData, isLoading: isLoadingBannedWords } = useQuery('banned-words', getBannedWords)

  const { data, isFetching, fetchNextPage } = useCommentsInfinite(
    activeCommentsPostId,
    initialComments,
    fetchCommentsEnabled
  )

  useEffect(() => {
    if (selectedEntity?.owner) {
      replytoRef.current && setCommentInputPadding(replytoRef.current?.clientWidth)
    } else {
      setCommentInputPadding(0)
    }
  }, [selectedEntity])

  useEffect(() => {
    if (data && !isFetching) {
      const tmp = data.pages.map((page: IInfiniteCommentsPage) => {
        return page.page.data.data
      })
      setAllCommentsData([...tmp.flat()])
    }
  }, [data, isFetching])
  useEffect(() => {
    if (selectedPostData?.comment_count <= 3 && !!initialComments.length) {
      setAllCommentsData(initialComments)
    }
  }, [initialComments, selectedPostData])

  const newPostComment = useMutation(
    (comment: string) => {
      return postNewComment(activeCommentsPostId, comment)
    },
    {
      onMutate: newData => {
        queryClient.cancelQueries(['commentsForPost', activeCommentsPostId])
        const previousCommentsData = queryClient.getQueryData<InfiniteData<IInfiniteCommentsPage>>([
          'commentsForPost',
          activeCommentsPostId
        ])
        if (previousCommentsData && previousCommentsData.pages[0].page) {
          const tmpNewComment = [...previousCommentsData.pages]
          tmpNewComment[0].page.data.data = [
            {
              comment: newData,
              comment_count: 0,
              like_count: 0,
              isLiked: false,
              user_id: userId,
              entity_id: activeCommentsPostId,
              entity_type: 'App\\Models\\Post',
              updated_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              id: previousCommentsData.pages[0].page.data.data.length
                ? previousCommentsData.pages[0].page.data.data[0].id + 1
                : 1,
              user: { first_name, last_name, id },
              photos: [],
              videos: [],
              sounds: []
            },
            ...tmpNewComment[0].page.data.data
          ]
          const newCommentsData = {
            ...previousCommentsData,
            data: tmpNewComment
          }
          queryClient.setQueryData(['commentsForPost', activeCommentsPostId], newCommentsData)
          const tmpNewCommentLocal = [...allCommentsData]
          tmpNewCommentLocal.unshift({
            comment: newData,
            comment_count: 0,
            like_count: 0,
            isLiked: false,
            user_id: userId,
            entity_id: activeCommentsPostId,
            entity_type: 'App\\Models\\Post',
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            id: allCommentsData.length ? allCommentsData[0].id + 1 : 1,
            user: { first_name, last_name, id },
            photos: [],
            videos: [],
            sounds: []
          })
          setAllCommentsData(tmpNewCommentLocal)
        }
        setNewComment('')
        setToggleEmojiPicker(false)
        setSelectedEntity(null)
        setCommentInputPadding(0)
        setSelectedPostData({
          ...selectedPostData,
          comment_count: selectedPostData.comment_count + 1
        })
      },
      onSuccess: newData => {
        queryClient.invalidateQueries(['commentsForPost', activeCommentsPostId])
        queryClient.invalidateQueries(query)
      },
      onError: prevData => {
        queryClient.invalidateQueries(['commentsForPost', activeCommentsPostId])
      }
    }
  )

  const commentReply = useMutation((tmpData: { id: number; reply: string }) => postNewReply(tmpData), {
    onMutate: newData => {
      queryClient.cancelQueries(['commentsForPost', activeCommentsPostId])
      queryClient.cancelQueries(['repliesForComment', selectedEntity?.parentId])
      const previousRepliesData = queryClient.getQueryData<{
        data: IComment[]
      }>(['repliesForComment', selectedEntity?.parentId])

      const updatedComments = allCommentsData.map(comment => {
        if (selectedEntity?.parentId === comment.id) {
          return { ...comment, comment_count: comment.comment_count + 1 }
        }
        return comment
      })
      setAllCommentsData(updatedComments)

      if (previousRepliesData && selectedEntity) {
        const tmpData = [...previousRepliesData.data]
        tmpData.unshift({
          comment: newData.reply,
          comment_count: 0,
          like_count: 0,
          isLiked: false,
          user_id: userId,
          entity_id: selectedEntity?.parentId,
          entity_type: 'App\\Models\\Post',
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          id: previousRepliesData.data.length ? previousRepliesData.data[0].id + 1 : 1,
          photos: [],
          videos: [],
          sounds: []
        })

        const newCommentsData = {
          ...previousRepliesData,
          data: tmpData
        }

        queryClient.setQueryData(['repliesForComment', selectedEntity?.parentId], newCommentsData)
      }

      setNewComment('')
      setToggleEmojiPicker(false)
      setIsCommentReply(false)
      setSelectedEntity(null)
      setCommentInputPadding(0)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['commentsForPost', activeCommentsPostId])
      queryClient.invalidateQueries(['repliesForComment'])
    }
  })

  const { deleteComment } = useDeleteComment({
    onSuccess: (newData: {}, data: { commentId: number; parentId: number; isReply: boolean }) => {
      if (data.isReply) {
        const tmp = allCommentsData.map(comment => {
          if (data.parentId === comment.id) {
            return { ...comment, comment_count: comment.comment_count - 1 }
          }
          return comment
        })
        setAllCommentsData(tmp)
        queryClient.invalidateQueries(['repliesForComment'])
      } else {
        const tmp = allCommentsData.filter(comment => comment.id !== data.commentId)
        const tmpLastThree = selectedPostData.last_3_comments.filter(
          (comment: IComment) => comment.id !== data.commentId
        )
        setSelectedPostData({
          ...selectedPostData,
          comment_count: selectedPostData.comment_count - 1,
          last_3_comments: tmpLastThree
        })
        setAllCommentsData(tmp)
        queryClient.invalidateQueries(['commentsForPost', activeCommentsPostId])
        queryClient.invalidateQueries(query)
      }
    }
  })

  const setInitialCommentLiked = (commentId: number) => {
    const tmp = allCommentsData.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          like_count: comment.isLiked ? comment.like_count - 1 : comment.like_count + 1,
          isLiked: !comment.isLiked
        }
      }
      return comment
    })
    setAllCommentsData(tmp)
  }

  const onEmojiClick = (emojiObject: { emoji: string }) => {
    setNewComment(`${newComment}${emojiObject.emoji}`)
  }

  const handleLoadPreviousComments = () => {
    fetchNextPage()
  }

  return (
    <div className={`preview__comments__wrapper ${commentsActive ? ' preview__comments__wrapper--active' : ''}`}>
      <div className={`preview__comments${commentsActive ? ' preview__comments--active' : ''}`}>
        <div className='preview__comments__title'>
          <div className='preview__comments__title--top'>
            <p onClick={(e: any) => e.stopPropagation()}>
              {commentCount ? commentCount : ''} {t(`${commentCount === 1 ? 'comment' : 'comments'}`)}
            </p>
            <img onClick={() => setCommentsActive(false)} src={AllIcons.preview_close} alt={t('closeComments')} />
          </div>
          {!isSingleCommentLink && !fetchCommentsEnabled && commentCount > 3 && (
            <span onClick={() => setFetchCommentsEnabled(true)}>{t('loadPreviousComments')}</span>
          )}
          {!isSingleCommentLink && fetchCommentsEnabled && commentCount > allCommentsData.length && (
            <span onClick={() => handleLoadPreviousComments()}>{t('loadPreviousComments')}</span>
          )}
          {isSingleCommentLink && commentCount > 1 && (
            <span
              onClick={() => {
                viewAllCommentsFn?.()
              }}
            >
              {t('viewAllComments')}
            </span>
          )}
        </div>
        {!optionsActive && (
          <div className='preview__comments__add'>
            <div
              className='preview__comments__input'
              style={{
                paddingLeft: `${commentInputPadding ? commentInputPadding + 10 : 0}px`
              }}
            >
              <span ref={replytoRef} className='preview__comments__input--replyto'>
                {selectedEntity?.owner ? selectedEntity.owner : ''}
              </span>
              <input
                ref={inputRef}
                type='text'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setNewComment(e.currentTarget.value)
                }}
                value={newComment}
                placeholder={`${selectedEntity?.owner ? '' : `${t('message')}...`}`}
              />
              <div className='preview__comments__input__emoji' onClick={() => setToggleEmojiPicker(!toggleEmojiPicker)}>
                <img src={AllIcons.smile} alt={t('emojis')} />
              </div>
              {toggleEmojiPicker ? (
                <div className='emojiPicker'>
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              ) : (
                ''
              )}
            </div>
            <div
              className='preview__comments__send'
              onClick={() => {
                if (userData.status === 'restricted') {
                  addToast('error', t('commentRestrictedAcc'))
                  return
                }
                if (!isLoadingBannedWords) {
                  let usedBannedWords = []
                  if (bannedWordsData?.data?.length > 0) {
                    for (let i = 0; i < bannedWordsData.data.length; i++) {
                      if (newComment.trim().toLowerCase().includes(bannedWordsData.data[i].word.toLowerCase())) {
                        usedBannedWords.push(bannedWordsData.data[i])
                        putBannedWord({
                          id: bannedWordsData.data[i].id,
                          type: 'comment'
                        })
                      }
                    }
                  }
                  if (usedBannedWords.length > 0) {
                    usedBannedWords.forEach((word: string) =>
                      addToast('error', `${t('commentContainsBannedWord')} - ${word}`)
                    )
                    return
                  }
                  if (isCommentReply) {
                    newComment &&
                      selectedEntity &&
                      commentReply.mutate({
                        id: selectedEntity?.parentId,
                        reply: newComment
                      })
                  } else {
                    newComment && newPostComment.mutate(newComment)
                  }
                }
              }}
            >
              <img className='preview__comments__send--icon' src={AllIcons.button_send} alt={t('send')} />
            </div>
          </div>
        )}

        <div className='preview__comments__container'>
          {!allCommentsData.length && (
            <div className='preview__nocomments'>
              <img src={noCommentsImg} alt='no comments bg' />

              <h3>{t('noComments')}</h3>
            </div>
          )}
          {!!allCommentsData.length &&
            allCommentsData.map((comment: IComment, idx: number) => (
              <div key={idx}>
                <CommentBlock
                  ref={inputRef}
                  data={comment}
                  refetchComments={() => {
                    queryClient.invalidateQueries(['commentsForPost', activeCommentsPostId])
                  }}
                  selectedEntity={selectedEntity}
                  setIsCommentReply={setIsCommentReply}
                  setSelectedEntity={setSelectedEntity}
                  setInitialCommentLiked={setInitialCommentLiked}
                  deleteComment={(commentId, parentId, isReply) =>
                    deleteComment.mutate({ commentId, parentId, isReply })
                  }
                  isMyPost={isMyPost}
                  optionsActive={optionsActive}
                  setOptionsActive={(value: boolean) => setOptionsActive(value)}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default PreviewComments
