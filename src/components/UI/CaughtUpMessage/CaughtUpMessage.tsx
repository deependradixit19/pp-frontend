import { useTranslation } from 'react-i18next'
import checkMark from '../../../assets/images/check-mark.png'
import './_caughtUpMessage.scss'

const CaughtUpMessage = () => {
  const { t } = useTranslation()

  return (
    <div className='caughtUpMessage'>
      <div className='caughtUpMessage__checkMark'>
        <div className='caughtUpMessage__checkMark__line' />
        <img className='caughtUpMessage__checkMark__icon' src={checkMark} alt='Check Mark' />
        <div className='caughtUpMessage__checkMark__line' />
      </div>
      <div className='caughtUpMessage__text'>{t('youAreAllCaughtUp')}</div>
    </div>
  )
}

export default CaughtUpMessage
