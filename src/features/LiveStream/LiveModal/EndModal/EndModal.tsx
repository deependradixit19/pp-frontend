import { FC } from 'react'
import './_endModal.scss'
import { useTranslation } from 'react-i18next'
import LiveModal from '../LiveModal'
import Button from '../../../../components/UI/Buttons/Button'

interface Props {
  onClose: () => void
  onConfirm: () => void
}
const EndModal: FC<Props> = ({ onClose, onConfirm }) => {
  const { t } = useTranslation()
  return (
    <LiveModal title='End Live Stream' onClose={onClose} customClass='endmodal'>
      <div className='endmodal'>
        <p className='endmodal__note'>{t('areYouSureYouWantToEndThisLiveStream')}</p>
        <div className='endmodal__buttons'>
          <Button
            text={t('cancel')}
            color='dark-grey'
            font='mont-14-normal'
            type='transparent--borderless'
            width='fit'
            height='3'
            padding='1-15'
            clickFn={onClose}
          />
          <Button
            text={t('endStream')}
            color='transparent'
            font='mont-14-normal'
            type='transparent--blue'
            width='fit'
            height='3'
            padding='1-15'
            clickFn={onConfirm}
          />
        </div>
      </div>
    </LiveModal>
  )
}

export default EndModal
