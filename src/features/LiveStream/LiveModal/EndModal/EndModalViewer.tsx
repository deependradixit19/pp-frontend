import { FC } from 'react'
import './_endModal.scss'
import { useTranslation } from 'react-i18next'
import LiveModal from '../LiveModal'
import Button from '../../../../components/UI/Buttons/Button'
import { IconLiveEndStreamLarge } from '../../../../assets/svg/sprite'

interface Props {
  onClose: () => void
  onConfirm: () => void
}
const EndModalViewer: FC<Props> = ({ onClose, onConfirm }) => {
  const { t } = useTranslation()
  return (
    <LiveModal title='End Live Stream' onClose={onClose} customClass='endmodal' type='noCard'>
      <div className='endmodal__viewer'>
        <p className='endmodal__viewer--icon'>
          <IconLiveEndStreamLarge />
        </p>
        <p className='endmodal__viewer--note'>{t('liveStreamHasEnded')}</p>
        <div className='endmodal__viewer--button'>
          <Button
            text={t('close')}
            color='blue'
            width='fit'
            height='5'
            padding='2'
            font='mont-16-semi-bold'
            clickFn={onConfirm}
          />
        </div>
      </div>
    </LiveModal>
  )
}

export default EndModalViewer
