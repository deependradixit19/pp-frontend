import { useState, forwardRef, useRef, useEffect } from 'react'
import './_comment.scss'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import { IComment } from '../../types/interfaces/ITypes'
import { someTimeAgo } from '../../lib/dayjs'
import { AllIcons } from '../../helpers/allIcons'

import axiosInstance from '../../services/http/axiosInstance'

import AvatarHolder from '../../components/UI/AvatarHolder/AvatarHolder'

import avatarPlaceholder from '../../assets/images/user_placeholder.png'
import { IconHeartFill, IconLikeOutline, IconReplyOutline } from '../../assets/svg/sprite'
import { useOutsideAlerter, useReportComment } from '../../helpers/hooks'
import { useModalContext } from '../../context/modalContext'
import ConfirmModal from '../../components/UI/Modal/Confirm/ConfirmModal'
import { useUserContext } from '../../context/userContext'
import Report from '../../components/UI/Modal/Report/Report'
import { getReportTypes } from '../../services/endpoints/report'
import { IReportType, iComment } from '../../types/iTypes'

interface ICommentEntity {
  entityId: number
  parentId: number
  owner?: string
}

interface Props {
  data: any
  isReply: boolean
  repliesToggled?: boolean
  commentSelected: boolean
  selectedEntity: ICommentEntity | null
  isMyPost: boolean
  refetchComments: () => void
  toggleReplies?: () => void
  setIsCommentReply: (value: boolean) => void
  setSelectedEntity: (commentEntity: ICommentEntity | null) => void
  setInitialCommentLiked: (commentId: number) => void
  deleteComment: (commentId: number, isReply: boolean) => void
  optionsActive: boolean
  setOptionsActive: (val: boolean) => void
}

