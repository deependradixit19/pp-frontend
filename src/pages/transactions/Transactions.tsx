import { FC, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'
import { useInView } from 'react-intersection-observer'
import { IconSettingsOutline } from '../../assets/svg/sprite'
import LinkTabs from '../../components/UI/LinkTabs/LinkTabs'
import UserCardTransactions from '../../components/UI/UserCard/UserCardTransactions'
import LayoutHeader from '../../features/LayoutHeader/LayoutHeader'
import { useDebounce, useDynamicHeight, useFilterQuery } from '../../helpers/hooks'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'
import './_transactions.scss'
import { ITransactionsInfinitePage } from '../../types/interfaces/ITypes'
import { getTransactions, TransactionFilter } from '../../services/endpoints/transactions'
import LoadingDots from '../../components/UI/LoadingDots/LoadingDots'
import noSubscriptions from '../../assets/images/no-subscriptions.png'
import { getLink } from '../../helpers/appLinks'
import Loader from '../../components/Common/Loader/Loader'

const Transactions: FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { wrapperStyle } = useDynamicHeight(310)

  const filter = useFilterQuery()
  const type = filter.get('type')
  const { ref: lastNotificationRef, inView } = useInView({
    threshold: 0.1
  })

  const searchDebounce = useDebounce(searchTerm, 500)

  const {
    data: transactionsData,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery<ITransactionsInfinitePage, Error>(
    ['transactions', activeFilter, searchDebounce],
    ({ pageParam = 1 }) =>
      getTransactions({
        filter: activeFilter as unknown as TransactionFilter,
        currentPage: pageParam,
        ...(searchTerm && { searchTerm: searchDebounce })
      }),
    {
      getNextPageParam: (lastPage, pages) => {
        const nextPage = lastPage.data.current_page + 1

        return nextPage <= lastPage.data.last_page ? nextPage : undefined
      },
      enabled: true,
      keepPreviousData: true,
      refetchOnWindowFocus: false
    }
  )

  const transactions = useMemo(() => {
    return transactionsData?.pages.flatMap(page =>{ 
      const trans =page.data as any
      console.log(trans.transactions.data,'trans')
     return trans.transactions.data})
  }, [transactionsData])

  useEffect(() => {
    if (type) {
      setActiveFilter(type)
    } else {
      setActiveFilter('all')
    }
    setSearchTerm('')
  }, [type])

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [
    fetchNextPage,
    hasNextPage,
    inView,
    isFetchingNextPage // necessary if all others remain true
    // even after new page is fetched (but last element is still in view),
    // but not really probable in real world examples
  ])
console.log(transactionsData,'transactionsData')
console.log(transactions,'transactions')
  return (
    <BasicLayout title={t('transactions')}>
      <WithHeaderSection
        headerSection={
          <LayoutHeader
            title={t('transactions')}
            type='search-with-buttons'
            searchValue={searchTerm}
            searchFn={(term: string) => setSearchTerm(term)}
            clearFn={() => setSearchTerm('')}
            additionalProps={{ placeholder: t('searchTransactions') }}
            buttons={[
              {
                type: 'cta',
                icon: <IconSettingsOutline color='#fff' />,
                action: () =>
                  navigate(
                    // userData?.role === 'model' ?
                    //   getLink.modelSettingsPayout() :
                    getLink.fanSettingsPayment()
                  )
              }
            ]}
          />
        }
        customClass='transactions'
      >
        <div className='transactions__tabs'>
          <LinkTabs
            route='/transactions'
            filters={[
              {
                value: 'all',
                label: t('all')
              },
              {
                value: 'card',
                label: t('paymentCard')
              },
              {
                value: 'wallet',
                label: t('wallet')
              },
              {
                value: 'error',
                label: t('errors')
              }
            ]}
            activeFilter={activeFilter}
          />
        </div>
        <div className='transactions__list' style={wrapperStyle}>
          {transactions?.map((transaction, index) => {
            return (
              <div key={transaction.orderId} ref={transactions.length === index + 1 ? lastNotificationRef : undefined}>
                <UserCardTransactions transaction={transaction} />
              </div>
            )
          })}
          <LoadingDots visible={isFetchingNextPage} />
          {!transactions?.length && !isFetching && (
            <div className='creatorsList__empty'>
              <img src={noSubscriptions} alt={t('NoTransactions')} />
              <div className='creatorsList__empty__text'>
                <div className='creatorsList__empty__text--title'>{t('NoTransactions')}</div>
              </div>
            </div>
          )}
          {isFetching && <Loader />}
        </div>
      </WithHeaderSection>
    </BasicLayout>
  )
}

export default Transactions
