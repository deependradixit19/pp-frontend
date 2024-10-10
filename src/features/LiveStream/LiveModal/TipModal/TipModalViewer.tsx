import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LiveModal from '../LiveModal'
import './_tipModal.scss'
import Girl from '../../../../assets/images/girl.jpg'
import CircleAvatar from '../../../../components/UI/CircleAvatar/CircleAvatar'
import Button from '../../../../components/UI/Buttons/Button'
import { IconCheckmark } from '../../../../assets/svg/sprite'

interface Props {
  onClose: () => void
}

const TipModalViewer: FC<Props> = ({ onClose }) => {
  const [personalMessageVissible, setPersonalMessageVissible] = useState(true)
  const [tipSent, setTipSent] = useState(true)

  const { t } = useTranslation()
  return (
    <LiveModal title={t('tipGoal')} onClose={onClose}>
      <div className='tipmodal'>
        <div className='tipmodal__top'>
          <CircleAvatar imgUrl={Girl} />
          <div className='tipmodal__input'>
            <div className='tipmodal__input--wrapper'>
              <input type='number' placeholder='$' />
              <p>
                {t('minimum')} <span>$3 USD</span> {t('orFree')}
              </p>
            </div>
          </div>
        </div>
        <div className='tipmodal__addMessage'>
          <p
            className={`tipmodal__addMessage--action ${!personalMessageVissible ? 'blue' : ''}`}
            onClick={() => setPersonalMessageVissible(personalMessageVissible => !personalMessageVissible)}
          >
            {t('addPersonalMessage')}
          </p>

          {personalMessageVissible && (
            <textarea name='personalMessage' id='personalMessage' placeholder={t('message')}></textarea>
          )}
        </div>

        <div className={`tipmodal__footer ${tipSent ? 'success' : ''}`}>
          {tipSent ? (
            <>
              <div className='success__message'>
                <div className='success__message--icon'>
                  <IconCheckmark />
                </div>
                <p>{t('yourTipHasBeenSent')}</p>
              </div>
              <Button
                text={t('close')}
                color='dark-grey'
                font='mont-14-normal'
                type='transparent--borderless'
                width='fit'
                height='3'
                padding='3'
                clickFn={onClose}
              />
            </>
          ) : (
            <>
              <Button
                text={t('cancel')}
                color='dark-grey'
                font='mont-14-normal'
                type='transparent--borderless'
                width='fit'
                height='3'
                padding='3'
                clickFn={onClose}
              />
              <Button
                text={t('save')}
                color='blue'
                font='mont-14-normal'
                width='fit'
                height='3'
                padding='5'
                clickFn={() => {
                  onClose()
                }}
              />
            </>
          )}
        </div>
      </div>
    </LiveModal>
  )
}

export default TipModalViewer
