import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconCaret } from '../../../assets/svg/sprite'
import Button from '../../../components/UI/Buttons/Button'
import LiveLeaderboard from './LiveLeaderboard/LiveLeaderboard'
import LiveSummary from './LiveSummary/LiveSummary'
import './_endStats.scss'

const navItems = ['summary', 'leaderboards']

interface Props {
  onClose: () => void
}

const EndStats: FC<Props> = ({ onClose }) => {
  const [selectedTab, setSelectedTab] = useState(navItems[0])

  const { t } = useTranslation()

  return (
    <div className='endstats'>
      <div className='endstats__bg'></div>
      <div className='endstats__header'>
        <div className='endstats__header--back' onClick={onClose}>
          <IconCaret />
        </div>
        <div className='endstats__header--title'>{t('liveVideoEnded')}</div>
      </div>
      <div className='endstats__nav'>
        <div className='tabnav'>
          {navItems.map(item => {
            return (
              <div
                key={item}
                className={`tabnav__item ${selectedTab === item ? 'active' : ''}`}
                onClick={() => setSelectedTab(item)}
              >
                {item}
              </div>
            )
          })}
        </div>
      </div>
      <div className='endstats__content'>
        {selectedTab === 'summary' && <LiveSummary />}
        {selectedTab === 'leaderboards' && <LiveLeaderboard />}
      </div>
      <div className='endstats__footer'>
        <Button
          text={t('ok')}
          color='transparent'
          font='mont-14-normal'
          type='transparent--white'
          width='16'
          height='5'
          padding='15'
          clickFn={onClose}
        />
      </div>
    </div>
  )
}

export default EndStats
