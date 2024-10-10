import { FC, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../features/LayoutHeader/LayoutHeader'
import * as spriteIcons from '../../assets/svg/sprite'
import styles from './_Referrals.module.scss'
import BarChart from '../../features/BarChart/BarChart'
import { getLink } from '../../helpers/appLinks'

import CoverBg from '../../assets/images/cover-bg.jpg'
import CoverBgOne from '../../assets/images/cover-bg-1.jpg'
import FaceOne from '../../assets/images/faces/ferrara.jpg'
import FaceTwo from '../../assets/images/faces/sinns.jpg'
import FaceThree from '../../assets/images/faces/rocco.jpg'
import ChangeStateTabs from '../../components/UI/ChangeStateTabs/ChangeStateTabs'
import Payouts from './view/Payouts/Payouts'
import Summary from './view/Summary/Summary'

// mock data
const creatorsData = [
  {
    coverUrl: CoverBg,
    avatarUrl: FaceOne,
    name: 'Milan Stanojevic',
    handle: 'Chomi',
    isLive: false,
    isOnline: false,
    isActive: true,
    price: 14.99,
    save: 30,
    userId: 4
  },
  {
    coverUrl: CoverBgOne,
    avatarUrl: FaceTwo,
    name: 'Milan Stanojevic',
    handle: 'Chomi',
    isLive: true,
    isOnline: false,
    isActive: true,
    price: 14.99,
    save: 30,
    userId: 5
  },
  {
    coverUrl: CoverBg,
    avatarUrl: FaceThree,
    name: 'Milan Stanojevic',
    handle: 'Chomi',
    isLive: false,
    isOnline: true,
    isActive: true,
    price: 14.99,
    save: 30,
    userId: 6
  },
  {
    coverUrl: CoverBgOne,
    avatarUrl: FaceTwo,
    name: 'Milan Stanojevic',
    handle: 'Chomi',
    isLive: false,
    isOnline: false,
    isActive: true,
    price: 14.99,
    save: 30,
    userId: 7
  },
  {
    coverUrl: CoverBg,
    avatarUrl: FaceOne,
    name: 'Milan Stanojevic',
    handle: 'Chomi',
    isLive: false,
    isOnline: false,
    isActive: true,
    price: 14.99,
    save: 30,
    userId: 8
  },
  {
    coverUrl: CoverBg,
    avatarUrl: FaceTwo,
    name: 'Milan Stanojevic',
    handle: 'Chomi',
    isLive: false,
    isOnline: false,
    isActive: true,
    price: 14.99,
    save: 30,
    userId: 9
  },
  {
    coverUrl: CoverBg,
    avatarUrl: FaceThree,
    name: 'Milan Stanojevic',
    handle: 'Chomi',
    isLive: false,
    isOnline: false,
    isActive: true,
    price: 14.99,
    save: 30,
    userId: 10
  }
]
const fansData = [
  {
    coverUrl: CoverBg,
    avatarUrl: FaceOne,
    name: 'Milan Stanojevic',
    handle: 'Chomi',
    isLive: false,
    isOnline: false,
    isActive: false,
    price: 14.99,
    save: 30,
    userId: 1
  },
  {
    coverUrl: CoverBgOne,
    avatarUrl: FaceTwo,
    name: 'Milan Stanojevic',
    handle: 'Chomi',
    isLive: true,
    isOnline: false,
    isActive: false,
    price: 10.99,
    save: null,
    userId: 2
  },
  {
    coverUrl: CoverBg,
    avatarUrl: FaceThree,
    name: 'Milan Stanojevic',
    handle: 'Chomi',
    isLive: false,
    isOnline: true,
    isActive: false,
    price: 11.99,
    save: null,
    userId: 3
  }
]

const Referrals: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [activeTab, setActiveTab] = useState<string>('creators')
  const [chartOpen, setChartOpen] = useState<boolean>(false)
  const [chartOptionsOpen, setChartOptionsOpen] = useState<boolean>(false)
  const [selectedChartOption, setSelectedChartOption] = useState<string>('Day')
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()

  const chartData = [
    { x: 'Su', y: 20, date: 'Oct 22' },
    { x: 'Mo', y: 10, date: 'Oct 23' },
    { x: 'Tu', y: 5, date: 'Oct 24' },
    { x: 'We', y: 25, date: 'Oct 25' },
    { x: 'Th', y: 15, date: 'Oct 26' },
    { x: 'Fr', y: 8, date: 'Oct 27' },
    { x: 'Sat', y: 12, date: 'Oct 28' }
  ]
  const chartMonthData = [
    { x: 'Jan', y: 20, date: 'Jan 22' },
    { x: 'Feb', y: 10, date: 'Feb 23' },
    { x: 'Mar', y: 5, date: 'Mar 24' },
    { x: 'Apr', y: 25, date: 'Apr 25' },
    { x: 'May', y: 15, date: 'May 26' },
    { x: 'Jun', y: 8, date: 'Jun 27' },
    { x: 'Jul', y: 12, date: 'July 28' },
    { x: 'Aug', y: 12, date: 'Aug 28' },
    { x: 'Sep', y: 12, date: 'Sep 28' },
    { x: 'Oct', y: 12, date: 'Oct 28' },
    { x: 'Nov', y: 12, date: 'Nov 28' },
    { x: 'Dec', y: 12, date: 'Dec 28' }
  ]

  const tabs = useMemo(
    () => [
      {
        name: t('Creators'),
        value: 'creators'
      },
      {
        name: t('Fans'),
        value: 'fans'
      }
    ],
    [t]
  )

  const changeSelectedChartOption = (chartOpt: string) => {
    setSelectedChartOption(chartOpt)
    setChartOptionsOpen(false)
  }

  const renderPage = () => {
    if (id === 'payouts') {
      return <Payouts />
    } else if (id === 'summary') {
      // return <Sales />;
      return <Summary tab={activeTab} referralsData={activeTab === 'fans' ? creatorsData : fansData} />
    }
  }

  const renderSearch = () => {
    if (id === 'payouts') {
      return (
        <WithHeaderSection
          customClass={styles.payoutsHeader}
          headerSection={
            <LayoutHeader
              type='search-with-buttons'
              searchValue={searchTerm}
              searchFn={(term: string) => setSearchTerm(term)}
              clearFn={() => setSearchTerm('')}
              additionalProps={{ placeholder: t('searchInvoice') }}
              buttons={[]}
            />
          }
        >
          {renderPage()}
        </WithHeaderSection>
      )
    } else if (id === 'summary') {
      return (
        <WithHeaderSection
          customClass={styles.summaryHeader}
          headerSection={
            <>
              <ChangeStateTabs
                activeTab={activeTab}
                tabs={tabs}
                clickFn={val => {
                  setActiveTab(val)
                }}
                width='fit'
              />
            </>
          }
        >
          {renderPage()}
        </WithHeaderSection>
      )
    }
  }
  return (
    <BasicLayout title={t('referrals')} headerNav={['/referrals/summary', '/referrals/payouts']}>
      <>
        {id === 'summary' && (
          <div className={styles['balance-container']}>
            {!chartOpen ? (
              <>
                <div className='balance-text'>{t('currentBalance')}</div>
                <div className='balance-number'>
                  <spriteIcons.IconDollar width='58' height='58' />
                  <div>163</div>
                  <span className='balance-number-currency-text'>(USD)</span>
                </div>
                <div className='balance-options'>
                  <div className='balance-payment'>
                    {getLink.referrLink()}
                    <span>123456</span>
                  </div>
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
                      <div>163</div>
                      <span className='balance-number-currency-text'>
                        <div>(USD)</div>
                        <div className='balance-text'>{t('overallRevenue')}</div>
                      </span>
                    </div>
                  </div>
                  <div className='balance-chart-select' onClick={() => setChartOptionsOpen(!chartOptionsOpen)}>
                    <div className='balance-chart-selected'>
                      {t('by')} <span>{selectedChartOption}</span>
                    </div>
                    <div
                      className={`balance-chart-select-list ${chartOptionsOpen && 'balance-chart-select-list-open'}`}
                    >
                      <div className='balance-chart-select-option' onClick={() => changeSelectedChartOption('Day')}>
                        {t('by')} <span>{t('day')}</span>
                      </div>
                      <div className='balance-chart-select-option' onClick={() => changeSelectedChartOption('Week')}>
                        {t('by')} <span>{t('week')}</span>
                      </div>
                      <div className='balance-chart-select-option' onClick={() => changeSelectedChartOption('Month')}>
                        {t('by')} <span>{t('month')}</span>
                      </div>
                    </div>
                  </div>
                  <div className='balance-chart-close' onClick={() => setChartOpen(false)}>
                    <spriteIcons.IconClose />
                  </div>
                </div>
                <BarChart
                  chartData={selectedChartOption === 'Day' ? chartData : chartMonthData}
                  datasetOptions={{
                    borderRadius: 15,
                    barThickness: 'flex'
                  }}
                />
              </div>
            )}
          </div>
        )}
        {renderSearch()}
      </>
    </BasicLayout>
  )
}

export default Referrals
