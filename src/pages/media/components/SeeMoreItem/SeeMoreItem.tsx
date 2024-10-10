import { FC } from 'react'
import { Link } from 'react-router-dom'
import FlashingArrow from '../../../../components/Common/FlashingArrow/FlashingArrow'
import styles from './seeMoreItem.module.scss'

interface Props {
  text: string
  action: string
}

const SeeMoreItem: FC<Props> = ({ text, action }) => {
  return (
    <div className={styles.wrapper}>
      <Link className={styles.link} to={action}>
        <div className={styles.icon}>
          <FlashingArrow side='right' color='#778797' />
        </div>
        <div className={styles.text}>{text}</div>
      </Link>
    </div>
  )
}

export default SeeMoreItem
