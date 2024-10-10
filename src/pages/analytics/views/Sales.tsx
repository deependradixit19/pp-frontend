import { FC, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import WithHeaderSection from '../../../layouts/WithHeaderSection/WithHeaderSection'
import BarChart from '../../../features/BarChart/BarChart'
import { getSalesAnalytics, IChartType } from '../../../services/endpoints/analytics'
import SalesCard from '../cards/SalesCard'
import CategoriesDropdown from '../../../features/CategoriesDropdown/CategoriesDropdown'
import AnalyticsPeriodDropdown, {
  selectedToPeriod
} from '../../../features/AnalyticsPeriodDropdown/AnalyticsPeriodDropdown'
import Loader from '../../../components/Common/Loader/Loader'
import { getLink } from '../../../helpers/appLinks'
import { getAnalyticsChartData } from '../../../helpers/dataTransformations'

export const CHART_TYPES = Object.freeze({
  overall_revenue: 'overall_revenue',
  subscriptions: 'subscriptions',
  rebills: 'rebills',
  premium_sales: 'premium_sales',
  message_unlocks: 'message_unlocks',
  streaming_tips: 'streaming_tips',
  content_tips: 'content_tips',
  referral_revenue: 'referral_revenue'
})

const Sales: FC = () => {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedPeriod, setSelectedPeriod] = useState<{
    start: string
    end: string
  }>(selectedToPeriod['7'])
  const [activeGraph, setActiveGraph] = useState<IChartType>()

  const cards = useMemo(
    () => [
      {
        key: CHART_TYPES.overall_revenue,
        label: t('overallRevenue'),
        link: getLink.transactions({
          category: selectedCategory,
          dateFrom: selectedPeriod.start,
          dateTo: selectedPeriod.end
        })
      },
      {
        key: CHART_TYPES.subscriptions,
        label: t('subscriptions'),
        link: getLink.analyticsReports({
          categoryId: selectedCategory,
          dateFrom: selectedPeriod.start,
          dateTo: selectedPeriod.end,
          tab: 'subscriptions'
        })
      },
      {
        key: CHART_TYPES.rebills,
        label: t('rebills'),
        link: getLink.analyticsReports({
          categoryId: selectedCategory,
          dateFrom: selectedPeriod.start,
          dateTo: selectedPeriod.end,
          tab: 'subscriptions'
        })
      },
      {
        key: CHART_TYPES.premium_sales,
        label: t('premiumSales'),
        link: getLink.analyticsReports({
          categoryId: selectedCategory,
          dateFrom: selectedPeriod.start,
          dateTo: selectedPeriod.end,
          tab: 'content',
          subTab: 'premium'
        })
      },
      {
        key: CHART_TYPES.message_unlocks,
        label: t('messageUnlocks'),
        link: getLink.analyticsReports({
          categoryId: selectedCategory,
          dateFrom: selectedPeriod.start,
          dateTo: selectedPeriod.end,
          tab: 'messages'
        })
      },
      {
        key: CHART_TYPES.streaming_tips,
        label: t('streamingTips'),
        link: getLink.analyticsReports({
          categoryId: selectedCategory,
          dateFrom: selectedPeriod.start,
          dateTo: selectedPeriod.end,
          tab: 'streams'
        })
      },
      {
        key: CHART_TYPES.content_tips,
        label: t('contentTips'),
        link: getLink.analyticsReports({
          categoryId: selectedCategory,
          dateFrom: selectedPeriod.start,
          dateTo: selectedPeriod.end,
          tab: 'content',
          subTab: 'all'
        })
      },
      {
        key: CHART_TYPES.referral_revenue,
        label: t('referral'),
        link: getLink.transactions({
          // todo: better link?
          categoryId: selectedCategory,
          dateFrom: selectedPeriod.start,
          dateTo: selectedPeriod.end
        })
      }
    ],
    [selectedCategory, selectedPeriod.end, selectedPeriod.start, t]
  )

  const { data: salesData, isFetching: isFetchingSales } = useQuery<any>(
    ['salesAnalytics', selectedCategory, selectedPeriod],
    () =>
      getSalesAnalytics({
        dateFrom: selectedPeriod?.start,
        dateTo: selectedPeriod?.end,
        categoryId: selectedCategory ? parseInt(selectedCategory) : undefined
      }),
    {
      refetchOnMount: false,
      enabled: true,
      keepPreviousData: true
    }
  )

  const { data: graphData, isFetching: isFetchingGraph } = useQuery<any>(
    ['salesAnalyticsGraph', activeGraph, selectedCategory, selectedPeriod],
    () =>
      getAnalyticsChartData({
        fetchPromise: getSalesAnalytics({
          dateFrom: selectedPeriod?.start,
          dateTo: selectedPeriod?.end,
          categoryId: selectedCategory ? parseInt(selectedCategory) : undefined,
          chart: activeGraph
        })
      }),
    {
      enabled: !!activeGraph,
      keepPreviousData: true,
      refetchOnMount: false
    }
  )
  return (
    <>
      {activeGraph && (
        <div className='analytics-chart-container'>
          <BarChart
            chartData={graphData as any}
            datasetOptions={{
              borderRadius: 15,
              barThickness: 'flex'
            }}
          />
          {isFetchingGraph && <Loader />}
        </div>
      )}
      <WithHeaderSection
        customClass='analytics-sales-whs'
        headerSection={
          <>
            <div className='analytics-dropdown-container'>
              <div style={{ width: '50%', marginRight: '5px' }}>
                <CategoriesDropdown selectedCategoryId={selectedCategory} onSelectCategory={setSelectedCategory} />
              </div>
              <div style={{ width: '50%' }}>
                <AnalyticsPeriodDropdown selectedPeriodId={'7'} onSelectPeriod={setSelectedPeriod} />
              </div>
            </div>
          </>
        }
      >
        <div className='analytics-cards-container'>
          {cards.map(card => {
            const cardData = salesData?.[card.key]
            if (
              !cardData ||
              card.key === CHART_TYPES.subscriptions ||
              card.key === CHART_TYPES.rebills ||
              card.key === CHART_TYPES.streaming_tips ||
              card.key === CHART_TYPES.referral_revenue
            )
              return null

            return (
              <SalesCard
                key={card.key}
                cardKey={card.key}
                activeGraph={activeGraph}
                label={card.label}
                sum={cardData?.sum}
                percentage={cardData?.percentage}
                salesCount={cardData?.count}
                onGraphClick={key => {
                  if (activeGraph === key) {
                    setActiveGraph(undefined)
                    return
                  }
                  setActiveGraph(key as IChartType)
                }}
                link={card.link}
                linkInArrow={true}
              />
            )
          })}
          {isFetchingSales && <Loader />}
        </div>
      </WithHeaderSection>
    </>
  )
}

export default Sales
