import { FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { produce } from 'immer'
import { DeepPartial } from 'chart.js/dist/types/utils'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import WithHeaderSection from '../../../layouts/WithHeaderSection/WithHeaderSection'
import AnalyticsPeriodDropdown, {
  selectedToPeriod
} from '../../../features/AnalyticsPeriodDropdown/AnalyticsPeriodDropdown'
import CategoriesDropdown from '../../../features/CategoriesDropdown/CategoriesDropdown'
import { getReportsAnalytics, ReportFilter, ReportTab } from '../../../services/endpoints/analytics'
import BarChart, { defaultChartOptions } from '../../../features/BarChart/BarChart'
import AnalyticsCard from '../cards/AnalyticsCard'
import { getAnalyticsChartData, stringVal, valToDollar, valToPercent } from '../../../helpers/dataTransformations'
import Loader from '../../../components/Common/Loader/Loader'
import { useQueryParams } from '../../../helpers/hooks'
import { appendedArgsFn } from '../../../helpers/util'
import * as spriteIcons from '../../../assets/svg/sprite'

const defaultCardOptions = Object.freeze({
  valFormatFn: stringVal,
  chartLabelFn: stringVal,
  hasGraphBtn: true,
  icon: <spriteIcons.IconChartBlue />,
  absFix: true,
  additionalLabelKey: undefined
})

const reportCards = Object.freeze({
  // content
  engagement_rate: {
    ...defaultCardOptions,
    valFormatFn: valToPercent,
    chartLabelFn: appendedArgsFn(valToPercent, 2),
    labelKey: 'EngagmentRate'
  },
  post_views: {
    ...defaultCardOptions,
    labelKey: 'PostViews'
  },
  likes: {
    ...defaultCardOptions,
    labelKey: 'likes'
  },
  comments: {
    ...defaultCardOptions,
    labelKey: 'comments'
  },
  posts: {
    ...defaultCardOptions,
    labelKey: 'posts'
  },
  premium_posts: {
    ...defaultCardOptions,
    labelKey: 'PremiumPosts'
  },
  stories: {
    ...defaultCardOptions,
    labelKey: 'stories',
    hasGraphBtn: false
  },
  video_completion_rate: {
    ...defaultCardOptions,
    labelKey: 'VideoCompletionRate',
    valFormatFn: valToPercent,
    chartLabelFn: appendedArgsFn(valToPercent, 2),
    additionalLabelKey: 'avgInParentheses'
  },
  average_fan_session: {
    ...defaultCardOptions,
    labelKey: 'AverageFanSession',
    valFormatFn: (val: number) => dayjs.duration(val, 'seconds').format('mm:ss'),
    chartLabelFn: (val: number) => dayjs.duration(val, 'seconds').format('mm:ss')
  },
  impressions: {
    ...defaultCardOptions,
    labelKey: 'impressions'
  },
  conversion_rate: {
    ...defaultCardOptions,
    labelKey: 'conversionRate',
    valFormatFn: valToPercent,
    chartLabelFn: appendedArgsFn(valToPercent, 2)
  },
  purchases: {
    ...defaultCardOptions,
    labelKey: 'purchases'
  },
  views: {
    ...defaultCardOptions,
    labelKey: 'views'
  },
  // subscriptions
  subscription_conversion_rate: {
    ...defaultCardOptions,
    labelKey: 'SubscriptionConversion',
    valFormatFn: valToPercent,
    chartLabelFn: appendedArgsFn(valToPercent, 2)
  },
  profile_visits: {
    ...defaultCardOptions,
    labelKey: 'ProfileVisits'
  },
  rebills_ratio: {
    ...defaultCardOptions,
    labelKey: 'RebillsRatio',
    valFormatFn: valToPercent,
    chartLabelFn: appendedArgsFn(valToPercent, 2)
  },
  cancellations_rate: {
    ...defaultCardOptions,
    labelKey: 'CancellationsRate'
  },
  refunds_rate: {
    ...defaultCardOptions,
    labelKey: 'RefundsRate'
  },
  cancellations: {
    ...defaultCardOptions,
    labelKey: 'Cancellations',
    icon: <spriteIcons.IconWallet2 />,
    absFix: false
  },
  refunds: {
    ...defaultCardOptions,
    labelKey: 'Refunds',
    icon: <spriteIcons.IconWallet2 />,
    absFix: false
  },
  // messages
  message_unlocks: {
    ...defaultCardOptions,
    valFormatFn: valToDollar,
    chartLabelFn: appendedArgsFn(valToDollar, 2),
    labelKey: 'messageUnlocks',
    icon: <spriteIcons.IconWallet2 />,
    absFix: false
  },
  receiv_messages: {
    ...defaultCardOptions,
    labelKey: 'RecievedMessages'
  },
  replies_sent: {
    ...defaultCardOptions,
    labelKey: 'RepliesSent'
  },
  locked_messages_sent: {
    ...defaultCardOptions,
    labelKey: 'LockedMessagesSent'
  },
  open_rate: {
    ...defaultCardOptions,
    labelKey: 'OpenRate',
    valFormatFn: valToPercent,
    chartLabelFn: appendedArgsFn(valToPercent, 2)
  },
  your_response_rate: {
    ...defaultCardOptions,
    labelKey: 'YourResponseRate'
  },
  unread_conversations: {
    ...defaultCardOptions,
    labelKey: 'UnreadConversations'
  },
  unlock_rate: {
    ...defaultCardOptions,
    labelKey: 'UnlockRate',
    valFormatFn: valToPercent,
    chartLabelFn: appendedArgsFn(valToPercent, 2)
  },
  // streams
  streaming_tips: {
    ...defaultCardOptions,
    labelKey: 'streamingTips',
    valFormatFn: valToDollar,
    chartLabelFn: appendedArgsFn(valToDollar, 2),
    icon: <spriteIcons.IconWallet2 />,
    absFix: false
  },
  streams: {
    ...defaultCardOptions,
    labelKey: 'streams'
  },
  average_tips_per_stream: {
    ...defaultCardOptions,
    labelKey: 'AvgTipsPerStream'
  },
  average_earnings_per_stream: {
    ...defaultCardOptions,
    labelKey: 'AvgEarningsPerStream',
    valFormatFn: valToDollar,
    chartLabelFn: appendedArgsFn(valToDollar, 2)
  },
  average_viewers_per_stream: {
    ...defaultCardOptions,
    labelKey: 'AvgViewersPerStream'
  },
  average_messages_per_stream: {
    ...defaultCardOptions,
    labelKey: 'AvgMessagesPerStream'
  },
  currently_active_users: {
    ...defaultCardOptions,
    labelKey: 'CurrentlyActiveUsers'
  }
})

type IReportCardKeys = keyof typeof reportCards

const Reports: FC = () => {
  const { t } = useTranslation()
  const {
    categoryId: categoryIdQS,
    dateFrom: dateFromQS,
    dateTo: dateToQS,
    tab: tabQS,
    subTab: filterQS
  } = useQueryParams<{
    categoryId?: string
    dateFrom?: string
    dateTo?: string
    tab?: string
    subTab?: string
  }>()
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryIdQS ?? '')
  const [selectedPeriod, setSelectedPeriod] = useState<{
    start?: string
    end?: string
  }>(
    dateFromQS || dateToQS
      ? {
          ...(dateFromQS && { start: dateFromQS }),
          ...(dateToQS && { end: dateToQS })
        }
      : selectedToPeriod['7']
  )
  const [activeGraph, setActiveGraph] = useState<IReportCardKeys>()
  const [filter, setFilter] = useState<ReportFilter>((filterQS as ReportFilter) ?? 'all')
  const [tab, setTab] = useState<ReportTab>((tabQS as ReportTab) ?? 'content')
  const navigate = useNavigate()

  const { data: reportsData, isFetching } = useQuery(
    ['reportsAnalytics', tab, tab === 'content' ? filter : undefined, selectedCategory, selectedPeriod],
    () =>
      getReportsAnalytics({
        tab,
        ...(tab === 'content' && { filter }),
        dateFrom: selectedPeriod?.start,
        dateTo: selectedPeriod?.end,
        categoryId: selectedCategory ? parseInt(selectedCategory) : undefined
      }),
    {
      refetchOnMount: false,
      enabled: true,
      keepPreviousData: true,
      select(data):
        | null
        | ({
            key: string
            hasGraphBtn: boolean
            labelKey: string
            value: number | string
            salesCount: number
            percentage: number
            additionalLabelKey?: string
          } | null)[] {
        if (data.data) {
          return Object.keys(data.data).map(key => {
            const cardOptions = reportCards[key as IReportCardKeys]
            const cardData = data.data[key]
            if (cardOptions && cardData) {
              return {
                key,
                hasGraphBtn: cardOptions.hasGraphBtn,
                labelKey: cardOptions.labelKey,
                value: cardOptions.valFormatFn(cardData.sum),
                percentage: cardData.percentage,
                salesCount: cardData.count,
                additionalLabelKey: cardOptions.additionalLabelKey
              }
            } else {
              console.warn('cardOptions or cardData missing key: ', key)
              return null
            }
          })
        } else {
          return null
        }
      }
    }
  )

  const { data: graphData, isFetching: isFetchingGraph } = useQuery<any>(
    ['reportsAnalyticsGraph', activeGraph, selectedCategory, selectedPeriod],
    () =>
      getAnalyticsChartData({
        fetchPromise: getReportsAnalytics({
          tab,
          filter,
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

  useEffect(() => {
    const params = {
      ...(selectedCategory && { categoryId: selectedCategory }),
      ...(selectedPeriod?.start && { dateFrom: selectedPeriod.start }),
      ...(selectedPeriod?.end && { dateTo: selectedPeriod.end }),
      ...(tab && { tab }),
      ...(filter && { subTab: filter })
    }
    navigate({
      search: '?' + new URLSearchParams(params).toString()
    })
  }, [filter, navigate, selectedCategory, selectedPeriod?.end, selectedPeriod?.start, tab])

  const chartOptions = useMemo(() => {
    const options = defaultChartOptions((x, y) => ({
      x: x,
      y: reportCards?.[activeGraph as IReportCardKeys]?.chartLabelFn?.(y) ?? y
    }))
    return produce(options, (draft: DeepPartial<typeof options>) => {
      if (draft?.scales?.y?.ticks?.callback && activeGraph) {
        draft.scales.y.ticks.callback = reportCards[activeGraph as IReportCardKeys].chartLabelFn
      }
    })
  }, [activeGraph])
  console.log(graphData)
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
            options={chartOptions}
          />
          {isFetchingGraph && <Loader />}
        </div>
      )}
      <WithHeaderSection
        customClass='analytics-reports-whs'
        headerSection={
          <>
            <div className='analytics-dropdown-container'>
              <div style={{ width: '50%', marginRight: '5px' }}>
                <CategoriesDropdown selectedCategoryId={selectedCategory} onSelectCategory={setSelectedCategory} />
              </div>
              <div style={{ width: '50%' }}>
                <AnalyticsPeriodDropdown
                  selectedPeriodId={dateFromQS || dateToQS ? 'custom_period' : '7'}
                  onSelectPeriod={setSelectedPeriod}
                />
              </div>
            </div>

            <div className='reports-overflow-container'>
              <div className='reports-links-container'>
                <div
                  className={`reports-link ${tab === 'content' ? 'reports-link-active' : ''}`}
                  onClick={() => setTab('content')}
                >
                  {t('content')}
                </div>
                <div
                  className={`reports-link ${tab === 'subscriptions' ? 'reports-link-active' : ''}`}
                  onClick={() => setTab('subscriptions')}
                >
                  {t('subscriptions')}
                </div>
                <div
                  className={`reports-link ${tab === 'messages' ? 'reports-link-active' : ''}`}
                  onClick={() => setTab('messages')}
                >
                  {t('messages')}
                </div>
              </div>
            </div>
            {tab === 'content' && (
              <div className='reports-types-container'>
                <div
                  className={`report-type ${filter === 'all' ? 'report-type-active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  {t('All')}
                </div>
                <div
                  className={`report-type ${filter === 'premium' ? 'report-type-active' : ''}`}
                  onClick={() => setFilter('premium')}
                >
                  {t('Premium')}
                </div>
                <div
                  className={`report-type ${filter === 'videos' ? 'report-type-active' : ''}`}
                  onClick={() => setFilter('videos')}
                >
                  {t('videos')}
                </div>
                <div
                  className={`report-type ${filter === 'photos' ? 'report-type-active' : ''}`}
                  onClick={() => setFilter('photos')}
                >
                  {t('photos')}
                </div>
              </div>
            )}
          </>
        }
      >
        {console.log('reports', reportsData)}
        <div className='analytics-cards-container'>
          {reportsData?.map(cardData => {
            if (cardData) {
              return (
                <AnalyticsCard
                  key={cardData.key}
                  cardKey={cardData.key}
                  customClass={'analytics-reports-card'}
                  absFix={reportCards[cardData.key as IReportCardKeys]?.absFix}
                  icon={reportCards[cardData.key as IReportCardKeys]?.icon}
                  hasGraphBtn={cardData.hasGraphBtn}
                  activeGraph={activeGraph}
                  label={t(cardData.labelKey)}
                  additionalLabel={cardData.additionalLabelKey ? t(cardData.additionalLabelKey) : undefined}
                  value={cardData.value}
                  salesCount={cardData.salesCount}
                  percentage={cardData.percentage}
                  onGraphClick={key => {
                    if (activeGraph === key) {
                      setActiveGraph(undefined)
                      return
                    }
                    setActiveGraph(key as IReportCardKeys)
                  }}
                />
              )
            } else {
              return null
            }
          })}
          {isFetching && <Loader />}
        </div>
      </WithHeaderSection>
    </>
  )
}

export default Reports
