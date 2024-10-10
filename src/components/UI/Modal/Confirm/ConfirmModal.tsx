import { FC } from 'react'
import './_confirmModal.scss'
import { useTranslation } from 'react-i18next'
import { useModalContext } from '../../../../context/modalContext'
import Button from '../../Buttons/Button'

const ConfirmModal: FC<{
  body?: string | JSX.Element
  customClass?: string
  confirmFn: () => void
}> = ({ body, customClass, confirmFn }) => {
  const modalData = useModalContext()
  const { t } = useTranslation()

  return (
    <div className={`confirmModal ${customClass ? customClass : ''}`}>
      {body ? <div className='confirmModal__body'>{body}</div> : ''}
      <div className='confirmModal__actions'>
        <Button
          text={t('cancel')}
          color='grey'
          font='mont-14-normal'
          width='13'
          height='3'
          clickFn={() => modalData.clearModal()}
        />
        <Button
          text={t('confirm')}
          color='black'
          font='mont-14-normal'
          width='13'
          height='3'
          clickFn={() => {
            confirmFn()
            modalData.clearModal()
          }}
        />
      </div>
    </div>
  )
}

export default ConfirmModal
