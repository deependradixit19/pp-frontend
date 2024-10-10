import { FC } from 'react'
import styles from './InfoDiv.module.scss'

interface InfoDivProps {
  icon: any
  title: string
  boldText: string
  plainText?: string
}

const InfoDiv: FC<InfoDivProps> = ({ icon, title, boldText, plainText }) => {
  return (
    <div className={styles.infoDiv}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.text}>
        <div className={styles.title}>{title}</div>
        <div className={styles.boldText}>
          {boldText} {plainText && <span className={styles.plainText}>{plainText}</span>}
        </div>
      </div>
    </div>
  )
}

export default InfoDiv
