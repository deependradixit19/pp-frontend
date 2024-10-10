import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { IconViewers } from '../../../assets/svg/sprite'

import './_liveStats.scss'

interface Props {
  type: string
  clickFn?: () => void
}

const LiveStats: FC<Props> = ({ type, clickFn }) => {
  const { t } = useTranslation()
  return (
    <div className={`livestats ${type}`}>
      <div className='livestats__left'>
        <span>{type === 'viewers' ? t('live') : t('goal')}</span>
      </div>
      <div className='livestats__right' onClick={clickFn}>
        {type === 'viewers' && (
          <>
            <IconViewers />
            <span>23,567</span>
          </>
        )}
        {type === 'goal' && (
          <div className='goal-content'>
            <span>$325</span>
            <span>/</span>
            <span>23,567</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default LiveStats
