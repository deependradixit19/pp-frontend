import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ActionCard from '../../../features/ActionCard/ActionCard'
import { IChartType } from '../../../services/endpoints/analytics'
import * as spriteIcons from '../../../assets/svg/sprite'
import { iActionCard } from '../../../types/iTypes'

interface IAnalyticsCard extends iActionCard {
  cardKey: string
  activeGraph?: string
  label: string
  value: string | number
  percentage: number | 'X'
  additionalLabel?: string
  salesCount?: number
  hasGraphBtn?: boolean
  onGraphClick: (cardKey: string) => void
}

const AnalyticsCard: FC<IAnalyticsCard> = ({
  cardKey,
  activeGraph,
  label,
  value,
  percentage,
  salesCount,
  additionalLabel,
  hasGraphBtn = true,
  onGraphClick,
  ...actionCardProps
}) => {
  const { t } = useTranslation()
  const percentageIncrement = useMemo(() => (percentage && percentage !== 'X' ? percentage > 0 : null), [percentage])

  return (
    <ActionCard
      hasArrow={false}
      absFix={true}
      icon={<spriteIcons.IconChartBlue />}
      text={
        <span className='analytics-card-currency-container'>
          <span className='analytics-card-currency'>
            {value}
            {percentageIncrement != null && (
              <span className={`analytics-card-currency-${percentageIncrement ? 'increment' : 'decrement'}`}>
                {percentageIncrement ? <spriteIcons.IconUpArrow /> : <spriteIcons.IconDownArrow />}
                <span>{Math.abs(percentage as number)}%</span>
              </span>
            )}
          </span>
          <span className='analytics-card-currency-type'>
            {label}
            {additionalLabel ? <span className='analytics-card-additional-text'>{` ${additionalLabel}`}</span> : null}
          </span>
        </span>
      }
      customHtml={
        <div className='analytics-card-sales-container'>
          {salesCount != null && (
            <div className='analytics-card-sales-number'>
              <div className='analytics-card-sales-number-value'>{salesCount}</div>
              <div className='analytics-card-sales-number-text'>{t('sales')}</div>
            </div>
          )}

          {hasGraphBtn && (
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
          )}
        </div>
      }
      {...actionCardProps}
    />
  )
}

export default AnalyticsCard
