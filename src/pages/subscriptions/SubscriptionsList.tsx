import { FC, useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from 'react-query'

import { useTranslation } from 'react-i18next'
import { useModalContext } from '../../context/modalContext'

import NewListModal from './components/NewListModal'
import './_subscriptions.scss'
import { AllIcons } from '../../helpers/allIcons'

import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../features/LayoutHeader/LayoutHeader'
import FansList from '../../features/FansList/FansList'
import { getSubscriptionLists } from '../../services/endpoints/subscription_lists'

const useSortSubsTop = () => {
  const { t } = useTranslation()
  return [
    {
      value: 'recently_subscribed',
      name: t('recentlySubscribed')
    },
    {
      value: 'favorite',
      name: t('favorite')
    },
    {
      value: 'expiring',
      name: t('expiring')
    },
    {
      value: 'online_status',
      name: t('onlineStatus')
    },
    {
      value: 'last_activity',
      name: t('lastActivity')
    },
    {
      value: 'name',
      name: t('name')
    }
  ]
}

const useSubsOrder = () => {
  const { t } = useTranslation()
  return [
    {
      value: 'ascending',
      name: t('ascending')
    },
    {
      value: 'descending',
      name: t('descending')
    }
  ]
}

const SubscriptionsLists: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [, setSelectedSort] = useState('name')
  const [, setSelectedOrder] = useState('ascending')
  const [, setActiveFilter] = useState('active')

  const navigate = useNavigate()
  const { t } = useTranslation()
  const sortSubsTop = useSortSubsTop()
  const sortSubsOrder = useSubsOrder()

  function useFilterQuery() {
    const { search } = useLocation()

    return useMemo(() => new URLSearchParams(search), [search])
  }

  const filter = useFilterQuery()
  const type = filter.get('type')
  const sort = filter.get('sort')
  const order = filter.get('order')

  const { data, error } = useQuery('allSubscriptionLists', getSubscriptionLists, {
    refetchOnWindowFocus: false
  })

  useEffect(() => {
    if (type) {
      setActiveFilter(type)
    }
    if (sort) {
      setSelectedSort(sort)
    }
    if (order) {
      setSelectedOrder(order)
    }
  }, [type, sort, order])
  const modalData = useModalContext()

  const createNewList = () => modalData.addModal(t('createNewList'), <NewListModal />, undefined, undefined, 'newList')

  return (
    <BasicLayout title={t('lists')} customContentClass='subscriptionsLists__content__wrapper'>
      <WithHeaderSection
        headerSection={
          <LayoutHeader
            type='search-with-buttons'
            searchValue={searchTerm}
            searchFn={(term: string) => setSearchTerm(term)}
            clearFn={() => setSearchTerm('')}
            additionalProps={{ placeholder: t('searchLists') }}
            buttons={[
              {
                type: 'cta',
                icon: AllIcons.list,
                action: () => navigate('/subscriptions')
              },
              {
                type: 'sort',
                elements: {
                  first_section: sortSubsTop,
                  second_section: sortSubsOrder
                }
              }
            ]}
          />
        }
      >
        <div className='subscriptionsLists'>
          <div className='subscriptionsLists__list'>
            {data?.data.map((fans: { name: string; avatars: Array<string>; count: number }, key: number) => (
              <div
                key={key}
                className='subscriptionsLists__list__item'
                onClick={() => navigate(`/subscriptions/${fans.name.toLocaleLowerCase()}`)}
              >
                <FansList title={fans.name} fans={{ avatars: fans.avatars, count: fans.count }} type='subscriptions' />
              </div>
            ))}
          </div>
          <div className='subscriptionsLists__addlist' onClick={createNewList}>
            <img src={AllIcons.square_plus} alt={t('addNewList')} />
            {t('addNewList')}
          </div>
        </div>
      </WithHeaderSection>
    </BasicLayout>
  )
}

export default SubscriptionsLists
