import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { IconClose } from '../../../assets/svg/sprite'
import Button from '../Buttons/Button'
import SvgIconButton from '../Buttons/SvgIconButton'

import styles from './AcceptDecline.module.scss'

interface Props {
  customClass: string
  onAcceptCb: () => void
  onDeclineCb: () => void
}

const AcceptDecline: FC<Props> = ({ onAcceptCb, onDeclineCb, customClass }) => {
  const { t } = useTranslation()
  return (
    <div className={`${styles.acceptDecline} ${customClass ?? ''}`}>
      <SvgIconButton icon={<IconClose />} clickFn={onDeclineCb} type='circle' customClass='circleButton' />
      <Button text={t('accept')} color='blue' font='mont-14-normal' width='7' height='3' clickFn={onAcceptCb} />
    </div>
  )
}

export default AcceptDecline
