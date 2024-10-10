import { FC, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import { IProfileInfo } from '../../../../../types/interfaces/IProfileInfo'
import { useUserContext } from '../../../../../context/userContext'
import { useModalContext } from '../../../../../context/modalContext'
import { Icons } from '../../../../../helpers/icons'
import { AllIcons } from '../../../../../helpers/allIcons'
import { getAccessToken } from '../../../../../services/storage/storage'

import StoriesList from '../../../../../features/StoriesList/StoriesList'
import Button from '../../../../../components/UI/Buttons/Button'
import TipModal from '../../../../../components/UI/Modal/Tip/TipModal'
import ProfileNotificationsModal from '../../../../../components/UI/Modal/ProfileNotifications/ProfileNotificationsModal'
import { getSubscriptionPlans } from '../../../../../services/endpoints/api_subscription'
import { IPaymentPlan } from '../../../../../types/iTypes'
import { deleteFriend } from '../../../../../services/endpoints/profile'
import * as spriteIcons from '../../../../../assets/svg/sprite'
import { listCards } from '../../../../../services/endpoints/payment'

const ProfileInfo: FC<IProfileInfo> = ({
  id,
  role,
  display_name,
  follower_count,
  friend_count,
  avatar,
  username,
  isSubscribed,
  friends_status,
  friendRequest,
  setSubscribeModalOpen,
  mini_bio,
  show_follower_count,
  show_friends_count,
  show_likes_count,
  show_mini_bio,
  post_like_count,
  setPlanId,
  setCampaign
}) => {
  const [price, setPrice] = useState<number | null>(null)
  const [discount, setDiscount] = useState<number | null>(null)
  const [cardsList, setCardsList] = useState<any>([])
  const userData = useUserContext()
  const modalData = useModalContext()
  const isAuthenticated = !!getAccessToken()

  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { data, error } = useQuery(['allSubsPlans', id], () => getSubscriptionPlans(id), {
    refetchOnWindowFocus: false,
    onSuccess: resp => {
      if (!!resp.subscriptions?.length) {
        const defaultPlan = resp.subscriptions.filter((plan: any) => plan.month_count === 1)[0].id
        if (resp.campaign) {
          setPlanId(`${defaultPlan}campaign`)
          setCampaign(resp.campaign.id)
        } else {
          setPlanId(defaultPlan)
          setCampaign(null)
        }
      }
    }
  })

  useEffect(() => {
    if (isAuthenticated) {
      fetchCardsList()
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchCardsList()
    }
  }, [isAuthenticated])

  const fetchCardsList = async () => {
    const data = await listCards()

    setCardsList(data.data)
  }

  const getPrice = (data: { subscriptions: IPaymentPlan[] }) => {
    let min = data?.subscriptions[0].price
    data?.subscriptions.forEach((plan, index) => {
      let value = data?.subscriptions[index].price

      min = value < min ? value : min
    })

    return min
  }

  useEffect(() => {
    if (data && data.subscriptions.length) {
      const minPrice = getPrice(data)
      if (data.campaign) {
        setDiscount(data.campaign.discount)
        setPrice(minPrice * (1 - data.campaign.discount / 100))
      } else {
        setPrice(minPrice)
      }
    }
  }, [data])

  const addTip = () => {
    modalData.addModal(
      t('tipAmount'),
      <TipModal
        modelData={{
          modelId: id,
          avatarSrc: avatar
        }}
      />
    )
  }

  const notificationsModal = () => {
    modalData.addModal(t('Notifications'), <ProfileNotificationsModal id={id} />)
  }

  const buttonsSwitcher = () => {
    if (userData.id === id && role === 'model' && userData.role === 'model') {
      return 'model'
    }
    if (userData.id !== id && role === 'model' && userData.role === 'model') {
      return 'model-on-model'
    }
    if (userData.id === id && role === 'fan' && userData.role === 'fan') {
      return 'fan'
    }
    if (userData.id !== id && role === 'model' && userData.role === 'fan') {
      return 'fan-on-model'
    }
    if (!userData.id) {
      return 'not-logged'
    }
  }

  const renderProfileInfoButton = () => {
    if (!isSubscribed) {
      if (cardsList && cardsList.length === 0 && userData.default_payment_method !== 'wallet') {
        return buttonType('addCard')
      } else {
        return buttonType('subscribe')
      }
    } else {
      return buttonType('subscribed')
    }
  }

  const buttonType = (type: string) => {
    switch (type) {
      case 'subscribe':
        return (
          <Button
            text={
              <>
                {t('subscribe')}{' '}
                <b style={{ marginLeft: '4px' }}>{price === 0 || price === null ? 'Free' : `$${price}`}</b>
                {discount && (
                  <div className='profileholder__buttons__sub__discount'>
                    {t('save')} {discount}%{' '}
                  </div>
                )}
              </>
            }
            color='blue'
            font='mont-14-normal'
            width='fit'
            padding='2'
            height='3'
            clickFn={() => setSubscribeModalOpen(true)}
            customClass='profileholder__buttons__sub'
          />
        )

      case 'addCard':
        return (
          <Link
            style={{ textDecoration: 'none' }}
            className='button button--blue button--mont-14-normal button--width-fit button--height-3 button--padding-2 profileholder__buttons__sub'
            to='/settings/general/wallet'
          >
            Add a Payment Card
          </Link>
        )

      case 'subscribed':
        return (
          <Button
            text={t('subscribed')}
            color='transparent'
            type='transparent--dark1px'
            font='mont-14-normal'
            width='fit'
            padding='2'
            height='3'
            clickFn={() => setSubscribeModalOpen(true)}
            icon={AllIcons.profile_checkcircle}
            customClass='profileholder__buttons__sub'
          />
        )

      case 'tip':
        return (
          <Button
            text={t('tip')}
            color='blue'
            font='mont-14-normal'
            width='fit'
            padding='2'
            height='3'
            clickFn={addTip}
            icon={Icons.coins}
            customClass='profileholder__buttons__sub'
          />
        )

      // case 'social-trade':
      //   return (
      //     <Button
      //       text={<img src={Icons.plus} alt="Social trade" />}
      //       color="transparent"
      //       type="transparent--dark1px"
      //       height="3"
      //       customClass="profileholder__buttons__round"
      //     />
      //   );

      // FRIENDS REQUESTS
      case 'Not friend':
        return (
          <Button
            text={<img src={Icons.addUser} alt={t('addFriend')} />}
            color='blue'
            height='3'
            clickFn={() => friendRequest(id)}
            customClass='profileholder__buttons__round'
          />
        )

      case 'Pending':
        return (
          <Button
            text={t('pending')}
            icon={AllIcons.profile_pending}
            color='transparent'
            type='transparent--dark1px'
            font='mont-14-normal'
            width='fit'
            padding='2'
            height='3'
          />
        )

      case 'Friends':
        return (
          <Button
            text={<img src={AllIcons.profile_friend} alt={t('friends')} />}
            color='transparent'
            type='transparent--dark1px'
            height='3'
            customClass='profileholder__buttons__round'
          />
        )
    }
  }

  const renderPage = () => {
    switch (buttonsSwitcher()) {
      case 'model':
        //TODO
        const stories = []
        return stories.length ? (
          <StoriesList customClass='profileholder__nostories' page='profile' stories={[]} />
        ) : null

      case 'model-on-model':
        let showNotifications = false
        if (userData.id !== id && (isSubscribed || (friends_status !== 'Pending' && friends_status !== 'Not friend'))) {
          showNotifications = true
        }
        return (
          <div className='profileholder__buttons'>
            {showNotifications && (
              <div
                className='profileholder__buttons__circle'
                style={{ marginRight: '10px' }}
                onClick={() => notificationsModal()}
              >
                <img src={AllIcons.profile_notification} alt={t('Notifications')} />
              </div>
            )}
            {renderProfileInfoButton()}
            {buttonType(friends_status)}
          </div>
        )

      case 'fan-on-model':
        if (isSubscribed) {
          return (
            <div className='profileholder__buttons'>
              <div
                className='profileholder__buttons__circle'
                style={{ marginRight: '10px' }}
                onClick={() => notificationsModal()}
              >
                <img src={AllIcons.profile_notification} alt={t('Notifications')} />
              </div>
              {buttonType('subscribed')}
              {buttonType('tip')}
            </div>
          )
        } else {
          return (
            <div className='profileholder__buttons'>
              {Boolean(cardsList && cardsList.length === 0) ? buttonType('addCard') : buttonType('subscribe')}
            </div>
          )
        }

      case 'not-logged':
        return <div className='profileholder__buttons'>{buttonType('subscribe')}</div>

      default:
        return <div>Fallback page</div>
    }
  }

  const renderBubble = () => {
    switch (buttonsSwitcher()) {
      case 'model':
        return ''

      case 'model-on-model':
        if (((friends_status !== 'Pending' && friends_status !== 'Not friend') || isSubscribed) && userData.id !== id) {
          return (
            <Link to={`/chat/${id}`} className='profileholder-chat-link'>
              <div className='profileholder-chat-link-inner'>
                <spriteIcons.IconChatBubbleWhite />
              </div>
            </Link>
          )
        }
        break
      case 'not-logged':
      case 'fan-on-model': {
        if (isSubscribed) {
          return (
            <Link to={`/chat/${id}`} className='profileholder-chat-link'>
              <div className='profileholder-chat-link-inner'>
                <spriteIcons.IconChatBubbleWhite />
              </div>
            </Link>
          )
        }
        return null
      }

      default:
        return <div>Fallback bubble</div>
    }
  }

  const sendDelete = useMutation(
    (id: number) => {
      return deleteFriend(id)
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries('profile')
      }
    }
  )

  return (
    <>
      <div className='profileholder__info'>
        <p className={`profileholder__name`}>{display_name}</p>
        <div className='profileholder__username'>
          {show_likes_count && (
            <>
              <p className='profileholder__username--followers'>
                <span>{post_like_count}</span> {t('likes')}
              </p>
              <div className='profileholder__username--border'></div>
            </>
          )}
          {show_follower_count && (
            <>
              <p className='profileholder__username--followers'>
                <span>{follower_count}</span> {t('Fans')}
              </p>
              <div className='profileholder__username--border'></div>
            </>
          )}
          {show_friends_count && (
            <Link to={`/model/${id}/friends`} className={'profileholder__friends--link'}>
              <p className='profileholder__username--friends'>
                <span>{friend_count}</span> {t('friends')}
              </p>
              <div className='profileholder__username--border'></div>
            </Link>
          )}
          <p className='profileholder__username--name'>@{username}</p>
        </div>
        {mini_bio && show_mini_bio && (
          <p className='profileholder__quote'>
            <img src={Icons.quotes} alt='quotes' /> {mini_bio}
          </p>
        )}

        {renderPage()}
        {renderBubble()}
        {/* {
          process.env.NODE_ENV === 'development' &&
        <button onClick={() => sendDelete.mutate(id)}>delete</button>
        } */}
      </div>
    </>
  )
}

export default ProfileInfo
