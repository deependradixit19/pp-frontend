import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import { useModalContext } from '../../../../../context/modalContext'
import { useUserContext } from '../../../../../context/userContext'
import LayoutHeader from '../../../../../features/LayoutHeader/LayoutHeader'
import WithHeaderSection from '../../../../../layouts/WithHeaderSection/WithHeaderSection'
import { getSubscriptionPlans } from '../../../../../services/endpoints/api_subscription'
import SubscriptionCard from '../components/SubscriptionCard'
import NewPlan from '../NewPlan'
import { updateSubscriptionPlans, deleteSubscriptionPlan } from '../../../../../services/endpoints/api_subscription'
import { IPaymentPlan } from '../../../../../types/iTypes'
import style from './_discounted-bundles.module.scss'
import { AllIcons } from '../../../../../helpers/allIcons'
import { IconDollarCircleArrowsOutline } from '../../../../../assets/svg/sprite'

const DiscountedBundles: FC = () => {
  const { t } = useTranslation()
  const userData = useUserContext()
  const modalData = useModalContext()
  const queryClient = useQueryClient()
  const initialPrice = queryClient
    .getQueryData<any>(['allSubsPlans', userData.id])
    ?.subscriptions.filter((bundle: any) => bundle.month_count === 1)[0].price
  const [singleMonthPrice, setSingleMonthPrice] = useState(initialPrice || 0)

  const { data, isLoading } = useQuery(['allSubsPlans', userData.id], () => getSubscriptionPlans(userData.id), {
    onSuccess: (resp: any) => {
      const price = resp.subscriptions.filter((bundle: any) => bundle.month_count === 1)[0].price
      setSingleMonthPrice(price)
    }
  })

  const updatePlan = useMutation(
    (planData: { newPlan: IPaymentPlan; index: number; toggleUpdate?: boolean }) => {
      return updateSubscriptionPlans(planData.newPlan)
    },
    {
      onMutate: async resData => {
        await queryClient.cancelQueries(['allSubsPlans', userData.id])
        const previousValue = await queryClient.getQueryData(['allSubsPlans', userData.id])

        queryClient.setQueryData(['allSubsPlans', userData.id], (oldData: any) => {
          const newArray = oldData.subscriptions
          if (resData.toggleUpdate) {
            for (let i = 0; i < newArray.length; i++) {
              if (newArray[i].month_count === resData.newPlan.month_count) {
                newArray[i].active = newArray[i].active === 1 ? 0 : 1
              }
            }
          }
          newArray[resData.index] = resData.newPlan

          return { ...oldData, subscriptions: newArray }
        })

        return previousValue
      },
      onError: (error, newData, context: any) => {
        queryClient.setQueryData(['allSubsPlans', userData.id], context.previousQueryData)
      }
    }
  )

  const deletePlan = useMutation(
    (planId: number) => {
      return deleteSubscriptionPlan(planId)
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(['allSubsPlans', userData.id])
      }
    }
  )

  const editPlan = (id?: number) =>
    id && modalData.addModal(t('updateSubscriptionPlan'), <NewPlan id={id} price={singleMonthPrice} />)

  return (
    <WithHeaderSection
      customClass={style.header_wrapper}
      headerSection={<LayoutHeader type='basic' title={t('discountedBundles')} section={t('subscriptions')} />}
    >
      {isLoading && <div className='loader'></div>}
      {!isLoading && data.subscriptions && singleMonthPrice > 0
        ? data.subscriptions
            .filter((bundle: any) => bundle.month_count !== 1)
            .sort((a: any, b: any) => a.month_count - b.month_count)
            .map((bundle: any) => (
              <SubscriptionCard
                type='card'
                id={bundle.id}
                key={bundle.id}
                name={bundle.name}
                price={bundle.price}
                monthCount={bundle.month_count}
                discount={bundle.discount}
                displayMonthlyPrice={true}
                isActive={bundle.active === 1}
                customClass={style.bundles_card}
                selectable={false}
                editFn={() => editPlan(bundle.id)}
                deleteFn={() => deletePlan.mutate(bundle.id)}
                switchFn={() =>
                  updatePlan.mutate({
                    newPlan: { ...bundle, active: bundle.active === 1 ? 0 : 1 },
                    index: data.subscriptions.indexOf(bundle),
                    toggleUpdate: true
                  })
                }
              />
            ))
        : !isLoading && (
            <div className={style.no_price_container}>
              <IconDollarCircleArrowsOutline />
              <div className={style.no_price_text}>
                You must have a subscription price enabled in order to create discount bundles.
              </div>
              <Link to='/settings/general/subscription-options/set-price'>
                <div className={style.no_price_link}>Goto Subscription Pricing</div>
              </Link>
            </div>
          )}
      {!isLoading && singleMonthPrice > 0 && (
        <SubscriptionCard
          clickFn={() => modalData.addModal('Create New Bundle', <NewPlan price={singleMonthPrice} />)}
        />
      )}
    </WithHeaderSection>
  )
}

export default DiscountedBundles
