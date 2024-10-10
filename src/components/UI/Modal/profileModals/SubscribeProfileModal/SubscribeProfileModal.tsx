import { FC, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'

import { getAccessToken } from '../../../../../services/storage/storage'
import { AllIcons } from '../../../../../helpers/allIcons'
import * as spriteIcons from '../../../../../assets/svg/sprite'

import ImgInCircle from '../../../../../components/UI/ImgInCircle/ImgInCircle'
import SubscriptionCard from '../../../../../features/SubscriptionCard/SubscriptionCard'
import LoginForm from '../../../../../pages/auth/view/LoginForm'

import './_subscribe-profile-modal.scss'

const SubscribeProfileModal: FC<{
  displayName: string
  avatar: string | null
  username: string
  id: number
  subscribeFn: any
  selected: number | string
  setSelected: any
  isLoading?: boolean
  campaign: number | null
  setCampaign: any
}> = ({ displayName, avatar, username, id, subscribeFn, selected, setSelected, isLoading, campaign, setCampaign }) => {
  const [bundlesShown, setBundlesShown] = useState(false)
  const isAuthenticated = !!getAccessToken()
  const { data } = useQuery<any>(['allSubsPlans', id], {
    refetchOnWindowFocus: false
  })
  const { t } = useTranslation()

  return (
    <div className={`subscribe-profile-modal-wrapper ${bundlesShown ? 'subscribe-profile-modal-wrapper-bundles' : ''}`}>
      <div className='subscribe-profile-modal-container'>
        <div className='subscribe-profile-modal-info'>
          <ImgInCircle type='profile' hasLoader={true} customClass='subscribe-profile-modal-avatar'>
            <img src={avatar ? avatar : AllIcons.user_placeholder} alt={t('profileAvatar')} />
          </ImgInCircle>

          <div className='subscribe-profile-modal-info-name-container'>
            <div className='subscribe-profile-modal-info-name'>{displayName}</div>
            <div className='subscribe-profile-modal-info-name-username'>@{username}</div>
          </div>
        </div>

        <div className='subscribe-profile-modal-subscription-benefits-container'>
          <div className='subscribe-profile-modal-subscription-benefit'>
            <spriteIcons.IconCheckmarkGradient />
            <span className='subscibtion-benefit-text'>{t('fullAccessToThisUserContent')}</span>
          </div>
          <div className='subscribe-profile-modal-subscription-benefit'>
            <spriteIcons.IconCheckmarkGradient />
            <span className='subscibtion-benefit-text'>{t('directMessageWithThisUser')}</span>
          </div>
          <div className='subscribe-profile-modal-subscription-benefit'>
            <spriteIcons.IconCheckmarkGradient />
            <span className='subscibtion-benefit-text'>{t('cancelYourSubscriptionsAtAnyTime')}</span>
          </div>
        </div>

        {isAuthenticated ? (
          <>
            {' '}
            {data?.subscriptions.map((item: any) =>
              item.id === selected ? (
                <SubscriptionCard
                  key={item.id}
                  selected={item.id === selected ? true : false}
                  onClick={() => setSelected(item.id)}
                  data={item}
                  notInList={true}
                />
              ) : (
                `${item.id}campaign` === selected &&
                data?.campaign && (
                  <SubscriptionCard
                    key={item.id}
                    selected={`${item.id}campaign` === selected ? true : false}
                    onClick={() => null}
                    data={item}
                    notInList={true}
                    campaignDiscount={data.campaign.discount}
                  />
                )
              )
            )}
            <button className='subscription-profile-modal-bundles-button' onClick={() => setBundlesShown(true)}>
              {t('viewBundles')}
            </button>
            <button
              className={`subscription-profile-modal-subscribe-button ${
                isLoading ? 'subscription-profile-modal-subscribe-button-loading' : ''
              }`}
              onClick={subscribeFn}
            >
              {t('subscribe')}
            </button>
          </>
        ) : (
          <div className='subscribe-profile-modal-login-container'>
            <LoginForm fromUser={true} />
          </div>
        )}
      </div>
      <div className='subscribe-profile-modal-bundles-container'>
        <div className='subscribe-profile-modal-bundles-options'>
          {data?.campaign &&
            data.subscriptions
              .filter((plan: any) => plan.month_count === 1)
              .map((plan: any) => (
                <SubscriptionCard
                  key={data.campaign.id}
                  data={plan}
                  selected={`${plan.id}campaign` === selected ? true : false}
                  onClick={() => {
                    setSelected(`${plan.id}campaign`)
                    setCampaign(data.campaign.id)
                  }}
                  campaignDiscount={data.campaign.discount}
                />
              ))}
          {data?.subscriptions
            .sort((a: any, b: any) => a.month_count - b.month_count)
            .map((item: any) => (
              <SubscriptionCard
                key={item.id}
                selected={item.id === selected ? true : false}
                onClick={() => {
                  setSelected(item.id)
                  setCampaign(null)
                }}
                data={item}
              />
            ))}
        </div>
        <button
          className='subscription-profile-modal-bundles-button subscribe-profile-modal-back-button'
          onClick={() => setBundlesShown(false)}
        >
          {t('back')}
        </button>
        <button
          className={`subscription-profile-modal-subscribe-button ${
            isLoading ? 'subscription-profile-modal-subscribe-button-loading' : ''
          }`}
          onClick={subscribeFn}
        >
          {t('subscribe')}
        </button>
      </div>
    </div>
  )
}

export default SubscribeProfileModal
