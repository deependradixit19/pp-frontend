import { FC } from 'react'
import './_fansList.scss'

import { useTranslation } from 'react-i18next'
import GroupCircles from '../../components/UI/GroupCircles/GroupCircles'

const FansList: FC<{
  title: string
  fans: { avatars: string[]; count: number }
  clickFn?: any
  customClass?: string
  type?: 'fans' | 'subscriptions' | 'creators'
}> = ({ title, fans, clickFn, customClass, type = 'fans' }) => {
  const { t } = useTranslation()
  const fansNumber = () => {
    if (!fans || fans.count === 0) {
      return t('empty')
    } else if (fans.count === 1) {
      return `${fans.count} ${type === 'fans' ? 'fan' : type === 'subscriptions' ? 'subscription' : 'creator'}`
    } else if (fans.count > 1 && fans.count < 1000) {
      return `${fans.count} ${type === 'fans' ? 'fans' : type === 'subscriptions' ? 'subscriptions' : 'creators'}`
    } else if (fans.count >= 1000) {
      return `+${parseFloat((fans.count / 1000).toFixed(1))}k ${
        type === 'fans' ? 'fans' : type === 'subscriptions' ? 'subscriptions' : 'creators'
      }`
    }
  }

  return (
    <div
      className={`fansList ${customClass ? customClass : ''}`}
      onClick={() => {
        if (clickFn) clickFn()
      }}
    >
      <div className='fansList__left'>
        <h2 className='fansList__left__title'>{title}</h2>
        <p className='fansList__left__fansNumber'>{fansNumber()}</p>
      </div>
      <div className='fansList__right'>{fans && <GroupCircles group={fans} size='36' />}</div>
    </div>
  )
}

export default FansList
