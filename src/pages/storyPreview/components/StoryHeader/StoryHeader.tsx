import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { IconStatsClose } from '../../../../assets/svg/sprite'

import styles from './StoryHeader.module.scss'

const StoryHeader: FC<{
  date: Date
  avatar: string
  username: string
  withCloseButton: boolean
}> = ({ date, avatar, username, withCloseButton }): JSX.Element => {
  const generateTimeString = (date: Date) => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    const now = new Date()
    const msBetweenDates = Math.abs(date.getTime() - now.getTime())
    const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000)

    if (hoursBetweenDates < 1) {
      return `${Math.round(hoursBetweenDates * 60)} minutes ago`
    }
    if (hoursBetweenDates < 24) {
      return `${Math.floor(hoursBetweenDates)} hours ago`
    }

    return `${monthNames[date.getMonth()]} ${date.getDate()},
       ${date.getHours()}:${date.getMinutes()}`
  }
  return (
    <div className={styles.headerContainer}>
      <div className={styles.progressContainer}></div>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatarRing}>
              <img
                className={styles.avatar}
                src={avatar} // Avatar
                alt={`${username}'s avatar`}
              />
            </div>
          </div>
          <div className={styles.title}>{username}</div>
          <div className={styles.subtitle}>{generateTimeString(date)}</div>
        </div>
        {withCloseButton && (
          <Link to='/'>
            <IconStatsClose />
          </Link>
        )}
      </div>
    </div>
  )
}

function ProgresBar() {
  return <div>Im ProgressBar</div>
}

export default StoryHeader