const Comment = forwardRef<HTMLInputElement, Props>(
  (
    {
      data,
      refetchComments,
      isReply,
      repliesToggled,
      commentSelected,
      isMyPost,
      toggleReplies,
      setIsCommentReply,
      setSelectedEntity,
      setInitialCommentLiked,
      deleteComment,
      optionsActive,
      setOptionsActive
    },
    ref
  ) => {
    const [canReport, setCanReport] = useState(false)

    const commentRef = useRef<HTMLDivElement>(null)

    const modalData = useModalContext()

    const user = useUserContext()
    const queryClient = useQueryClient()
    const { t } = useTranslation()

    const { reportComment } = useReportComment()

    const cachedData = queryClient.getQueryData<IReportType[]>(['reportTypes', 'content'])

    const optionsRef = useRef(null)

    const { data: reportTypesData } = useQuery(['reportTypes', 'content'], () => getReportTypes('content'), {
      staleTime: 3600,
      enabled: !cachedData
    })

    useEffect(() => {
      if (data) {
        if (isMyPost && data.user_id !== user.id) {
          !canReport && setCanReport(true)
        }
      }
    }, [data, user, canReport, isMyPost])

    useOutsideAlerter(
      optionsRef,
      () => {
        setOptionsActive(false)
      },
      ['comment__options', 'comment__options__option']
    )

    // we need all these clases for reply functionality to work.
    useOutsideAlerter(
      commentRef,
      () => {
        setIsCommentReply(false)
        // setSelectedEntity(null);
      },
      [
        'preview__comments__send',
        'preview__comments__send--icon',
        'comment__content__reply',
        'comment__content__like',
        'preview__comments__input',
        'preview__comments__input__emoji',
        'comment__user__options'
      ]
    )

    const likeComment = useMutation(
      async () => {
        await axiosInstance({
          method: 'post',
          url: `/api/like/comment/${data.id}`
        })
      },
      {
        onMutate: () => {},
        onSettled: () => {
          refetchComments()
          setInitialCommentLiked(data.id)
        }
      }
    )

    const handleCommentDelete = () => {
      modalData.addModal(
        t('deleteComment'),
        <ConfirmModal
          body={t('onceYouDeleteThisComment')}
          confirmFn={() => {
            setOptionsActive(false)
            deleteComment(data.id, isReply)
          }}
        />
      )
    }
    const handleCommentReport = () => {
      modalData.addModal(
        t('reportComment'),
        <Report
          options={reportTypesData}
          confirmFn={(message: string, reportType: number) =>
            reportComment.mutate(
              { commentId: data.id, message, reportType },
              {
                onSuccess: () => {
                  optionsActive && setOptionsActive(false)
                  modalData.clearModal()
                }
              }
            )
          }
          closeFn={() => {
            modalData.clearModal()
          }}
        />
      )
    }

    return (
      <>
        <div
          ref={commentRef}
          className={`comment ${isReply ? 'comment__reply' : ''}`}
          onClick={() => setOptionsActive(false)}
        >
          <div className={`comment__avatar ${repliesToggled || isReply ? 'comment__avatar--withreplies' : ''}`}>
            <AvatarHolder img={avatarPlaceholder} size='40' />
          </div>

          <div className='comment__body'>
            <div className='comment__user'>
              <div className='comment__user--left'>
                <span className='comment__user__name'>{data?.user?.display_name}</span>
                <span className='comment__user__time'>{someTimeAgo(data.created_at)}</span>
              </div>
              {(isMyPost || data.user_id === user.id) && (
                <div className='comment__user--right'>
                  <span
                    onClick={(e: any) => {
                      e.stopPropagation()
                      setOptionsActive(!optionsActive)
                    }}
                    className='comment__user__options'
                  >
                    {commentSelected && <img src={AllIcons.comment_ellipsis} alt={t('options')} />}
                  </span>
                </div>
              )}
            </div>

            <div className='comment__content'>
              <div
                className={`comment__content__text ${commentSelected ? 'comment__content__text--selected' : ''}`}
                onClick={() => {
                  setSelectedEntity({
                    entityId: data.id,
                    parentId: data.entity_id
                  })
                }}
              >
                <p>{data.comment}</p>
              </div>
              <div className='comment__content__actions'>
                <div
                  className='comment__content__reply'
                  onClick={() => {
                    if (ref && 'current' in ref) {
                      ref.current?.focus()
                      setIsCommentReply(true)
                      if (isReply) {
                        setSelectedEntity({
                          entityId: data.id,
                          parentId: data.entity_id,
                          owner: data.user?.first_name
                        })
                      } else {
                        setSelectedEntity({
                          entityId: data.id,
                          parentId: data.id,
                          owner: data.user?.first_name
                        })
                      }
                    }
                  }}
                >
                  <IconReplyOutline />
                </div>
                <div className='comment__content__like' onClick={() => likeComment.mutate()}>
                  {data.isLiked ? <IconHeartFill /> : <IconLikeOutline />}

                  <span>{data.like_count}</span>
                </div>
              </div>
            </div>

            <div className='comment__actions'>
              {!isReply && !!data?.comment_count && (
                <div
                  className={`comment__actions__expand ${repliesToggled ? 'comment__actions__expand--active' : ''}`}
                  onClick={toggleReplies}
                >
                  {repliesToggled
                    ? `${t('hideReplies')} (${data?.comment_count})`
                    : `${t('viewReplies')} (${data?.comment_count})`}
                </div>
              )}
            </div>
          </div>
        </div>
        {optionsActive ? (
          <div ref={optionsRef} className={`comment__options${optionsActive ? ' comment__options--active' : ''}`}>
            {canReport && (
              <div className='comment__options__option' onClick={() => handleCommentReport()}>
                <img src={AllIcons.post_report} alt={t('reportComment')} />
                {t('reportComment')}
              </div>
            )}

            {data?.user?.id === user.id && (
              <div className='comment__options__option' onClick={() => handleCommentDelete()}>
                <img src={AllIcons.post_delete} alt={t('deleteComment')} />
                {t('deleteComment')}
              </div>
            )}
          </div>
        ) : (
          ''
        )}
      </>
    )
  }
)

export default Comment
