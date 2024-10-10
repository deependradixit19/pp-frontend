import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { addToast } from '../../../../../components/Common/Toast/Toast'
import Button from '../../../../../components/UI/Buttons/Button'
import { useUserContext } from '../../../../../context/userContext'
import LayoutHeader from '../../../../../features/LayoutHeader/LayoutHeader'
import WithHeaderSection from '../../../../../layouts/WithHeaderSection/WithHeaderSection'
import { getSubscriptionPlans, updateSubscriptionPlans } from '../../../../../services/endpoints/api_subscription'
import { IPaymentPlan } from '../../../../../types/iTypes'
import PriceCard from '../components/PriceCard'
import style from './_set-price.module.scss'
import { getMinPrices } from '../../../../../services/endpoints/api_global'

const SetSubscriptionPrice: FC = () => {
  const { t } = useTranslation()
  const userData = useUserContext()
  const queryClient = useQueryClient()
  const [price, setPrice] = useState<any>(userData.subscription_price || t('priceNotSet'))
  const [pricePlan, setPricePlan] = useState<IPaymentPlan | null>(null)

  const priceMutation = useMutation((priceDetails: IPaymentPlan) => updateSubscriptionPlans(priceDetails), {
    onSuccess: () => {
      queryClient.invalidateQueries('loggedUserSubPlans')
      queryClient.invalidateQueries(['allSubsPlans', userData.id])
      addToast('success', 'Price set successfully')
    },
    onError: () => {
      addToast('error', 'Something went wrong, please try again')
    }
  })

  const { data: pricesData, isLoading: isLoadingPrices } = useQuery('min-max-prices', getMinPrices)

  const submitFn = () => {
    const onlyNumberRegex = /^\d*\.?\d*$/
    if (parseFloat(price) < parseFloat(pricesData.min_subscription_price)) {
      addToast('error', `${t('minPriceIs')} $${pricesData.min_subscription_price}`)
      return
    }
    if (parseFloat(price) > parseFloat(pricesData.max_subscription_price)) {
      addToast('error', `${t('maxPriceIs')} $${pricesData.max_subscription_price}`)
      return
    }
    if (
      ((price.toString().match(onlyNumberRegex) && parseFloat(price) >= pricesData.min_subscription_price) ||
        price.toString().trim().toLowerCase() === t('Free').trim().toLowerCase()) &&
      price.toString().trim() !== ''
    ) {
      if (pricePlan)
        priceMutation.mutate({ ...pricePlan, price: price.toString().trim().toLowerCase() === 'free' ? 0 : price })
    } else {
      addToast('error', t('inputValidPrice'))
    }
  }

  useEffect(() => {
    if (queryClient.getQueryData('loggedUserSubPlans')) {
      const pricePlans: any = queryClient.getQueryData('loggedUserSubPlans')
      const price = pricePlans.subscriptions.filter((plan: any) => plan.month_count === 1 && plan.active === 1)[0].price
      setPrice(price === 0 ? 'Free' : price)
      setPricePlan(pricePlans.subscriptions.filter((plan: any) => plan.month_count === 1 && plan.active === 1)[0])
    }
  }, [])

  useQuery('loggedUserSubPlans', () => getSubscriptionPlans(userData.id), {
    onSuccess: resp => {
      const monthlyPlan = resp.subscriptions.filter((plan: any) => plan.month_count === 1 && plan.active === 1)[0]
      setPricePlan(monthlyPlan)
      setPrice(monthlyPlan.price === 0 ? 'Free' : monthlyPlan.price)
    }
  })

  return (
    <WithHeaderSection
      customClass={style.header_wrapper}
      headerSection={<LayoutHeader type='basic' section={t('subscriptions')} title={t('setPrice')} />}
    >
      <PriceCard
        price={price}
        updatePrice={(val: any) => setPrice(val)}
        label={t('pricingPlan')}
        type='text'
        parseValue={false}
        isValid={true}
        customClass={`${style.price_card}`}
      />
      <div className={style.price_description}>
        <div>
          {!isLoadingPrices ? (
            <>
              {t('minimum')} <span>${pricesData.min_subscription_price}</span> {t('or')} <span>{t('Free')}</span>,{' '}
              {t('maximum')} <span>${pricesData.max_subscription_price}</span>
            </>
          ) : (
            'Loading...'
          )}
        </div>
      </div>
      <div className={style.button_wrapper}>
        <Button
          text={'Save'}
          color='black'
          disabled={priceMutation.isLoading || isLoadingPrices}
          customClass={`${style.button} ${priceMutation.isLoading || !pricePlan ? style.button_disabled : ''}`}
          clickFn={submitFn}
        />
      </div>
    </WithHeaderSection>
  )
}

export default SetSubscriptionPrice
