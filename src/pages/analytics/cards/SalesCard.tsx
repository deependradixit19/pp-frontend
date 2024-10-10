import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ActionCard from '../../../features/ActionCard/ActionCard'
import { IChartType } from '../../../services/endpoints/analytics'
import * as spriteIcons from '../../../assets/svg/sprite'
import { toFixedNumber } from '../../../helpers/dataTransformations'
import { iActionCard } from '../../../types/iTypes'

interface ISalesCard extends iActionCard {
  cardKey: string
  activeGraph?: string
  label: string
  sum: number
  percentage: number | 'X'
  salesCount: number
  onGraphClick: (cardKey: string) => void
}

const SalesCard: FC<ISalesCard> = ({
  cardKey,
  activeGraph,
  label,
  sum,
  percentage,
  salesCount,
  onGraphClick,
  ...actionCardProps
}) => {
  const { t } = useTranslation()
  const percentageIncrement = useMemo(() => (percentage && percentage !== 'X' ? percentage > 0 : null), [percentage])

  return (
    <ActionCard
      hasArrow={true}
      icon={<spriteIcons.IconWallet2 />}
      text={
        <span className='analytics-card-currency-container'>
          <span className='analytics-card-currency'>
            ${toFixedNumber(sum, 0)}
            {percentageIncrement != null && (
              <span className={`analytics-card-currency-${percentageIncrement ? 'increment' : 'decrement'}`}>
                {percentageIncrement ? <spriteIcons.IconUpArrow /> : <spriteIcons.IconDownArrow />}
                <span>{Math.abs(percentage as number)}%</span>
              </span>
            )}
          </span>
          <span className='analytics-card-currency-type'>{label}</span>
        </span>
      }
      customHtml={
        <div className='analytics-card-sales-container'>
          <div className='analytics-card-sales-number'>
            <div className='analytics-card-sales-number-value'>{salesCount}</div>
            <div className='analytics-card-sales-number-text'>{t('sales')}</div>
          </div>

          <div
            className={`analytics-card-sales-icon ${
              activeGraph === cardKey ? 'analytics-card-sales-icon--active' : ''
            }`}
            onClick={() => {
              onGraphClick(cardKey as IChartType)
            }}
          >
            <spriteIcons.IconGraph color='#767676' />
          </div>
        </div>
      }
      {...actionCardProps}
    />
  )
}

export default SalesCard
