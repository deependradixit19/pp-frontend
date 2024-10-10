import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { IScheduleListElement } from '../../../types/interfaces/ITypes'

// Styling
import styles from './ScheduledListItem.module.scss'

interface ScheduledListItemProps {
  listItem: IScheduleListElement
  onEditClick: (postType: string, postId: number) => any
}

const ScheduledListItem: FC<ScheduledListItemProps> = ({ listItem, onEditClick }) => {
  const { t } = useTranslation()
  const itemStripeColor = () => {
    switch (listItem.postType) {
      case 'stream':
        return '#FF6F6F'
      case 'post':
        return '#6ABEFF'
      case 'story':
        return '#7FD287'

      default:
        return '#6ABEFF'
    }
  }

  const itemTitle = () => {
    switch (listItem.postType) {
      case 'stream':
        return t('liveStream')
      case 'post':
        return t('post')
      case 'story':
        return t('story')

      default:
        return t('post')
    }
  }

  const convertTime = () => {
    const hours = listItem.scheduledDate.getHours()
    const hoursHalf = hours > 12 ? hours - 12 : hours
    const timeOfDay = hours > 12 ? 'PM' : 'AM'
    const minutes = listItem.scheduledDate.getMinutes()

    return `${hoursHalf < 10 ? `0${hoursHalf}` : hoursHalf}:${minutes < 10 ? `0${minutes}` : minutes} ${timeOfDay}`
  }

  const groupsText = (groups: { name: string; count: number }[]) => {
    const firstPart = groups[0].name
    const secondPart = groups.length > 2 ? ` + ${groups.length}` : ''

    return `${firstPart}${secondPart}`
  }

  const groupsCount = (groups: { name: string; participants_count: number }[]) => {
    // return groups.reduce(
    //   (previousValue, currentValue) => previousValue + currentValue.count,
    //   0
    // );
    let c = 0
    groups.forEach(group => (c += group.participants_count))
    return c
  }

  return (
    <li className={styles.container}>
      <div className={styles.leftContainer}>
        <div
          className={styles.stripe}
          style={{
            backgroundColor: itemStripeColor()
          }}
        ></div>
        <div
          className={styles.itemImage}
          style={{
            backgroundImage: `url(${listItem.imageUrl})`
          }}
        ></div>
        <div className={styles.content}>
          <p className={styles.itemType}>{itemTitle()}</p>
          <p className={styles.postingTime}>{convertTime()}</p>
          {listItem.groups.length > 0 && (
            <div className={styles.group}>
              {groupsText(
                listItem.groups.map(group => ({
                  name: group.name,
                  count: group.participants_count
                }))
              )}
              <span>
                <svg width='10' height='12' viewBox='0 0 10 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M5.01596 5.95404C6.76146 5.95404 8.17646 4.62118 8.17646 2.97702C8.17646 1.33286 6.76146 0 5.01596 0C3.27047 0 1.85547 1.33286 1.85547 2.97702C1.85547 4.62118 3.27047 5.95404 5.01596 5.95404Z'
                    fill='white'
                  />
                  <path
                    d='M0.00289756 10.0898C-0.000797872 9.87431 0.0489949 9.66103 0.14834 9.46694C0.366815 9.19196 0.642502 8.96182 0.958526 8.7905C1.27455 8.61917 1.6243 8.51027 1.98647 8.47047C2.49655 8.36966 3.01359 8.30306 3.53368 8.27116C4.49931 8.19021 5.47064 8.19021 6.43628 8.27116C6.9568 8.30251 7.47405 8.37123 7.98348 8.4767C8.69096 8.61372 9.5439 8.88775 9.84804 9.48565C9.94807 9.67975 10 9.89269 10 10.1085C10 10.3242 9.94807 10.5372 9.84804 10.7313C9.5439 11.3541 8.69096 11.6032 7.98348 11.734C7.4743 11.8419 6.95702 11.9127 6.43628 11.9457C5.65109 12.0059 4.86249 12.0163 4.07582 11.9769C3.89419 11.983 3.71242 11.9705 3.53368 11.9395C3.01482 11.9091 2.49952 11.8383 1.99309 11.7277C1.6228 11.7007 1.26331 11.5974 0.940002 11.4252C0.616696 11.2531 0.337443 11.0162 0.121907 10.7313C0.0290665 10.5293 -0.0117111 10.3094 0.00289756 10.0898Z'
                    fill='white'
                  />
                </svg>
                {groupsCount(listItem.groups)}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className={styles.rightContainer}>
        <button className={styles.optionsButton} onClick={() => onEditClick(listItem.postType, listItem.postId)}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </button>
      </div>
    </li>
  )
}

export default ScheduledListItem
