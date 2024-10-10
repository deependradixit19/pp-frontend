import { FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'

// Services
import { AllIcons } from '../../helpers/allIcons'
import { useFilterQuery } from '../../helpers/hooks'
import { getSubscriptions } from '../../services/endpoints/api_subscription'

// Components
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../features/LayoutHeader/LayoutHeader'
import LinkTabs from '../../components/UI/LinkTabs/LinkTabs'
import CreatorsList from '../../features/CreatorsList/CreatorsList'
import CoverBg from '../../assets/images/cover-bg.jpg'
import SuggestedList from '../../features/SuggestedList/SuggestedList'
import BellLink from '../../components/UI/BellLink/BellLink'

// Styling
import './_subscriptions.scss'

const useSortSubsActive = () => {
  const { t } = useTranslation()
  return [
    {
      value: 1,
      name: t('recentlySubscribed')
    },
    {
      value: 2,
      name: t('favorite')
    },
    {
      value: 3,
      name: t('expiring')
    },
    {
      value: 4,
      name: t('onlineStatus')
    },
    {
      value: 5,
      name: t('lastActivity')
    },
    {
      value: 6,
      name: t('name')
    }
  ]
}

const useSortSubsExpired = () => {
  const { t } = useTranslation()
  return [
    {
      value: 1,
      name: t('recentlyExpired')
    },
    {
      value: 2,
      // subscription plan price
      name: t('favorite')
    },
    {
      value: 3,
      // subscription plan discount
      name: t('expiring')
    },
    {
      value: 4,
      name: t('name')
    }
  ]
}

const useSubsOrder = () => {
  const { t } = useTranslation()
  return [
    {
      value: 1,
      name: t('ascending')
    },
    {
      value: 2,
      name: t('descending')
    }
  ]
}

const Subscriptions: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedSort, setSelectedSort] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(1)
  const [activeFilter, setActiveFilter] = useState<'active' | 'expired'>('active')
  const [creators, setCreators] = useState<any[]>([])

  const navigate = useNavigate()
  const params = useParams<{ type: string | undefined }>()
  const sortSubsActive = useSortSubsActive()
  const sortSubsExpired = useSortSubsExpired()
  const sortSubsOrder = useSubsOrder()
  const { t } = useTranslation()

  const filter = useFilterQuery()
  const type = filter.get('type')
  const sort = filter.get('sort')
  const order = filter.get('order')

  const { data, isFetching } = useInfiniteQuery(
    ['subscriptions', filter, activeFilter, selectedOrder, selectedSort],
    ({ pageParam = 1 }) => getSubscriptions(selectedSort, activeFilter, selectedOrder, pageParam),
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.nextCursor
      },
      enabled: true,
      keepPreviousData: true,
      refetchOnWindowFocus: false
    }
  )

  useEffect(() => {
    if (type && (type === 'active' || type === 'expired')) {
      setActiveFilter(type)
    } else {
      setActiveFilter('active')
    }
    if (sort) {
      setSelectedSort(parseInt(sort))
    }
    if (order) {
      setSelectedOrder(parseInt(order))
    }
  }, [type, sort, order])

  useEffect(() => {
    if (data && !isFetching) {
      const tmp = data.pages
        .map(page => {
          return page.page.data.data
        })
        .flat()
        .map(data => {
          return {
            coverUrl: CoverBg,
            avatarUrl: data.model_data.avatar,
            name: `${data.model_data.first_name} ${data.model_data.last_name}`,
            handle: data.model_data.username,
            isLive: data.model_data.is_live === 'not yet' ? false : true,
            isOnline: data.model_data.is_online,
            isActive: activeFilter === 'active',
            price: data.model_data.price,
            save: data.model_data.discount,
            userId: data.model_data.user_id,
            newPostsCount: data.model_data.new_posts,
            expires: data.model_data.expires,
            billingCycle: data.model_data.billing_cycle, // month
            monthsSubscribed: data.model_data.total_months_subscribed,
            renewalPrice:
              data.model_data.discount > 0
                ? data.model_data.price * (data.model_data.discount / 100)
                : data.model_data.price,
            renewDate:
              data.model_data.subscription_renew_date === 'no renewal' ? '' : data.model_data.subscription_renew_date,
            lastActivity: data.model_data.last_activity
          }
        })
      setCreators(tmp)
    }
  }, [isFetching, data])

  return (
    <BasicLayout
      title={t('subscriptions')}
      customContentClass='subscriptions__content__wrapper'
      headerRightEl={<BellLink />}
    >
      <WithHeaderSection
        headerSection={
          <LayoutHeader
            type='search-with-buttons'
            searchValue={searchTerm}
            searchFn={(term: string) => setSearchTerm(term)}
            clearFn={() => setSearchTerm('')}
            additionalProps={{ placeholder: t('searchSubscriptions') }}
            buttons={[
              {
                type: 'cta',
                icon: AllIcons.list,
                action: () => navigate('/subscriptions/lists')
              },
              {
                type: 'sort',
                elements: {
                  first_section: activeFilter === 'active' ? sortSubsActive : sortSubsExpired,
                  second_section: sortSubsOrder
                }
              }
            ]}
            applyFn={(val: string, val1?: string) => {
              val && setSelectedSort(parseInt(val))
              val1 && setSelectedOrder(parseInt(val1))
            }}
          />
        }
      >
        <div className='subscriptions__tabs'>
          <LinkTabs
            route={params.type ? `/subscriptions/${params?.type}` : '/subscriptions'}
            filters={['active', 'expired']}
            activeFilter={activeFilter}
          />
          <div className='subscriptions__tabs--count'>
            <span>{creators.length} </span>
            {t('subscriptions')}
          </div>
        </div>
        <CreatorsList
          creators={creators}
          heightAdjustment={320}
          renderLocation={activeFilter === 'active' ? 'subscriptionsActive' : 'subscriptionsExpired'}
        />
        {activeFilter === 'active' && (
          <>
            <div className='subscriptions__divider'></div>
            <SuggestedList />
          </>
        )}
      </WithHeaderSection>
    </BasicLayout>
  )
}

export default Subscriptions
