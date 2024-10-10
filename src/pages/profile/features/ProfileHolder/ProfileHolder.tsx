import { FC, useCallback, useEffect, useState } from 'react'
import './_profileHolder.scss'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import { AllIcons } from '../../../../helpers/allIcons'
import { Icons } from '../../../../helpers/icons'
import { IProfileHolder } from '../../../../types/interfaces/IProfileHolder'
import { useUserContext } from '../../../../context/userContext'
import { useModalContext } from '../../../../context/modalContext'
import { subscribeToUser } from '../../../../services/endpoints/profile'

import ProfileCover from './components/ProfileCover'
import ProfileInfo from './components/ProfileInfo'
import ImgInCircle from '../../../../components/UI/ImgInCircle/ImgInCircle'
import ProfileImageModal from '../../../../components/UI/Modal/ProfileImage/ProfileImageModal'
import FriendRequestModal from '../../../../components/UI/Modal/FriendRequest/FriendRequestModal'
import ModalWrapper from '../../../../features/ModalWrapper/ModalWrapper'
import SubscribeProfileModal from '../../../../components/UI/Modal/profileModals/SubscribeProfileModal/SubscribeProfileModal'
import UnsubscribeProfileModal from '../../../../components/UI/Modal/profileModals/UnsubscribeProfileModal/UnsubscribeProfileModal'
import StoriesList, { IStoriesListElement } from '../../../../features/StoriesList/StoriesList'
import { addToast } from '../../../../components/Common/Toast/Toast'
import { ISubscribePayload } from '../../../../types/interfaces/ITypes'
import { getAllStories } from '../../../../services/endpoints/story'

