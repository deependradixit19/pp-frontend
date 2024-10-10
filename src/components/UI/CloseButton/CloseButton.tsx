import { VFC } from 'react'
import { IconStatsClose } from '../../../assets/svg/sprite'

import styles from './CloseButton.module.scss'

type CloseButtonProps = {
  onClick: () => void
}

const CloseButton: VFC<CloseButtonProps> = ({ onClick }) => {
  return (
    <div className={styles.button} onClick={onClick}>
      <IconStatsClose />
    </div>
  )
}

export default CloseButton
