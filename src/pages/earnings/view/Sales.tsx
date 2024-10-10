import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InView } from 'react-intersection-observer'
import Loader from '../../../components/Common/Loader/Loader'
import UserCardEarnings from '../../../components/UI/UserCard/UserCardEarnings'
import { usePayoutTransactionsFeed } from '../../../helpers/apiHooks'
import { ISalesTransaction } from '../../../types/interfaces/ITypes'

const Sales: FC = () => {
  const [salesFeed, setSalesFeed] = useState<ISalesTransaction[]>([])
  const [dataReady, setDataReady] = useState(false)

  const { t } = useTranslation()
  const { data, error, isFetching, fetchNextPage } = usePayoutTransactionsFeed()

  useEffect(() => {
    if (data && !isFetching) {
      const tmp = data.pages.map(page => {
        return page.page.data.data
      })
      console.log(tmp)
      setSalesFeed([...tmp.flat()])
      setDataReady(true)
    }
  }, [data, isFetching])

  if (!dataReady) {
    return <Loader />
  }

  return (
    <div>
      {salesFeed &&
        !!salesFeed.length &&
        salesFeed.map((transaction, index) => {
          if (salesFeed.length === index + 1) {
            return (
              <InView
                key={transaction.id}
                as='div'
                threshold={0.1}
                triggerOnce
                onChange={inView => {
                  inView && !isFetching && fetchNextPage()
                }}
              >
                <UserCardEarnings
                  user={{
                    name: transaction.name,
                    avatar: { url: transaction.avatar }
                  }}
                  earningsCardType={t(transaction.product)}
                  userCardSubType='sale'
                  hasDropDown={true}
                  iconSize='60'
                  earnings={transaction.gross + transaction.fee}
                  dropDownContent={
                    <div className='sales-card-dropdown'>
                      <div className='sales-dropdown-card-content-container'>
                        <div className='sales-dropdown-card-info'>
                          <div className='sales-dropdown-card-info-type'>{t('fee')}</div>
                          <div className='sales-dropdown-card-info-value'>${transaction.fee}</div>
                        </div>
                        <div className='sales-dropdown-card-info'>
                          <div className='sales-dropdown-card-info-type'>{t('gross')}</div>
                          <div className='sales-dropdown-card-info-value'>${transaction.gross}</div>
                        </div>
                      </div>
                    </div>
                  }
                />
                ;
              </InView>
            )
          } else {
            return (
              <UserCardEarnings
                key={transaction.id}
                user={{
                  name: transaction.name,
                  avatar: { url: transaction.avatar }
                }}
                earnings={transaction.gross + transaction.fee}
                earningsCardType={t(transaction.product)}
                userCardSubType='sale'
                hasDropDown={true}
                iconSize='60'
                dropDownContent={
                  <div className='sales-card-dropdown'>
                    <div className='sales-dropdown-card-content-container'>
                      <div className='sales-dropdown-card-info'>
                        <div className='sales-dropdown-card-info-type'>{t('fee')}</div>
                        <div className='sales-dropdown-card-info-value'>${transaction.fee}</div>
                      </div>
                      <div className='sales-dropdown-card-info'>
                        <div className='sales-dropdown-card-info-type'>{t('gross')}</div>
                        <div className='sales-dropdown-card-info-value'>${transaction.gross}</div>
                      </div>
                    </div>
                  </div>
                }
              />
            )
          }
        })}
      {/* <UserCardEarnings
        user={user}
        earningsCardType={t('subscription')}
        userCardSubType="sale"
        hasDropDown={true}
        iconSize="60"
        dropDownContent={
          <div className="sales-card-dropdown">
            <div className="sales-dropdown-card-content-container">
              <div className="sales-dropdown-card-info">
                <div className="sales-dropdown-card-info-type">{t('fee')}</div>
                <div className="sales-dropdown-card-info-value">$2.99</div>
              </div>
              <div className="sales-dropdown-card-info">
                <div className="sales-dropdown-card-info-type">
                  {t('gross')}
                </div>
                <div className="sales-dropdown-card-info-value">$10.98</div>
              </div>
            </div>
          </div>
        }
      />
      <UserCardEarnings
        user={user}
        earningsCardType={t('tip')}
        userCardSubType="sale"
        hasDropDown={true}
        iconSize="60"
        dropDownContent={
          <div className="sales-card-dropdown">
            <div className="sales-dropdown-card-content-container">
              <div className="sales-dropdown-card-info">
                <div className="sales-dropdown-card-info-type">{t('fee')}</div>
                <div className="sales-dropdown-card-info-value">$2.99</div>
              </div>
              <div className="sales-dropdown-card-info">
                <div className="sales-dropdown-card-info-type">
                  {t('gross')}
                </div>
                <div className="sales-dropdown-card-info-value">$10.98</div>
              </div>
            </div>
          </div>
        }
      /> */}
    </div>
  )
}

export default Sales
