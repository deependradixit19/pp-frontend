import { FC, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from 'react-query'
import { IconOptionsReport, IconOptionsThrash } from '../../../../assets/svg/sprite'
import { addToast } from '../../../../components/Common/Toast/Toast'
import ConfirmModal from '../../../../components/UI/Modal/Confirm/ConfirmModal'
import Report from '../../../../components/UI/Modal/Report/Report'
import { useModalContext } from '../../../../context/modalContext'
import { useOutsideAlerter, useReportPost } from '../../../../helpers/hooks'

import { getReportTypes } from '../../../../services/endpoints/report'
import { IOption, IReportType } from '../../../../types/iTypes'

const OptionsDropdown: FC<{
  role: string
  content: string
  isOptionsNavOpen: boolean
  postId: number
  setIsOptionsNavOpen(value: boolean): void
  options: IOption[] | null
  deleteFn?: () => void
}> = ({ role, isOptionsNavOpen, postId, setIsOptionsNavOpen, options, deleteFn, content }) => {
  const modalData = useModalContext()
  const optionsRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  useOutsideAlerter(optionsRef, () => setIsOptionsNavOpen(false))

  const cachedData = queryClient.getQueryData<IReportType[]>(['reportTypes', 'content'])

  const { data: reportTypesData } = useQuery(['reportTypes', 'content'], () => getReportTypes('content'), {
    staleTime: 5000,
    enabled: !cachedData
  })

  const { reportPostMutation } = useReportPost()

  const handlePostDelete = () => {
    modalData.addModal(
      t('deletePost'),
      <ConfirmModal
        body={t('areYouSureYouWantToDeleteThisPost')}
        confirmFn={() => {
          setIsOptionsNavOpen(false)
          deleteFn && deleteFn()
        }}
      />
    )
  }

  const handlePostReport = () => {
    modalData.addModal(
      t('reportPost'),
      <Report
        options={reportTypesData}
        confirmFn={(message: string, reportType: number) =>
          reportPostMutation.mutate(
            { postId: postId, message, reportType },
            {
              onSuccess: () => {
                isOptionsNavOpen && setIsOptionsNavOpen(false)
                modalData.clearModal()
                addToast('success', t('postReported'))
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

  useEffect(() => {
    const prefetchPlaylists = async () => {
      await queryClient.prefetchQuery(['getPlaylists'])
    }

    isOptionsNavOpen && prefetchPlaylists()
  }, [isOptionsNavOpen, queryClient])

  return (
    <div className='post__options'>
      <div
        ref={optionsRef}
        className={`post__options__dropdown ${isOptionsNavOpen ? 'post__options__dropdown--active' : ''}`}
      >
        <div className='post__options__dropdown__section'>
          {options &&
            options.length &&
            options.map((opt: IOption, key: number) => (
              <div
                key={key}
                className={`post__options__option ${opt.disabled ? 'post__options__option--disabled' : ''}`}
                onClick={() => opt.action(postId)}
              >
                {typeof opt.icon === 'string' ? <img src={opt.icon} alt={opt.text} /> : opt.icon}
                <span>{opt.text}</span>
              </div>
            ))}
        </div>
        <div className='separator__line'></div>
        <div className='post__options__dropdown__section--bot'>
          {role === 'owner' ? (
            <div className='post__options__option' onClick={() => handlePostDelete()}>
              <IconOptionsThrash />
              <span>{content === 'story' ? t('deleteStory') : t('deletePost')}</span>
            </div>
          ) : (
            <div className='post__options__option' onClick={() => handlePostReport()}>
              <IconOptionsReport />
              <span>{t('reportPost')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OptionsDropdown
