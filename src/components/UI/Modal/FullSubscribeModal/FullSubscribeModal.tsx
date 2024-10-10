import { useTranslation } from 'react-i18next'
import { FC, useCallback, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import SubscribeProfileModal from '../../Modal/profileModals/SubscribeProfileModal/SubscribeProfileModal'

import { useUserContext } from '../../../../context/userContext'
import { subscribeToUser } from '../../../../services/endpoints/profile'
import ModalWrapper from '../../../../features/ModalWrapper/ModalWrapper'
import { addToast } from '../../../../components/Common/Toast/Toast'
import { ISubscribePayload } from '../../../../types/interfaces/ITypes'
import { useModalContext } from '../../../../context/modalContext'
import { getSubscriptionPlans } from '../../../../services/endpoints/api_subscription'

const FullSubscribeModal: FC<{
  id: number
  avatar: string
  displayName: string
  username: string
  onSubscribe?: () => void
}> = ({ id, avatar, displayName, username, onSubscribe }) => {
  const { t } = useTranslation()
  const userData = useUserContext()
  const queryClient = useQueryClient()
  const [subscribeModalOpen, setSubscribeModalOpen] = useState<boolean>(true)
  const invalidateProfile = useCallback(() => {
    queryClient.invalidateQueries(['notifications'])
    queryClient.invalidateQueries(['profile', id])
  }, [queryClient, id])
  const modalData = useModalContext()

  const [selectedSubscriptionPlan, setSelectedSubscriptionPLan] = useState<number | string>(0)

  const [campaign, setCampaign] = useState<number | null>(null)

  const subscribeToModel = () => {
    const subscribePayload: ISubscribePayload = {
      id,
      subscription_plan_id:
        typeof selectedSubscriptionPlan === 'number'
          ? selectedSubscriptionPlan
          : parseFloat(selectedSubscriptionPlan.replace('campaign', '')),
      promo_campaign_id: campaign,
      payment_method: userData.default_payment_method === 'wallet' ? 'deposit' : userData.default_payment_method
    }
    if (userData && userData.default_payment_method && userData.default_card) {
      subscribePayload.card_id = userData.default_card
    }

    return subscribeToUser(subscribePayload)
  }

  const subscribeMutation = useMutation(() => subscribeToModel(), {
    onSuccess: resp => {
      invalidateProfile()
      setSubscribeModalOpen(false)
      queryClient.invalidateQueries(['allSubsPlans', id])
      if (resp.status) {
        if (resp.is_subscribed) {
          addToast('success', t('successfullySubscribed'))
          onSubscribe?.()
        } else {
          addToast('success', t('successfullyUnsubscribed'))
        }
      } else {
        if (resp.message) {
          addToast('success', resp.message)
          onSubscribe?.()
        }
        if (resp.error) {
          addToast('error', resp.error)
          setSubscribeModalOpen(false)
        }
      }
    },
    onError: () => {
      invalidateProfile()
      setSubscribeModalOpen(false)
      addToast('error', t('error:anErrorOccuredPleaseTryAgain'))
    }
  })

  const handleSetSelectedSubscriptionPlan = useCallback((planId: number) => {
    setSelectedSubscriptionPLan(planId)
  }, [])

  const { data, error } = useQuery(['allSubsPlans', id], () => getSubscriptionPlans(id), {
    refetchOnWindowFocus: false,
    onSuccess: resp => {
      if (!!resp.subscriptions?.length) {
        const defaultPlan = resp.subscriptions.filter((plan: any) => plan.month_count === 1)[0].id
        if (resp.campaign) {
          // handleSetSelectedSubscriptionPlan(`${defaultPlan}campaign`);
          setCampaign(resp.campaign.id)
        } else {
          handleSetSelectedSubscriptionPlan(defaultPlan)
          setCampaign(null)
        }
      }
    }
  })

  useEffect(() => {
    if (!subscribeModalOpen) {
      modalData.clearModal()
    }
  }, [subscribeModalOpen])

  return (
    <ModalWrapper
      open={subscribeModalOpen}
      setOpen={setSubscribeModalOpen}
      customClass='subscribe-profile-modal-modal'
      hasCloseButton={true}
    >
      <SubscribeProfileModal
        displayName={displayName}
        avatar={avatar}
        username={username}
        id={id}
        subscribeFn={() => {
          subscribeMutation.mutate()
          onSubscribe?.()
        }}
        isLoading={subscribeMutation.isLoading}
        selected={selectedSubscriptionPlan}
        setSelected={handleSetSelectedSubscriptionPlan}
        campaign={campaign}
        setCampaign={setCampaign}
      />
    </ModalWrapper>
  )
}

export default FullSubscribeModal
