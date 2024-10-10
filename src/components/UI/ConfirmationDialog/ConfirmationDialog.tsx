import { FC } from 'react'
import './_confirmationDialog.scss'
import { useTranslation } from 'react-i18next'
import Button from '../Buttons/Button'

interface Props {
  icon: string
  title: string
  text: string
  onClose: () => void
}

const ConfirmationDialog: FC<Props> = ({ icon, title, text, onClose }) => {
  const { t } = useTranslation()
  return (
    <div className='dialog'>
      <div className='dialog__icon'>
        <img src={icon} alt='dialog icon' />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      <Button text={t('close')} color='black' font='mont-16-bold' height='5' width='12' clickFn={onClose} />
    </div>
  )
}

export default ConfirmationDialog
