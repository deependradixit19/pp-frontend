import { FC, useState, useEffect } from 'react'
import './_subsOptions.scss'
import { useQuery, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import { useUserContext } from '../../../../context/userContext'
import { getSubscriptionPlans } from '../../../../services/endpoints/api_subscription'
import WithHeaderSection from '../../../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../../../features/LayoutHeader/LayoutHeader'
import ActionCard from '../../../../features/ActionCard/ActionCard'
import { IconDollarCircleArrows } from '../../../../assets/svg/sprite'

const SubscriptionOptions: FC = () => {
  const queryClient = useQueryClient()
  const [price, setPrice] = useState('loading...')
  const userData = useUserContext()
  const { t } = useTranslation()

  useEffect(() => {
    if (queryClient.getQueryData('loggedUserSubPlans')) {
      const pricePlans: any = queryClient.getQueryData('loggedUserSubPlans')
      const price = pricePlans.subscriptions.filter((plan: any) => plan.month_count === 1 && plan.active === 1)[0].price
      setPrice(price === 0 ? 'Free' : price)
    }
  }, [])

  useQuery('loggedUserSubPlans', () => getSubscriptionPlans(userData.id), {
    onSuccess: resp => {
      const monthlyPlan = resp.subscriptions.filter((plan: any) => plan.month_count === 1 && plan.active === 1)[0]
      setPrice(monthlyPlan.price === 0 ? 'Free' : monthlyPlan.price)
    }
  })

  return (
    <WithHeaderSection
      headerSection={<LayoutHeader type='basic' section={t('general')} title={t('subscriptionPricing')} />}
    >
      <ActionCard
        icon={<IconDollarCircleArrows />}
        hasArrow={true}
        absFix={true}
        text={t('setPrice')}
        description={`${
          price.toString().toLowerCase().trim() === 'free' || price.toString().toLowerCase().trim() === 'loading...'
            ? price
            : `$${price}`
        }`}
        link='/settings/general/subscription-options/set-price'
      />
      <ActionCard
        icon={<IconDollarCircleArrows />}
        hasArrow={true}
        absFix={true}
        text={t('discountedBundles')}
        description={t('membersCanSaveTxt')}
        link='/settings/general/subscription-options/discounted-bundles'
      />
      <ActionCard
        icon={<IconDollarCircleArrows />}
        hasArrow={true}
        absFix={true}
        text={t('promoCampaigns')}
        description={t('offerAFreeTrialTxt')}
        link='/settings/general/subscription-options/promo-campaigns'
      />
      <ActionCard
        icon={<IconDollarCircleArrows />}
        hasArrow={true}
        absFix={true}
        text={t('createFreeTrialLink')}
        description={t('createAndManage')}
        link='/settings/general/subscription-options/free-trial-link'
      />
    </WithHeaderSection>
  )
}

export default SubscriptionOptions
