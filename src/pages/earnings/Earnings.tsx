import { FC, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { useQuery } from 'react-query'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'
import Payouts from './view/Payouts'
import Sales from './view/Sales'
import * as spriteIcons from '../../assets/svg/sprite'
import './_earnings.scss'
import BarChart from '../../features/BarChart/BarChart'
import { useGetCurrentBalance, useGetPendingBalance } from '../../helpers/apiHooks'
import Button from '../../components/UI/Buttons/Button'
import Loader from '../../components/Common/Loader/Loader'
import { useUserContext } from '../../context/userContext'
import { getAnalyticsChartData } from '../../helpers/dataTransformations'
import { getEarningsGraphData } from '../../services/endpoints/earnings'
import { getLastPeriodFn } from '../../features/AnalyticsPeriodDropdown/AnalyticsPeriodDropdown'
import DesktopAdditionalContent from '../../features/DesktopAdditionalContent/DesktopAdditionalContent'

// const chartData = [
//   { x: 'Su', y: 20, date: 'Oct 22' },
//   { x: 'Mo', y: 10, date: 'Oct 23' },
//   { x: 'Tu', y: 5, date: 'Oct 24' },
//   { x: 'We', y: 25, date: 'Oct 25' },
//   { x: 'Th', y: 15, date: 'Oct 26' },
//   { x: 'Fr', y: 8, date: 'Oct 27' },
//   { x: 'Sat', y: 12, date: 'Oct 28' },
// ];
// const chartWeekData = [
//   { x: '1', y: 20, date: 'Week 22' },
//   { x: '2', y: 10, date: 'Week 23' },
//   { x: '3', y: 5, date: 'Week 24' },
//   { x: '4', y: 25, date: 'Week 25' },
//   { x: '5', y: 15, date: 'Week 26' },
//   { x: '6', y: 8, date: 'Week 27' },
//   { x: '7', y: 12, date: 'Week 28' },
// ];
// const chartMonthData = [
//   { x: 'Jan', y: 20, date: 'Jan 22' },
//   { x: 'Feb', y: 10, date: 'Feb 23' },
//   { x: 'Mar', y: 5, date: 'Mar 24' },
//   { x: 'Apr', y: 25, date: 'Apr 25' },
//   { x: 'May', y: 15, date: 'May 26' },
//   { x: 'Jun', y: 8, date: 'Jun 27' },
//   { x: 'Jul', y: 12, date: 'July 28' },
//   { x: 'Aug', y: 12, date: 'Aug 28' },
//   { x: 'Sep', y: 12, date: 'Sep 28' },
//   { x: 'Oct', y: 12, date: 'Oct 28' },
//   { x: 'Nov', y: 12, date: 'Nov 28' },
//   { x: 'Dec', y: 12, date: 'Dec 28' },
// ];

const chartOptionToTranslateKey = {
  day: 'Day',
  week: 'week',
  month: 'Month'
}

const SalesChart: FC = () => {
  const [chartOpen, setChartOpen] = useState<boolean>(false)
  const [chartOptionsOpen, setChartOptionsOpen] = useState<boolean>(false)
  const [selectedChartOption, setSelectedChartOption] = useState<keyof typeof chartOptionToTranslateKey>('day')

  const profile = useUserContext()
  const navigate = useNavigate()
  const payoutMethod = profile.payout_method
  const payoutRequested = true

  const { t } = useTranslation()
  const {
    data: pendingBalance,
    error: pendingBalanceError,
    isFetching: isFetchingPendingBalance,
    status: pendingBalanceStatus
  } = useGetPendingBalance()
  const {
    data: currentBalance,
    error: currentBalanceError,
    isFetching: isFetchingCurrentBalance,
    status: currentBalanceStatus
  } = useGetCurrentBalance()

  // const {
  //   data: graphData,
  //   isFetching: isFetchingGraph,
  // } = useQuery<any>(
  //   ['earningsSalesGraph', selectedChartOption],
  //   () => transformEarningsChartData({
  //     fetchPromise: getEarningsGraphData(selectedChartOption)
  //   }),
  //   {
  //     enabled: !!chartOpen,
  //     keepPreviousData: true,
  //     refetchOnMount: false,
  //   }
  // );

  const { data: graphData, isFetching: isFetchingGraph } = useQuery<any>(
    ['salesAnalyticsGraph', selectedChartOption],
    () => {
      let selectedPeriod
      switch (selectedChartOption) {
        case 'month':
          selectedPeriod = getLastPeriodFn(11, 'month')()
          break
        case 'week':
          selectedPeriod = getLastPeriodFn(1, 'month')()
          break
        case 'day':
          selectedPeriod = getLastPeriodFn(6, 'day')()
          break
      }
      return getAnalyticsChartData({
        fetchPromise: getEarningsGraphData({
          dateFrom: selectedPeriod?.start,
          dateTo: selectedPeriod?.end
        })
      })
    },
    {
      enabled: !!chartOpen,
      keepPreviousData: true,
      refetchOnMount: false
    }
  )
  const changeSelectedChartOption = (chartOpt: keyof typeof chartOptionToTranslateKey) => {
    setSelectedChartOption(chartOpt)
    setChartOptionsOpen(false)
  }

  const renderButton = () => {
    if (!payoutMethod) {
      return (
        <Button
          text={t('addPayoutMethod')}
          color='blue'
          width='fit'
          height='5'
          padding='2'
          font='mont-14-semi-bold'
          clickFn={() => navigate('/settings/general/payout-settings/payment-method')}
        />
      )
    }
    if (!payoutRequested) {
      // 'manual' not in use currently
      return (
        <Button
          text={t('requestPayout')}
          color='blue'
          width='fit'
          height='5'
          padding='2'
          font='mont-14-semi-bold'
          clickFn={() => console.log('add payout method')}
        />
      )
    }
    let payoutDate
    if (profile.payout_frequency === 'weekly') {
      payoutDate = dayjs().add(1, 'week').isoWeekday(1).format('ll')
    } else {
      payoutDate = dayjs().add(1, 'month').date(1).format('ll')
    }
    return (
      <div className='balance-payment'>
        <div className='balance-payment-subtext'>{t('upcomingPayment')}</div>
        <div className='balance-payment-text'>{payoutDate}</div>
      </div>
    )
  }

  if (pendingBalanceStatus === 'loading' || currentBalanceStatus === 'loading') {
    return (
      <div style={{ height: '21.3rem', position: 'relative' }}>
        <Loader />;
      </div>
    )
  }

  return (
    <div className='balance-container'>
      {!chartOpen ? (
        <>
          <div className='balance-text'>{t('currentBalance')}</div>
          {currentBalance && (
            <div className='balance-number'>
              <spriteIcons.IconDollar color='black' width='25' height='49' />

              <div className='balance-number-value'>{Math.trunc(currentBalance.data.balance)}</div>

              <span className='balance-number-currency-text'>(USD)</span>
            </div>
          )}
          {pendingBalance && (
            <div className='balance-pending'>
              Pending <span>${Math.trunc(pendingBalance.data.balance)}</span>
            </div>
          )}
          <div className='balance-options'>
            <Link to='/settings/general/payout-settings' className='balance-settings'>
              <spriteIcons.IconCogWheel />
            </Link>

            <div className='balance-button'>{renderButton()}</div>

            <button className='balance-graph' onClick={() => setChartOpen(true)}>
              <spriteIcons.IconGraph />
            </button>
          </div>
        </>
      ) : (
        <div className='balance-chart'>
          <div className='balance-chart-options'>
            <div className='balance-chart-currency'>
              <div className='balance-number'>
                <spriteIcons.IconDollar width='40' height='40' />
                <div>{Math.trunc(currentBalance.data.balance)}</div>
                <span className='balance-number-currency-text'>
                  <div>(USD)</div>
                  <div className='balance-text'>{t('overallRevenue')}</div>
                </span>
              </div>
            </div>
            <div className='balance-chart-select' onClick={() => setChartOptionsOpen(!chartOptionsOpen)}>
              <div className='balance-chart-selected'>
                {t('by')} <span>{t(chartOptionToTranslateKey[selectedChartOption])}</span>
              </div>
              <div className={`balance-chart-select-list ${chartOptionsOpen && 'balance-chart-select-list-open'}`}>
                <div className='balance-chart-select-option' onClick={() => changeSelectedChartOption('day')}>
                  {t('by')} <span>{t('Day')}</span>
                </div>
                <div className='balance-chart-select-option' onClick={() => changeSelectedChartOption('week')}>
                  {t('by')} <span>{t('week')}</span>
                </div>
                <div className='balance-chart-select-option' onClick={() => changeSelectedChartOption('month')}>
                  {t('by')} <span>{t('Month')}</span>
                </div>
              </div>
            </div>
            <div className='balance-chart-close' onClick={() => setChartOpen(false)}>
              <spriteIcons.IconClose />
            </div>
          </div>
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
    </div>
  )
}

const Earnings: FC = () => {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()

  // const changeSelectedChartOption = (chartOpt: string) => {
  //   setSelectedChartOption(chartOpt);
  //   setChartOptionsOpen(false);
  // };

  // const renderEarningsPage = () => {
  //   if (id === 'payouts') {
  //     return <Payouts />;
  //   } else if (id === 'sales') {
  //     return <Sales />;
  //   }
  // };

  const renderContent = () => {
    if (id === 'payouts') {
      return <Payouts />
    } else if (id === 'sales') {
      return (
        <>
          <SalesChart />
          <WithHeaderSection headerSection={<h1 style={{ marginBottom: 0 }}>{t('transactions')}</h1>}>
            <Sales />
          </WithHeaderSection>
        </>
      )
    }
  }
  return (
    <BasicLayout title={t('earnings')} headerNav={['/earnings/sales', '/earnings/payouts']}>
      <div className='earnings'>{renderContent()}</div>
      <DesktopAdditionalContent />
    </BasicLayout>
  )
}

export default Earnings
