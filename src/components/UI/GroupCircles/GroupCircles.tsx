import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import bg1 from '../../../assets/images/home/bg1.png'
import './_groupCircles.scss'

const GroupCircles: FC<{
  group: { avatars: string[]; count: number }
  customClass?: string
  size: string
}> = ({ group, customClass, size }) => {
  const { t } = useTranslation()
  const fansNumber = () => {
    if (group.count > 4 && group.count < 1004) {
      return `+${group.count - 4}`
    } else {
      return `+${(group.count / 1000).toFixed(1)}k`
    }
  }

  return (
    <div className={`groupCircles ${customClass ? customClass : ''} groupCircles--${size}`}>
      {group.avatars.slice(0, 4).map((el, idx) => {
        return (
          <div className='groupCircles__avatar' key={idx}>
            <img src={el || bg1} alt={t('avatar')} />
          </div>
        )
      })}
      {group.count > 4 && <div className='groupCircles__overlay'>{fansNumber()}</div>}
    </div>
  )
}

export default GroupCircles
