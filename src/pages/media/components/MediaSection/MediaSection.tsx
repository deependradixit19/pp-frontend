import { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { IconCaretSm } from '../../../../assets/svg/sprite'
import IconButton from '../../../../components/UI/Buttons/IconButton'
import styles from './mediaSection.module.scss'

interface Props {
  icon: JSX.Element
  title: string
  action: string
  hasData: boolean
  children: ReactNode
}

const MediaSection: FC<Props> = ({ children, icon, title, action, hasData }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.sectionTitle}>
          <div className={styles.icon}>{icon}</div>
          <div className={styles.title}>{title}</div>
        </div>
        {hasData && (
          <Link to={action} className={styles.action}>
            <div className={styles.text}>View All</div>
            <div className={styles.button}>
              <IconButton icon={<IconCaretSm />} size='small' type='lightGrey' />
            </div>
          </Link>
        )}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  )
}
export default MediaSection
