import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { IconStatsClose } from '../../../assets/svg/sprite'
import { IStatsData } from '../../../types/interfaces/ITypes'
import './_statsPopup.scss'

interface Props {
  statsData: IStatsData
  closeStats: () => void
}

const StatsPopup: FC<Props> = ({ statsData, closeStats }) => {
  const { t } = useTranslation()
  return (
    <div className='stats__overlay'>
      <div className='stats__close' onClick={closeStats}>
        <IconStatsClose />
      </div>
      <div className='stats__data'>
        <div className='stats__data--top'>
          <div className='stat'>
            <div className='stat__text bold white'>{t('overallRevenue')}</div>
            <div className='stat__value blue'>${statsData.overallRevenue}</div>
          </div>
          <div className='stat'>
            <div className='stat__text'>{t('purchases')}</div>
            <div className='stat__value'>
              <span>{statsData.purchasesCount}</span>
              <span>${statsData.purchasesSum}</span>
            </div>
          </div>
          <div className='stat'>
            <div className='stat__text'>{t('tips')}</div>
            <div className='stat__value'>
              <span>{statsData.tipsCount}</span>
              <span>${statsData.tipsSum}</span>
            </div>
          </div>
          <div className='stats--divider'></div>
        </div>
        <div className='stats__data--bottom'>
          <div className='stat'>
            <div className='stat__text'>{t('conversionRate')}</div>
            <div className='stat__value blue'>{statsData.conversionRate}%</div>
          </div>
          <div className='stat'>
            <div className='stat__text'>{t('uniqueImpressions')}</div>
            <div className='stat__value'>{statsData.uniqueImpressions}</div>
          </div>
          <div className='stat'>
            <div className='stat__text'>{t('views')}</div>
            <div className='stat__value'>{statsData.views}</div>
          </div>
          <div className='stat'>
            <div className='stat__text'>{t('uniqueViewers')}</div>
            <div className='stat__value'>{statsData.uniqueViews}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsPopup
