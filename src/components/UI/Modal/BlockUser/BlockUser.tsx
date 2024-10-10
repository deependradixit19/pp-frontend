import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import avatarPlaceholder from '../../../../assets/images/user_placeholder.png'
import style from './_block-user.module.scss'
import RadioButton from '../../../Common/RadioButton/RadioButton'
import Button from '../../Buttons/Button'
import { useModalContext } from '../../../../context/modalContext'
import { blockUser, getReportTypes, reportUser, restrictUser } from '../../../../services/endpoints/report'
import { addToast } from '../../../Common/Toast/Toast'
import { IconCLoseSquare } from '../../../../assets/svg/sprite'
import Report from '../Report/Report'
import { IReportType } from '../../../../types/iTypes'

const BlockUser: FC<{
  user: any
  successFn?: () => void
  clearModal?: boolean
}> = ({ user, successFn, clearModal = true }) => {
  const [activeButton, setActiveButton] = useState<string>('')
  const { t } = useTranslation()
  const modalData = useModalContext()
  const queryClient = useQueryClient()

  const cachedData = queryClient.getQueryData<IReportType[]>(['reportTypes', user.role])
  const {
    isLoading: reportTypesLoading,
    error: reportTypesError,
    data: reportTypesData
  } = useQuery(['reportTypes', user.role], () => getReportTypes(user.role), {
    staleTime: 5000,
    enabled: !cachedData
  })

  const toggleButton = (type: string) => {
    if (activeButton !== type) {
      setActiveButton(type)
    } else {
      setActiveButton('')
    }
  }

  const toggleReportModal = () =>
    modalData.addModal(
      user.role === 'fan' ? t('reportUser') : t('reportCreator'),
      <Report
        options={reportTypesData}
        confirmFn={(message: string, reportType: number) =>
          reportMutation.mutate({ report_type_id: reportType, text: message })
        }
        closeFn={() => {
          modalData.clearModal()
        }}
      />
    )

  const blockMutation = useMutation(() => blockUser(user.id), {
    onSuccess: () => {
      addToast('success', t('blocked'))
      if (successFn) {
        successFn()
      }
      if (clearModal) {
        modalData.clearModal()
      }
    }
  })
  const restrictMutation = useMutation(() => restrictUser(user.id), {
    onSuccess: () => {
      addToast('success', t('restricted'))
      if (successFn) {
        successFn()
      }
      if (clearModal) {
        modalData.clearModal()
      }
    }
  })
  const reportMutation = useMutation(
    (reportData: { text: string; report_type_id: number }) => reportUser(user.id, reportData),
    {
      onSuccess: () => {
        addToast('success', 'User reported')
        if (successFn) {
          successFn()
        }
        if (clearModal) {
          modalData.clearModal()
        }
      }
    }
  )

  return (
    <div className={style.container}>
      <div className={style.user_details}>
        <div className={style.user_avatar}>
          <img src={user?.avatar?.url || avatarPlaceholder} alt='avatar' />
          <div className={style.user_avatar_icon_container}>
            <IconCLoseSquare />
          </div>
        </div>
        <div className={style.user_name}>
          <div>{user?.display_name || ''}</div>
          <div>@{user?.username || ''}</div>
        </div>
      </div>

      <div className={style.options}>
        <div className={style.option}>
          <RadioButton active={activeButton === 'block'} clickFn={() => toggleButton('block')} />
          <p>{t('blockSubscriber')}</p>
        </div>
        <div className={style.option}>
          <RadioButton active={activeButton === 'restrict'} clickFn={() => toggleButton('restrict')} />
          <p>{t('restrictUser')}</p>
        </div>
        <div className={style.option}>
          <RadioButton active={activeButton === 'report'} clickFn={() => toggleButton('report')} />
          <p>{t('reportSubscriber')}</p>
        </div>
      </div>
      <div className={style.buttons}>
        <Button color='grey' text={t('close')} clickFn={() => modalData.clearModal()} />
        <Button
          color='black'
          text={t('confirm')}
          clickFn={() => {
            if (activeButton === 'block') {
              blockMutation.mutate()
            } else if (activeButton === 'restrict') {
              restrictMutation.mutate()
            } else if (activeButton === 'report') {
              toggleReportModal()
            }
          }}
          disabled={activeButton === ''}
        />
      </div>
    </div>
  )
}

export default BlockUser
