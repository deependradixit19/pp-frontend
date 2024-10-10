import { FC, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation } from 'react-router-dom'
import {
  IconOptionsCopy,
  IconOptionsHide,
  IconOptionsPlaylist,
  IconOptionsReport,
  IconOptionsThrash,
  IconThreeDots
} from '../../../../assets/svg/sprite'
import { addToast } from '../../../../components/Common/Toast/Toast'
import AddToPlaylist from '../../../../components/UI/Modal/AddToPlaylist/AddToPlaylist'
import Report from '../../../../components/UI/Modal/Report/Report'
import { useModalContext } from '../../../../context/modalContext'
import OptionsDropdown from '../../../../features/Post/components/OptionsDropdown/OptionsDropdown'
import { AllIcons } from '../../../../helpers/allIcons'
import { useOutsideAlerter, useReportPost } from '../../../../helpers/hooks'
import { deleteSingleWatchedPost } from '../../../../services/endpoints/media'
import { getReportTypes } from '../../../../services/endpoints/report'
import { IOption, IReportType } from '../../../../types/iTypes'
import styles from './mediaItemOptions.module.scss'

interface Props {
  role: string
  type: string
  isOpen: boolean
  postId: number
  setIsOpen: (value: boolean) => void
}
const MediaItemOptions: FC<Props> = ({ role, type, isOpen, postId, setIsOpen }) => {
  const modalContext = useModalContext()
  const optionsRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  const location = useLocation()
  const { reportPostMutation } = useReportPost()
  const { t } = useTranslation()

  const cachedData = queryClient.getQueryData<IReportType[]>(['reportTypes', 'content'])
  const {
    isLoading: reportTypesLoading,
    error: reportTypesError,
    data: reportTypesData
  } = useQuery(['reportTypes', 'content'], () => getReportTypes('content'), {
    staleTime: 5000,
    enabled: !cachedData
  })
  useOutsideAlerter(
    optionsRef,
    () => {
      setIsOpen(false)
    },
    ['media__options']
  )

  const deleteWatchedPostMutate = useMutation(() => deleteSingleWatchedPost(postId), {
    onMutate: mutateData => {},
    onSuccess: data => {
      queryClient.invalidateQueries(['getMediaData'])
    },
    onError: () => {
      addToast('error', t('error:errorSomethingWentWrong'))
    },
    onSettled: () => {}
  })

  const handlePostReport = () => {
    modalContext.addModal(
      t('reportPost'),
      <Report
        options={reportTypesData}
        confirmFn={(message: string, reportType: number) =>
          reportPostMutation.mutate(
            { postId: postId, message, reportType },
            {
              onSuccess: () => {
                modalContext.clearModal()
                addToast('success', t('postReported'))
              }
            }
          )
        }
        closeFn={() => {
          modalContext.clearModal()
        }}
      />
    )
  }

  const getOptionsArray = (type: string) => {
    if (type === 'purchase') {
      return [
        {
          icon: <IconOptionsPlaylist />,
          text: t('addToList'),
          disabled: false,
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
          icon: <IconOptionsCopy />,
          text: t('copyLinkToPost'),
          disabled: false,
          action: () => {
            navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`).then(() => {
              // isOptionsNavOpen && setIsOptionsNavOpen(false);
              addToast('success', t('urlCopiedToClipboard'))
            })
          }
        }
      ]
    } else if (type === 'playlists') {
      return [
        {
          icon: <IconOptionsPlaylist />,
          text: t('addToList'),
          disabled: false,
          action: () => {
            modalContext.addModal(
              '',
              <AddToPlaylist
                postId={1}
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
          icon: <IconOptionsThrash />,
          text: t('removeFromWatchHistory'),
          disabled: false,
          action: () => {
            console.log('Should hide from purchases')
          }
        },
        {
          icon: <IconOptionsCopy />,
          text: t('copyLinkToPost'),
          disabled: false,
          action: () => {
            navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`).then(() => {
              // isOptionsNavOpen && setIsOptionsNavOpen(false);
              addToast('success', t('urlCopiedToClipboard'))
            })
          }
        }
      ]
    } else if (type === 'watch-history') {
      return [
        {
          icon: <IconOptionsPlaylist />,
          text: t('addToList'),
          disabled: false,
          action: () => {
            modalContext.addModal(
              '',
              <AddToPlaylist
                postId={1}
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
          icon: <IconOptionsThrash />,
          text: t('removeFromWatchHistory'),
          disabled: false,
          action: () => {
            deleteWatchedPostMutate.mutate()
          }
        },
        {
          icon: <IconOptionsCopy />,
          text: t('copyLinkToPost'),
          disabled: false,
          action: () => {
            navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`).then(() => {
              // isOptionsNavOpen && setIsOptionsNavOpen(false);
              addToast('success', t('urlCopiedToClipboard'))
            })
          }
        }
      ]
    } else if (type === 'likes') {
      return [
        {
          icon: <IconOptionsPlaylist />,
          text: t('addToList'),
          disabled: false,
          action: () => {
            modalContext.addModal(
              '',
              <AddToPlaylist
                postId={1}
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
          icon: <IconOptionsCopy />,
          text: t('copyLinkToPost'),
          disabled: false,
          action: () => {
            navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`).then(() => {
              // isOptionsNavOpen && setIsOptionsNavOpen(false);
              addToast('success', t('urlCopiedToClipboard'))
            })
          }
        }
      ]
    } else {
      return null
    }
  }

  const options = getOptionsArray(type)

  if (!postId) return null
  return (
    <div ref={optionsRef} className={`${styles.container} ${isOpen ? styles.active : ''}`}>
      <div className={styles.section}>
        {options &&
          options.length &&
          options.map((opt: IOption, key: number) => (
            <div
              key={key}
              className={`${styles.option} ${opt.disabled ? styles.disabled : ''}`}
              onClick={() => {
                setIsOpen(false)
                opt.action(postId)
              }}
            >
              {opt.icon}
              <span>{opt.text}</span>
            </div>
          ))}
      </div>
      <div className={styles.separator}></div>
      <div className={`${styles.section} ${styles.sectionBottom}`}>
        {role === 'owner' ? (
          <div
            className={styles.option}
            // onClick={() => handlePostDelete()}
          >
            <IconOptionsThrash />
            <span>{t('deletePost')}</span>
          </div>
        ) : (
          <div
            className={styles.option}
            onClick={() => {
              setIsOpen(false)
              handlePostReport()
            }}
          >
            <IconOptionsReport />
            <span>{t('reportPost')}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default MediaItemOptions
