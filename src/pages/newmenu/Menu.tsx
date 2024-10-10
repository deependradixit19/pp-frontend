import { FC, useState } from 'react'
import './_menu.scss'
import { useNavigate } from 'react-router-dom'
import { useQuery, UseQueryResult } from 'react-query'
import { useTranslation } from 'react-i18next'
import { logoutUser } from '../../services/endpoints/auth'

import { getPendingStats } from '../../services/endpoints/api_global'

import { useModalContext } from '../../context/modalContext'
import { useUserContext } from '../../context/userContext'

import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'
import MenuProfileHolder from './components/MenuProfileHolder'
import ConfirmModal from '../../components/UI/Modal/Confirm/ConfirmModal'
import ActionCard from '../../features/ActionCard/ActionCard'
import CreatorVerification from '../creatorVerification/CreatorVerification'
import * as spriteIcons from '../../assets/svg/sprite'
import DesktopAdditionalContent from '../../features/DesktopAdditionalContent/DesktopAdditionalContent'

const Menu: FC = () => {
  const [showMore, setShowMore] = useState<boolean>(false)
  const [showVerificationPortal, setShowVerificationPortal] = useState(false)

  const navigate = useNavigate()
  const userData = useUserContext()
  const modalData = useModalContext()
  const { t } = useTranslation()

  const { data, error }: UseQueryResult<{ [key: string]: number }> = useQuery('pendingStats', getPendingStats, {
    refetchInterval: 30 * 1000
  })

  const handleCloseVerifyPortal = () => {
    const portal = document.getElementById('portal')
    if (!portal) return null
    portal.classList.contains('portal--open') && portal.classList.remove('portal--open')
    showVerificationPortal && setShowVerificationPortal(false)
  }

  const menuCards = [
    {
      icon: <spriteIcons.IconNoteCurvy />,
      body: t('following'),
      link: userData.role === 'model' ? '/' : `/profile/${userData.id}/all`,
      absfix: true
    },
    {
      icon: <spriteIcons.IconSearchBlue />,
      body: t('browseCreators'),
      link: `/creators`,
      absfix: true
    },
    {
      icon: <spriteIcons.IconDollarCircleNoFill />,
      body: t('earnings'),
      link: `/earnings/sales`,
      absfix: true
    },
    {
      icon: <spriteIcons.IconAnalytics />,
      body: t('analytics'),
      link: '/analytics/sales',
      absfix: true
    },
    {
      icon: <spriteIcons.IconCalendarLarge />,
      body: t('schedule'),
      link: '/schedule',
      absfix: true
    },
    {
      icon: <spriteIcons.IconThreePeople />,
      body: t('Fans'),
      link: '/fans',
      absfix: true
    },
    {
      icon: <spriteIcons.IconPeopleHeart />,
      body: t('friends'),
      link: '/friends',
      absfix: true,
      pendingNumber: data?.friend_requests
    },
    {
      icon: <spriteIcons.IconPictureSymbol />,
      body: t('sharedMedia'),
      link: `/vault`,
      absfix: true
    },
    {
      icon: <spriteIcons.IconMediaFolder2 />,
      body: t('mediaCategories'),
      link: `/media_categories`,
      absfix: true
    },
    {
      icon: <spriteIcons.IconMediaFolder />,
      body: t('media'),
      link: `/media`,
      absfix: true
    },
    {
      icon: <spriteIcons.IconTwoPeople />,
      body: 'Subscriptions',
      link: `/subscriptions`,
      absfix: true
    },
    {
      icon: <spriteIcons.IconSettings />,
      body: t('settings'),
      link: '/settings/general',
      absfix: true
    },
    {
      icon: <spriteIcons.IconLiveStream />,
      body: t('liveStreaming'),
      link: '#',
      absfix: true
    },
    // {
    //   icon: <spriteIcons.IconManCircleDots />,
    //   body: t('referrals'),
    //   link: '/referrals/summary',
    // },
    {
      icon: <spriteIcons.IconCreditCards />,
      body: (
        <span>
          {t('yourCards')} <span className='menu-option-subtxt'>({t('toSubscribe')})</span>
        </span>
      ),
      link: '/settings/general/wallet',
      absfix: true
    },
    {
      icon: <spriteIcons.IconDollarCircleArrows />,
      body: t('transactions'),
      link: '/transactions',
      absfix: true
    },
    {
      icon: <spriteIcons.IconHowToBook />,
      body: t('howToTutorials'),
      link: '/how-to/tutorials',
      absfix: true
    },
    {
      icon: <spriteIcons.IconManHeadphones />,
      body: t('support'),
      link: '/support/home',
      absfix: true
    }
  ]

  const userMenuCards = [
    {
      icon: <spriteIcons.IconNoteCurvy />,
      body: t('feed'),
      link: `/`,
      absfix: true
    },
    {
      icon: <spriteIcons.IconSearchBlue />,
      body: t('browseCreators'),
      link: `/creators`,
      absfix: true
    },
    {
      icon: <spriteIcons.IconMediaFolder2 />,
      body: t('media'),
      link: `/media`,
      absfix: true
    },
    {
      icon: <spriteIcons.IconTwoPeople />,
      body: t('subscriptions'),
      link: `/subscriptions`,
      absfix: true
    },
    {
      icon: <spriteIcons.IconDollarCircleArrows />,
      body: t('transactions'),
      link: '/transactions',
      absfix: true
    },
    {
      icon: <spriteIcons.IconSettings />,
      body: t('settings'),
      link: '/settings/general',
      absfix: true
    },
    {
      icon: <spriteIcons.IconCreditCards />,
      body: (
        <span>
          {t('yourCards')} <span className='menu-option-subtxt'>({t('toSubscribe')})</span>
        </span>
      ),
      link: '/settings/general/wallet',
      absfix: true
    },
    {
      icon: <spriteIcons.IconBecomeCreator />,
      body: t('becomeACreator'),
      absfix: true,
      fn: () => {
        !showVerificationPortal && setShowVerificationPortal(true)
        // return createPortal(
        //   <CreatorVerification
        //     initialStep={userData.model_verification_step}
        //   />,
        //   portal
        // );
      }
    },
    {
      icon: <spriteIcons.IconHowToBook />,
      body: t('howToFaq'),
      link: '/how-to/tutorials',
      absfix: true
    },
    {
      icon: <spriteIcons.IconManHeadphones />,
      body: t('support'),
      link: '/support/home',
      absfix: true
    }
  ]

  if (showVerificationPortal) {
    return <CreatorVerification initialStep={userData.model_verification_step} closeFn={handleCloseVerifyPortal} />
  }
  return (
    <BasicLayout title={t('menu')} customContentClass='menu__content__wrapper' handleGoBack={() => navigate('/')}>
      <WithHeaderSection
        headerSection={
          <MenuProfileHolder
            id={userData?.id}
            profileImg={userData?.cropped_avatar?.url || userData?.avatar?.url || ''}
            display_name={userData?.display_name}
            role={userData?.role}
            follower_count={userData?.follower_count}
            friend_count={userData?.friend_count}
            following_count={userData?.following_count || 123}
            wallet_deposit={userData?.wallet_deposit || 422}
            username={userData?.username}
          />
        }
        customClass='menu__header'
      >
        <div className='menu'>
          {userData?.role === 'model' ? (
            <>
              {menuCards.map(
                (
                  card: {
                    icon: string | JSX.Element | JSX.Element[]
                    body: string | JSX.Element | JSX.Element[]
                    absfix?: boolean
                    link: string
                    pendingNumber?: number
                  },
                  key: number
                ) =>
                  key < 10 ? (
                    <ActionCard
                      icon={card.icon}
                      text={card.body}
                      absFix={card.absfix}
                      link={card.link}
                      key={key}
                      hasArrow={true}
                      pendingNumber={card.pendingNumber}
                    />
                  ) : (
                    showMore &&
                    key >= 10 && (
                      <ActionCard
                        icon={card.icon}
                        text={card.body}
                        absFix={card.absfix}
                        link={card.link}
                        key={key}
                        hasArrow={true}
                        pendingNumber={card.pendingNumber}
                      />
                    )
                  )
              )}
              {!showMore && (
                <ActionCard
                  icon={<spriteIcons.IconThreeDotsCircle />}
                  text={t('more')}
                  clickFn={() => setShowMore(true)}
                />
              )}
            </>
          ) : (
            userMenuCards.map(
              (
                card: {
                  icon: string | JSX.Element | JSX.Element[]
                  body: string | JSX.Element | JSX.Element[]
                  absfix?: boolean
                  link?: string
                  fn?: () => void
                },
                key: number
              ) => {
                if (card.link) {
                  return (
                    <ActionCard
                      icon={card.icon}
                      text={card.body}
                      absFix={card.absfix}
                      link={card.link}
                      key={key}
                      hasArrow={true}
                    />
                  )
                }
                if (card.fn) {
                  return (
                    <ActionCard
                      icon={card.icon}
                      text={card.body}
                      absFix={card.absfix}
                      clickFn={card.fn}
                      key={key}
                      hasArrow={true}
                    />
                  )
                }
              }
            )
          )}

          <hr className='menu__break' />
          <ActionCard
            icon={<spriteIcons.IconLogOut />}
            text={t('logOut')}
            clickFn={() =>
              modalData.addModal(`${t('logOut')}?`, <ConfirmModal confirmFn={() => logoutUser(navigate)} />)
            }
          />
        </div>
      </WithHeaderSection>
      <DesktopAdditionalContent />
    </BasicLayout>
  )
}

export default Menu
