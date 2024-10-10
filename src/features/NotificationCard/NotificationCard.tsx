import { FC } from 'react'
import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'

import styles from './_NotificationCard.module.scss'

import { INotificationCard } from '../../types/interfaces/INotificationCard'
import TextWithIcon from '../../components/UI/NotificationToast/components/TextWithIcon'
import {
  IconNotificationPlayFill,
  IconNotificationChatFill,
  IconNotificationPhotoFill,
  IconAvatarDollar,
  IconLiveNotification,
  IconPrivateStream,
  IconImageOutline
} from '../../assets/svg/sprite'
import NotificationCardLayout from '../../layouts/NotificationCardLayout/NotificationCardLayout'
import {
  MODEL_SUBSCRIPTION_EXPIRED,
  NEW_ACCEPTED_FRIEND_REQUEST,
  NEW_COMMENT_COMMENT,
  NEW_COMMENT_LIKE,
  NEW_INCOMING_FRIEND_REQUEST,
  NEW_MENTION,
  NEW_MESSAGE,
  NEW_MESSAGE_PURCHASE,
  NEW_PHOTO_COMMENT,
  NEW_PHOTO_LIKE,
  NEW_POST,
  NEW_POST_COMMENT,
  NEW_POST_LIKE,
  NEW_PREMIUM_CONTENT_PURCHASE,
  NEW_PURCHASE_LIKE,
  NEW_REFERRAL,
  NEW_SUBSCRIBER,
  NEW_TIP,
  NEW_TIP_LIKE,
  NEW_UPCOMING_STREAM_REMINDER,
  NEW_VIDEO_COMMENT,
  NEW_VIDEO_LIKE,
  PAYOUT_METHOD_REJECTED,
  POST_FINISHED,
  PRIVATE_STREAM_REQUEST,
  STREAM_STARTED,
  SUBSCRIPTION_EXPIRED,
  SUBSCRIPTION_EXPIRING,
  SUBSCRIPTION_PRICE_CHANGE,
  SUSPICIOUS_LOGIN,
  TICKET_RESPONSE
} from '../../services/notifications/notificationTypes'
import { getLink } from '../../helpers/appLinks'
import NotificationToast from '../../components/UI/NotificationToast/NotificationToast'
import LikeHeart from '../../components/UI/LikeHeart/LikeHeart'
import { useUserContext } from '../../context/userContext'
import Button from '../../components/UI/Buttons/Button'
import { Icons } from '../../helpers/icons'
import { toFixedNumber } from '../../helpers/dataTransformations'
import SubscriptionExpiredNotifcation from '../../components/UI/Notifications/SubscriptionExpired/SubscriptionExpiredNotification'
import FriendRequestNotification from '../../components/UI/Notifications/FriendRequest/FriendRequestNotification'
import SubscriptionExpiringNotifcation from '../../components/UI/Notifications/SubscriptionExpiring/SubscriptionExpired/SubscriptionExpiringNotification'

