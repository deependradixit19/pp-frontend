import { FC } from 'react'
import styles from './_LoadingDots.module.scss'

const LoadingDots: FC<{
  visible?: boolean
  customClass?: string
  animation?: 'dotElastic' | 'dotFlashing'
}> = ({ visible = true, animation = 'dotFlashing', customClass }) => {
  if (!visible) return null
  return (
    <div className={`${styles.container} ${customClass ? customClass : ''}`}>
      <div className={`${styles.dotCommon} ${styles[animation]}`} />
    </div>
  )
}

export default LoadingDots