const ProfileHolder: FC<IProfileHolder> = ({
  id,
  online,
  role,
  last_logged_at,
  cover,
  avatar,
  display_name,
  follower_count,
  friend_count,
  username,
  show_stories,
  show_friend_button,
  refetchProfileData,
  isSubscribed,
  photo_count,
  premium_video_count,
  video_count,
  friends_status,
  hideCount,
  mini_bio,
  stories,
  subscribeModalOpen,
  setSubscribeModalOpen,
  show_follower_count,
  show_friends_count,
  show_likes_count,
  show_mini_bio,
  post_like_count,
  show_online_status,
  status
}) => {
  const userData = useUserContext()
  const modalData = useModalContext()
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const [selectedSubscriptionPlan, setSelectedSubscriptionPLan] = useState<number | string>(1)

  const [campaign, setCampaign] = useState<number | null>(null)
  const [reorderedStories, setReorderedStories] = useState<IStoriesListElement[]>([])

  const { data: usersWithStories } = useQuery(['allStoryPosts'], () => getAllStories())

  useEffect(() => {
    usersWithStories && setReorderedStories(reorderStories())
  }, [usersWithStories])

  // const reorderedStories = useMemo(() => reorderStories(), usersWithStories);

  function reorderStories(): IStoriesListElement[] {
    let tempStories: IStoriesListElement[] = []
    let tempUnseenStories: IStoriesListElement[] = []

    if (usersWithStories && usersWithStories.length) {
      usersWithStories.map((user: IStoriesListElement) => {
        if (user.all_stories_seen) {
          tempUnseenStories.push(user)
        } else {
          tempStories.push(user)
        }
      })
    }
    return [...tempStories, ...tempUnseenStories]
  }

  const changeAvatar = () =>
    modalData.addModal(t('profilePhoto'), <ProfileImageModal />, undefined, false, 'profile__photo__modal')
  const changeCover = () => modalData.addModal(t('coverImage'), <ProfileImageModal isCover={true} />)

  const sendRequest = () =>
    modalData.addModal(
      t('FriendRequest'),
      <FriendRequestModal
        id={id}
        online={online && show_online_status ? true : false}
        avatar={avatar}
        display_name={display_name}
        username={username}
        follower_count={follower_count}
        friend_count={friend_count}
        close={() => modalData.clearModal()}
      />
    )

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
      refetchProfileData()
      queryClient.invalidateQueries(['getFeed', id])
      setSubscribeModalOpen(false)
      queryClient.invalidateQueries(['allSubsPlans', id])
      if (resp.status) {
        if (resp.is_subscribed) {
          addToast('success', t('successfullySubscribed'))
        } else {
          addToast('success', t('successfullyUnsubscribed'))
        }
      } else {
        if (resp.message) {
          addToast('success', resp.message)
        }
        if (resp.error) {
          addToast('error', resp.error)
          setSubscribeModalOpen(false)
        }
      }
    },
    onError: () => {
      refetchProfileData()
      setSubscribeModalOpen(false)
      addToast('error', t('error:anErrorOccuredPleaseTryAgain'))
    }
  })

  const handleSetSelectedSubscriptionPlan = useCallback((planId: number) => {
    setSelectedSubscriptionPLan(planId)
  }, [])

  return (
    <>
      <ProfileCover
        cover={cover}
        photo_count={photo_count}
        premium_video_count={premium_video_count}
        video_count={video_count}
        hideCount={hideCount}
      />
      <div className='profileholder profileholder__profile'>
        <ImgInCircle
          id={id}
          type='profile'
          hasLoader={true}
          hasCamera={true}
          cameraFn={changeAvatar}
          isLive={show_online_status && online ? true : false}
        >
          {avatar ? (
            <img src={avatar || ''} alt={t('profileAvatar')} />
          ) : (
            <div className='profileholder__profile__placeholder'>
              <img src={AllIcons.user_placeholder} alt='Placeholder' />
            </div>
          )}
        </ImgInCircle>
        {id === userData.id ? (
          <div className='iic__camera iic__camera__cover' onClick={() => changeCover()}>
            <img src={Icons.camera} alt={t('changeCover')} />
          </div>
        ) : (
          ''
        )}
        <ProfileInfo
          id={id}
          role={role}
          display_name={display_name}
          follower_count={follower_count}
          friend_count={friend_count}
          username={username}
          show_stories={show_stories}
          show_friend_button={show_friend_button}
          isSubscribed={isSubscribed}
          friendRequest={sendRequest}
          avatar={avatar || AllIcons.user_placeholder}
          friends_status={friends_status}
          setSubscribeModalOpen={setSubscribeModalOpen}
          mini_bio={mini_bio || ''}
          show_likes_count={show_likes_count}
          show_friends_count={show_friends_count}
          show_follower_count={show_follower_count}
          show_mini_bio={show_mini_bio}
          post_like_count={post_like_count}
          setPlanId={handleSetSelectedSubscriptionPlan}
          setCampaign={setCampaign}
        />
        {(isSubscribed || id === userData.id) && reorderedStories && (
          <StoriesList stories={reorderedStories} page='profile' />
        )}
      </div>

      <ModalWrapper
        open={subscribeModalOpen}
        setOpen={setSubscribeModalOpen}
        customClass='subscribe-profile-modal-modal'
        hasCloseButton={isSubscribed ? false : true}
      >
        {isSubscribed ? (
          <UnsubscribeProfileModal
            avatar={avatar}
            displayName={display_name}
            username={username}
            subscribeFn={() => {
              if (status !== 'active') {
                addToast('error', t('inactiveSubscribe'))
                return
              }
              subscribeMutation.mutate()
            }}
            isLoading={subscribeMutation.isLoading}
            setOpen={setSubscribeModalOpen}
          />
        ) : (
          <SubscribeProfileModal
            displayName={display_name}
            avatar={avatar}
            username={username}
            id={id}
            subscribeFn={() => {
              if (status !== 'active') {
                addToast('error', t('inactiveSubscribe'))
                return
              }
              subscribeMutation.mutate()
            }}
            isLoading={subscribeMutation.isLoading}
            selected={selectedSubscriptionPlan}
            setSelected={handleSetSelectedSubscriptionPlan}
            campaign={campaign}
            setCampaign={setCampaign}
          />
        )}
      </ModalWrapper>
    </>
  )
}

export default ProfileHolder
