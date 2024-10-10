import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'
import { InView } from 'react-intersection-observer'
import UserCardPayouts from '../../../components/UI/UserCard/UserCardPayouts'
import LayoutHeader from '../../../features/LayoutHeader/LayoutHeader'
import WithHeaderSection from '../../../layouts/WithHeaderSection/WithHeaderSection'
import { useDebounce } from '../../../helpers/hooks'
import styles from './_Payouts.module.scss'
import { IInfinitePages, ISalesTransaction } from '../../../types/interfaces/ITypes'
import { getPayoutsInvoices } from '../../../services/endpoints/earnings'
import Loader from '../../../components/Common/Loader/Loader'

const Payouts: FC = () => {
  const [invoicesFeed, setInvoicesFeed] = useState<any[]>([])
  const [dataReady, setDataReady] = useState(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const debouncedSearch = useDebounce(searchTerm, 1000)
  const { t } = useTranslation()

  const { data, isFetching, fetchNextPage } = useInfiniteQuery<IInfinitePages<ISalesTransaction>, Error>(
    ['getPayoutsInvoices', debouncedSearch],
    ({ pageParam = 1 }) => getPayoutsInvoices({ page: pageParam, search: debouncedSearch }),
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.nextCursor
      },
      refetchOnWindowFocus: false
    }
  )

  useEffect(() => {
    if (data && !isFetching) {
      const tmp = data.pages.map(page => {
        return page.page.data.data
      })
      console.log(tmp)
      setInvoicesFeed([...tmp.flat()])
      setDataReady(true)
    }
  }, [data, isFetching])

  return (
    <WithHeaderSection
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
      <div className={styles.payouts}>
        {invoicesFeed &&
          !!invoicesFeed.length &&
          invoicesFeed.map((invoice, index) => {
            if (invoicesFeed.length === index + 1) {
              return (
                <InView
                  key={invoice.invoiceId}
                  as='div'
                  threshold={0.1}
                  triggerOnce
                  onChange={inView => {
                    inView && !isFetching && fetchNextPage()
                  }}
                >
                  <UserCardPayouts
                    key={invoice.invoiceId}
                    avatarUrl={invoice.avatar}
                    earningsCardType={invoice.status}
                    date={invoice.date}
                    invoiceNmbr={invoice.invoiceId}
                    amount={invoice.amount}
                  />
                </InView>
              )
            } else {
              return (
                <UserCardPayouts
                  key={invoice.invoiceId}
                  avatarUrl={invoice.avatar}
                  earningsCardType={invoice.status}
                  date={invoice.date}
                  invoiceNmbr={invoice.invoiceId}
                  amount={invoice.amount}
                />
              )
            }
          })}
        {!dataReady && <Loader />}
      </div>
    </WithHeaderSection>
  )
}

export default Payouts
