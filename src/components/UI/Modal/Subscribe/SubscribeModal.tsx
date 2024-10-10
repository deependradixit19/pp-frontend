import { FC, useState, useEffect } from 'react'
import './_subscribeModal.scss'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { useModalContext } from '../../../../context/modalContext'
import { AllIcons } from '../../../../helpers/allIcons'
import ImgInCircle from '../../ImgInCircle/ImgInCircle'
import InputCard from '../../../Form/InputCard/InputCard'
import Button from '../../Buttons/Button'

import { getSubscriptionPlans } from '../../../../services/endpoints/api_subscription'

import { IPaymentPlan } from '../../../../types/iTypes'

const SubscribeModal: FC<{
  id: number
  avatar: string | undefined
  cover: string | null | undefined
  display_name: string
  username: string
  isSubscribed: boolean
  subscribe: any
  price?: number
  refetchFeed?(): void
}> = ({ id, avatar, cover, display_name, username, isSubscribed, subscribe, price, refetchFeed }) => {
  const [benefitsExpanded, setBenefitsExpanded] = useState<boolean>(false)
  const [successSub, setSuccessSub] = useState<boolean>(false)
  const [successUnsub, setSuccessUnsub] = useState<boolean>(false)
  const [minPlan, setMinPlan] = useState<IPaymentPlan>()
  const [subscribeError, setSubscribeError] = useState<string>('')
  const [reason, setReason] = useState<{
    active: boolean
    text: string
  }>({
    active: false,
    text: ''
  })

  const modalData = useModalContext()
  const { t } = useTranslation()

  const { data, error } = useQuery(['allSubsPlans', id], () => getSubscriptionPlans(id), {
    refetchOnWindowFocus: false
  })

  useEffect(() => {
    if (data) {
      let min = data?.subscriptions[0].price
      data?.subscriptions.forEach((plan: IPaymentPlan, index: number) => {
        let value = data?.subscriptions[index].price

        min = value < min ? value : min
      })

      const tmpMinPlan = data?.subscriptions.filter((item: IPaymentPlan) => item.price === min)

      tmpMinPlan.length && setMinPlan(tmpMinPlan[0])
    }
  }, [data])

  const benefitsNotExpanded = [
    {
      icon: AllIcons.sub_selfie,
      alt: t('fullAccessToThisUserContent'),
      text: t('fullAccessToThisUserContent')
    },
    {
      icon: AllIcons.sub_chat,
      alt: t('directMessageWithThisUser'),
      text: t('directMessageWithThisUser')
    },
    {
      icon: AllIcons.sub_close,
      alt: t('cancelYourSubscriptionsAtAnyTime'),
      text: t('cancelYourSubscriptionsAtAnyTime')
    }
  ]
  const benefitsYesExpanded = [
    {
      icon: AllIcons.sub_selfie,
      alt: t('fullAccessToThisUserContent'),
      text: t('fullAccessToThisUserContent')
    },
    {
      icon: AllIcons.sub_chat,
      alt: t('directMessageWithThisUser'),
      text: t('directMessageWithThisUser')
    },
    {
      icon: AllIcons.sub_close,
      alt: t('cancelYourSubscriptionsAtAnyTime'),
      text: t('cancelYourSubscriptionsAtAnyTime')
    },
    {
      icon: AllIcons.sub_star,
      alt: t('beIncludedFor'),
      text: t('beIncludedFor')
    }
  ]

  if (isSubscribed) {
    return (
      <div className='subscribeModal subscribeModal__unsub'>
        <div className='subscribeModal__header'>
          <h1>{t('subscription')}</h1>
        </div>
        <div className='subscribeModal__profile'>
          <ImgInCircle type='small'>
            <img src={avatar} alt={t('avatar')} />
          </ImgInCircle>
          <div className='subscribeModal__profile__info'>
            <p className='subscribeModal__profile__info__name'>{display_name}</p>
            <p className='subscribeModal__profile__info__username'>{username}</p>
          </div>
        </div>
        {!successUnsub ? (
          <>
            {' '}
            <div className='subscribeModal__unsubinfo'>
              <p>
                {t('ifYouUnsubscribe')} <span>Sep 15, 2021</span>
              </p>
            </div>
            <div className={`subscribeModal__reason subscribeModal__reason--${reason.active ? 'active' : 'inactive'}`}>
              <p onClick={() => setReason({ active: !reason.active, text: '' })}>{t('addReason')}</p>
              <InputCard
                isTextArea={true}
                type='text'
                label={`${t('reason')}...`}
                value={reason.text}
                changeFn={(val: string) => setReason({ ...reason, text: val })}
                customClass='subscribeModal__reason__input'
              />
            </div>
          </>
        ) : (
          <div className='subscribeModal__unsubinfo'>
            <p>{t('youHaveSuccessfullyUnsubscribed')}</p>
          </div>
        )}
        <div className='subscribeModal__unsub__actions'>
          {!successUnsub ? (
            <>
              <Button
                text={t('back')}
                color='grey'
                font='mont-14-normal'
                width='13'
                height='3'
                clickFn={() => modalData.clearModal()}
              />
              <Button
                text={t('unsubscribe')}
                color='black'
                font='mont-14-normal'
                width='13'
                height='3'
                clickFn={() => {
                  subscribe(id, 1).then((resp: { is_subscribed: boolean; message: string }) => {
                    setSuccessUnsub(true)
                    refetchFeed && refetchFeed()
                  })
                }}
              />
            </>
          ) : (
            <Button
              text={t('close')}
              color='black'
              font='mont-14-normal'
              width='13'
              height='3'
              clickFn={() => modalData.clearModal()}
            />
          )}
        </div>
      </div>
    )
  } else {
    return (
      <div className='subscribeModal'>
        <div className='subscribeModal__cover' style={{ backgroundImage: `url(${cover || null})` }} />
        <ImgInCircle type='small' hasLoader={true} customClass='subscribeModal__avatar'>
          <img src={avatar} alt={t('avatar')} />
        </ImgInCircle>
        <div className='subscribeModal__body'>
          <div className='subscribeModal__user'>
            <p className='subscribeModal__user__name'>{display_name}</p>
            <p className='subscribeModal__user__username'>{username}</p>
          </div>

          {successSub ? <div className='subscribeModal__successful__sub'>{t('successfullySubscribed')}</div> : ''}

          {!successSub ? (
            !benefitsExpanded ? (
              <div className='subscribeModal__benefits'>
                <h1 className='subscribeModal__benefits__title'>
                  {t('subscribeAnd')}
                  <span onClick={() => setBenefitsExpanded(true)}>{t('getThisBenefits')}</span>
                </h1>
                <div className='subscribeModal__benefits__list'>
                  {benefitsNotExpanded.map((benefit: { icon: string; alt: string; text: string }, key: number) => (
                    <div className='subscribeModal__benefit' key={key}>
                      <img src={benefit.icon} alt={benefit.alt} />
                      <p>{benefit.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className='subscribeModal__benefits'>
                <h1 className='subscribeModal__benefits__title'>{t('subscriptionBenefits')}</h1>
                <div className='subscribeModal__benefits__list'>
                  {benefitsYesExpanded.map((benefit: { icon: string; alt: string; text: string }, key: number) => (
                    <div className='subscribeModal__benefit' key={key}>
                      <img src={benefit.icon} alt={benefit.alt} />
                      <p>{benefit.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            ''
          )}

          <div className='subscribeModal__actions'>
            {!successSub ? (
              benefitsExpanded ? (
                <>
                  <small className='error bundle'>{subscribeError}</small>
                  {data?.subscriptions.map((option: any, key: number) => (
                    <button
                      className='subscribeModal__button subscribeModal__button--medium'
                      key={key}
                      onClick={() => {
                        subscribe(id, option.id).then((resp: { is_subscribed: boolean; message: string }) => {
                          if (resp.is_subscribed) {
                            setSuccessSub(true)
                          }
                          refetchFeed && refetchFeed()
                        })
                      }}
                    >
                      <p className='subscribeModal__button--medium__left'>{t('subscribe')}</p>
                      <p className='subscribeModal__button--medium__right'>
                        ${option.discount ? option.price - (option.price / 100) * option.discount : option.price}{' '}
                        <span>
                          / {option.month_count} {t('month')}
                          {option.month_count > 1 ? 's' : ''}
                        </span>
                      </p>
                    </button>
                  ))}
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      subscribe(id, minPlan?.id).then(
                        (resp: { is_subscribed: boolean; message: string; status: boolean }) => {
                          if (!resp.status) {
                            setSubscribeError(resp.message)
                            return
                          }
                          if (resp.is_subscribed) {
                            setSuccessSub(true)
                          }
                          refetchFeed && refetchFeed()
                        }
                      )
                    }}
                    className='subscribeModal__button subscribeModal__button--big'
                  >
                    {t('subscribe')}
                    <span className='subscribeModal__button--big__span'>${minPlan?.price}</span>
                  </button>
                  <small className='error single'>{subscribeError}</small>
                  <button
                    onClick={() => setBenefitsExpanded(true)}
                    className='subscribeModal__button subscribeModal__button--small'
                  >
                    {t('viewBundless')}
                  </button>
                </>
              )
            ) : (
              <div className='subscribeModal__unsub__actions subscribeModal__successful__sub--close'>
                <Button
                  text={t('close')}
                  color='black'
                  font='mont-14-normal'
                  width='13'
                  height='3'
                  clickFn={() => modalData.clearModal()}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default SubscribeModal