const NotificationCard: FC<INotificationCard> = ({ data, type, time, isToast = false }) => {
  const { t } = useTranslation()
  const user = useUserContext()

  if (data) {
    data.sender = data?.sender ?? data?.liker ?? data?.subscriber ?? data?.commenter
    data.isToast = isToast
  }

  const specificNotification = (type: string, data: any) => {
    let newData = data
    const systemData = {
      ...data,
      isSystem: true,
      sender: {
        avatar: '/notifier.svg',
        name: 'Notifier'
      }
    }
    let content = null

    switch (type) {
      case PAYOUT_METHOD_REJECTED:
        newData = systemData
        content = (
          <div className='notificationCard__body__type'>
            <div className={`${styles.contentRow}`}>
              <Trans i18nKey={'notifications:payoutMethodRejected'}>rejected</Trans>
              <Button
                text={<img src={Icons.chevronRight} alt={t('toggleArrow')} />}
                color={'grey'}
                customClass={styles.arrowRightBtn}
                // todo: on click
              />
            </div>
          </div>
        )
        break
      case TICKET_RESPONSE:
        newData = systemData
        content = (
          <div className='notificationCard__body__type'>
            <Trans i18nKey={'notifications:ticketResponse'}>ticketResponse</Trans>
            <div className={`${styles.btnsRow}`}>
              <Button
                text={t('notifications:viewTicket')}
                width='fit'
                color={'blue'}
                padding='1-15'
                // todo:
                // onClick=
              />
            </div>
          </div>
        )
        break
      case SUSPICIOUS_LOGIN:
        newData = systemData
        content = (
          <div className='notificationCard__body__type'>
            <Trans i18nKey={'notifications:suspiciousLogin'}>
              Suspicious
              {/* todo attempt details link? */}
              <Link to={`/security/suspicious-login/${data?.suspiciousLogin?.id}`}>attempt</Link>
              you?
            </Trans>
            <div className={`${styles.contentRow} ${styles.btnsRow}`}>
              <Button
                text={t('notifications:wasMe')}
                color={'blue'}
                padding='1-15'
                // todo: onClick
              />
              <Button
                text={t('notifications:wasntMe')}
                color={'grey'}
                padding='1-15'
                // todo: onClick
              />
            </div>
          </div>
        )
        break
      case MODEL_SUBSCRIPTION_EXPIRED:
        content = (
          <div className='notificationCard__body__type'>
            <Trans i18nKey={'notifications:modelSubscriptionExpired'}>expired</Trans>
          </div>
        )
        break
      case SUBSCRIPTION_EXPIRED:
        content = (
          <div className='notificationCard__body__type'>
            <SubscriptionExpiredNotifcation data={data} />
          </div>
        )
        break
      case SUBSCRIPTION_EXPIRING:
        content = (
          <div className='notificationCard__body__type'>
            <SubscriptionExpiringNotifcation data={data} />
          </div>
        )
        break
      case NEW_VIDEO_LIKE:
        content = (
          <div className='notificationCard__body__type'>
            <TextWithIcon
              text={t('likedYour')}
              linkText={t(data?.is_plural ? 'videosLC' : 'video')}
              linkUrl={getLink.post(data?.likeable?.id)}
              icon={IconNotificationPlayFill}
            />
          </div>
        )
        break
      case NEW_COMMENT_LIKE:
        content = (
          <div className='notificationCard__body__type'>
            <TextWithIcon
              text={t('likedYour')}
              linkText={t('comment')}
              linkUrl={getLink.comment(data?.comment_post_id, data?.likeable?.id)}
              icon={IconNotificationChatFill}
            />
          </div>
        )
        break
      case NEW_TIP_LIKE:
        content = (
          <div className='notificationCard__body__type'>
            <TextWithIcon
              text={t('likedYour')}
              linkText={t('tipLC')}
              linkUrl={getLink.sales()}
              icon={IconNotificationChatFill}
            />
          </div>
        )
        break
      case NEW_PURCHASE_LIKE:
        content = (
          <div className='notificationCard__body__type'>
            <TextWithIcon
              text={t('likedYour')}
              linkText={t('purchase')}
              linkUrl={getLink.sales()}
              icon={IconAvatarDollar}
            />
          </div>
        )
        break
      case NEW_PHOTO_LIKE:
        content = (
          <div className='notificationCard__body__type'>
            <TextWithIcon
              text={t('likedYour')}
              linkText={t(data?.is_plural ? 'photosLC' : 'photo')}
              linkUrl={getLink.post(data?.likeable?.id)}
              icon={IconNotificationPhotoFill}
            />
          </div>
        )
        break
      case NEW_POST_LIKE:
        content = (
          <div className='notificationCard__body__type'>
            <TextWithIcon
              text={t('likedYour')}
              linkText={t('postLC')}
              linkUrl={getLink.post(data?.likeable?.id)}
              // icon={IconPrivateStream}
            />
          </div>
        )
        break
      case PRIVATE_STREAM_REQUEST:
        content = (
          <div className='notificationCard__body__type'>
            <Trans i18nKey={'notifications:privateStreamRequest'}>
              has
              <Link to={getLink.post(data?.post?.id)}>
                {
                  // todo: link
                }
                private stream
              </Link>
            </Trans>
            <span className={styles.textIcon}>
              <IconPrivateStream />
            </span>
          </div>
        )
        break
      case STREAM_STARTED:
        content = (
          <div className='notificationCard__body__type'>
            <Trans i18nKey={'notifications:hasStartedLiveStream'}>
              has
              <Link to={getLink.post(data?.post?.id)}>
                {
                  // todo: link
                }
                live stream
              </Link>
            </Trans>
            <span className={styles.textIcon}>
              <IconLiveNotification />
            </span>
          </div>
        )
        break
      case NEW_UPCOMING_STREAM_REMINDER:
        content = (
          <div className='notificationCard__body__type'>
            <Trans i18nKey={'notifications:upcomingStreamReminder'}>
              have
              <Link to={getLink.post(data?.post?.id)}>
                {
                  // todo: link
                }
                upcoming stream
              </Link>
            </Trans>
            <span className={styles.textIcon}>
              <IconPrivateStream />
            </span>
          </div>
        )
        break
      case NEW_MESSAGE:
        content = (
          <div className={styles.contentRow}>
            <div className='notificationCard__body__type'>
              <Link to={`/chat/${data?.sender.id}`}>
                {data?.message.body}

                {data?.message.body === '' &&
                  (data?.message.photos.length > 0 ||
                    data?.message.videos.length > 0 ||
                    data?.message.videos_preview.length > 0 ||
                    data?.message.sounds.length > 0) && (
                    <span className={styles.chatMediaNotificationText}>
                      {t('notifications:sentMessage')}
                      <IconImageOutline width='15' height='15' color='#2F98FE' />
                    </span>
                  )}
              </Link>
            </div>
          </div>
        )
        break
      case NEW_MESSAGE_PURCHASE:
        content = (
          <div className={styles.contentRow}>
            <div className='notificationCard__body__type'>
              <Trans i18nKey={'notifications:purchasedMessage'}>
                purchased
                <Link to={getLink.sales()}>message price: {toFixedNumber(data?.price || '')}</Link>
              </Trans>
            </div>
            <LikeHeart
              className={`${styles.notificationActions} ${styles.likeAction}`}
              isLiked={data?.is_liked}
              likeableType='notification'
              likeableId={data?.notification?.id}
            />
          </div>
        )
        break
      case NEW_TIP:
        content = (
          <div className={styles.contentRow}>
            <div className='notificationCard__body__type'>
              <span className={styles.contentText}>{`${t('notifications:hasTippedYouFor')} `}</span>
              <Link to={getLink.sales()}>
                {
                  // todo: some other link?
                }
                {`${toFixedNumber(data?.tip?.price)}$`}
              </Link>
              <span className={styles.textIcon}>
                <IconAvatarDollar />
              </span>
            </div>
            <LikeHeart
              className={`${styles.notificationActions} ${styles.likeAction}`}
              isLiked={data?.is_liked}
              likeableType='notification'
              likeableId={data?.notification?.id}
            />
          </div>
        )
        break
      //case NEW_SUBSCRIPTION_RENEWAL:
      //   content = (
      //     <div className="notificationCard__body__type">

      //     </div>
      //   );
      //   break;
      case NEW_INCOMING_FRIEND_REQUEST:
        content = (
          <div className='notificationCard__body__type'>
            <FriendRequestNotification data={data} />
          </div>
        )
        break
      case NEW_POST_COMMENT:
        content = (
          <div className='notificationCard__body__type'>
            <Trans i18nKey={'notifications:commentedContent'}>
              has
              <Link to={getLink.comment(data?.commentable?.id, data?.comment?.id)}>commented</Link>
              on {{ contentType: t('postLC') }}
            </Trans>
            <span className={styles.textIcon}>
              <IconNotificationChatFill />
            </span>
          </div>
        )
        break
      case NEW_VIDEO_COMMENT:
        content = (
          <div className='notificationCard__body__type'>
            <Trans i18nKey={'notifications:commentedContent'}>
              has
              <Link to={getLink.comment(data?.commentable?.id, data?.comment?.id)}>commented</Link>
              on {{ contentType: t(data?.is_plural ? 'videosLC' : 'video') }}
            </Trans>
            <span className={styles.textIcon}>
              <IconNotificationChatFill />
            </span>
          </div>
        )
        break
      case NEW_PHOTO_COMMENT:
        content = (
          <div className='notificationCard__body__type'>
            <Trans i18nKey={'notifications:commentedContent'}>
              has
              <Link to={getLink.comment(data?.commentable?.id, data?.comment?.id)}>commented</Link>
              on {{ contentType: t(data?.is_plural ? 'photosLC' : 'photo') }}
            </Trans>
            <span className={styles.textIcon}>
              <IconNotificationChatFill />
            </span>
          </div>
        )
        break
      case NEW_COMMENT_COMMENT:
        content = (
          <div className='notificationCard__body__type'>
            <Trans i18nKey={'notifications:commentReply'}>
              Has replied
              <Link to={getLink.comment(data?.comment_post_id, data?.comment?.id)}>comment</Link>
            </Trans>
            <span className={styles.textIcon}>
              <IconNotificationChatFill />
            </span>
          </div>
        )
        break
      case NEW_MENTION:
        content = (
          <div className='notificationCard__body__type'>
            {data?.mentionable?.type === 'App\\Models\\Post' ? (
              <Trans i18nKey={'notifications:mentionInPost'}>
                Mentioned
                <Link to={getLink.profile(user?.id)}>you</Link>
                in their
                <Link to={getLink.post(data?.mentionable?.id)}>post.</Link>
              </Trans>
            ) : (
              <Trans i18nKey={'notifications:mentionInComment'}>
                Mentioned
                <Link to={getLink.profile(user?.id)}>you</Link>
                in their
                <Link to={getLink.comment(data?.comment_post_id, data?.mentionable?.id)}>comment.</Link>
              </Trans>
            )}
            <span className={styles.textIcon}>
              <IconNotificationChatFill />
            </span>
          </div>
        )
        break
      case NEW_SUBSCRIBER:
        switch (data?.subscription_type) {
          case 'cost':
            content = (
              <div className='notificationCard__body__type'>
                <Trans i18nKey={'notifications:subscriptionWithCost'}>subscribed</Trans>
              </div>
            )
            break
          case 'free_trial':
            content = (
              <div className='notificationCard__body__type'>
                <Trans i18nKey={'notifications:subscriptionFreeTrial'}>subscribed</Trans>
              </div>
            )
            break
          case 'bundle':
          default:
            content = (
              <div className='notificationCard__body__type'>
                <Trans i18nKey={'notifications:subscriptionBundle'}>subscribed</Trans>
              </div>
            )
            break
        }
        content = (
          <div className='notificationCard__body__type'>
            <Trans i18nKey={'notifications:subscriptionBundle'}>subscribed</Trans>
          </div>
        )
        break
      case NEW_PREMIUM_CONTENT_PURCHASE:
        // todo: da li je samo post
        content = (
          <div className={styles.contentRow}>
            <div className='notificationCard__body__type'>
              <Trans i18nKey={'notifications:purchasedPremiumContent'}>
                Has purchased your
                <Link to={getLink.post(data?.post?.id)}>
                  premium content for price: {toFixedNumber(data?.post?.price)}
                </Link>
              </Trans>
              <span className={styles.textIcon}>
                <IconAvatarDollar />
              </span>
            </div>
            <LikeHeart
              className={`${styles.notificationActions} ${styles.likeAction}`}
              isLiked={data?.is_liked}
              likeableType='notification'
              likeableId={data?.notification?.id}
            />
          </div>
        )
        break
      case NEW_POST:
        content = (
          <div className='notificationCard__body__type'>
            <Trans i18nKey={'notifications:newPostText'}>
              NewPostText
              <Link to={getLink.post(data?.post?.id)}>new post</Link>
            </Trans>
          </div>
        )
        break
      case POST_FINISHED:
        newData = systemData
        content = (
          <div className='notificationCard__body__type'>
            <Trans i18nKey={'notifications:postFinishedProcessing'}>
              <Link to={getLink.post(data?.post)}>post</Link>
              postFinishedProcessing
            </Trans>
          </div>
        )
        break
      case SUBSCRIPTION_PRICE_CHANGE:
        newData = systemData
        content = (
          <div className='notificationCard__body__type'>
            <Trans i18nKey={'notifications:subscriptionPriceChange'}>
              {{ name: data?.sender?.name }} changed{' '}
              {{
                oldPrice: toFixedNumber(data?.subscription?.old_price)
              }}{' '}
              to{' '}
              {{
                newPrice: toFixedNumber(data?.subscription?.new_price)
              }}
            </Trans>
          </div>
        )
        break
      case NEW_REFERRAL:
        content = (
          <div className='notificationCard__body__type'>
            <Trans i18nKey={'notifications:newReferralText'}>
              have
              <Link to={getLink.profile(data?.sender?.id)}>referral</Link>
            </Trans>
          </div>
        )
        break
      case NEW_ACCEPTED_FRIEND_REQUEST:
        content = (
          <div className='notificationCard__body__type'>
            <Trans i18nKey={'notifications:hasAcceptedFriendRequest'}>accepted friend request</Trans>
          </div>
        )
        break
      //case NEW_POLL_RESPONSE:
      //     content = (
      //       <div className="notificationCard__body__type">
      //         <Trans i18nKey={'notifications:newReferralText'}>
      //           have
      //           <Link to={getLink.post(data?.post?.id)}>
      //             referral
      //           </Link>
      //         </Trans>
      //       </div>
      //     );
      //     break;
      // case NEW_TAGS:
      //   content = (
      //     <div className="notificationCard__body__type">
      //       <Trans i18nKey={'notifications:newReferralText'}>
      //         have
      //         <Link to={getLink.profile(data?.sender?.id)}>
      //           referral
      //         </Link>
      //       </Trans>
      //     </div>
      //   );
      //   break;
      // default: // todo remove
      //   return (
      //     <div className="notificationCard__body__type">
      //       {type}
      //     </div>
      //   );
    }

    return content
      ? {
          data: newData,
          content
        }
      : null
  }

  const specific = specificNotification(type, data)

  if (!specific) {
    return null
  }

  return isToast ? (
    <NotificationToast
      notificationId={specific?.data?.notification?.id}
      avatarSrc={
        typeof specific?.data?.sender?.avatar === 'string'
          ? specific?.data?.sender?.avatar
          : specific?.data?.sender?.avatar.url
      }
      isOnline={specific?.data?.is_online}
      hasDollar={specific?.data?.sender?.dollar}
      name={specific?.data?.sender?.name}
      atName={specific?.data?.sender?.username}
      profileUrl={specific?.data?.sender?.id ? getLink.profile(specific.data.sender.id) : undefined}
      isSystem={specific?.data?.isSystem}
      time={time}
    >
      {specific.content}
    </NotificationToast>
  ) : (
    <NotificationCardLayout
      avatarSrc={specific?.data?.sender?.avatar}
      isOnline={specific?.data?.is_online}
      hasDollar={specific?.data?.sender?.dollar}
      name={specific?.data?.sender?.name}
      atName={specific?.data?.sender?.username}
      profileUrl={specific?.data?.sender?.id ? getLink.profile(specific.data.sender.id) : undefined}
      time={time}
      isSystem={specific?.data?.isSystem}
    >
      {specific.content}
    </NotificationCardLayout>
  )
}

export default NotificationCard
