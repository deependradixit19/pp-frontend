import { FC, useEffect, useState } from 'react'
import './_profile.scss'

import { useParams, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useQuery, useQueryClient, UseQueryResult } from 'react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { IProfile } from '../../types/interfaces/IProfile'
import { useUserContext } from '../../context/userContext'

import { getPerformer } from '../../services/endpoints/profile'

import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import ProfileHolder from './features/ProfileHolder/ProfileHolder'
import PostsFeed from '../../features/PostsFeed/PostsFeed'
import { getAccessToken } from '../../services/storage/storage'
import { useProfileFanSessionTracking } from '../../helpers/hooks'
import { addToast } from '../../components/Common/Toast/Toast'
import DesktopAdditionalContent from '../../features/DesktopAdditionalContent/DesktopAdditionalContent'

const Profile: FC = () => {
  const [verifyNavOpen, setVerifyNavOpen] = useState<boolean>(false)

  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false)

  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const userData = useUserContext()
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { data, isLoading, error }: UseQueryResult<IProfile, Error> = useQuery<IProfile, Error>(
    ['profile', id],
    () => getPerformer(id),
    {
      enabled: !!id,
      staleTime: 15 * 1000,
      onSettled: resp => {
        if (!resp) {
          addToast('error', t('modelDoesNotExist'))
          navigate('/404', { replace: true })
          return
        }

        if (resp?.role !== 'model') {
          addToast('error', t('modelDoesNotExist'))
          navigate('/404', { replace: true })
          return
        }
      }
    }
  )

  useProfileFanSessionTracking(parseInt(id ?? ''))

  useEffect(() => {
    if (error && (error as AxiosError)?.response?.status === 404) {
      addToast('error', t('modelDoesNotExist'))
      navigate('/404', { replace: true })
    }
  }, [error])

  useEffect(() => {
    if (
      !location.pathname.endsWith('all') &&
      !location.pathname.endsWith('video') &&
      !location.pathname.endsWith('photos')
    ) {
      navigate(`${location.pathname}/all`)
    }
    //eslint-disable-next-line
  }, [])

  const handleGoBack = () => {
    if (!!location.search) {
      navigate(location.pathname, { replace: true })
    } else {
      navigate('/')
    }
  }

  const refetchProfile = () => queryClient.invalidateQueries(['profile', id])

  const renderPostsFeed = () => {
    if (userData.role === 'model') {
      return (
        <PostsFeed
          feedNav={['all', 'videos', 'premium']}
          userId={parseInt(id ?? '')}
          user={data}
          verifyNavOpen={verifyNavOpen}
          setVerifyNavOpen={setVerifyNavOpen}
          setSubscribeModalOpen={setSubscribeModalOpen}
        />
      )
    } else if (userData.role === 'fan') {
      if (userData.id.toString() !== id) {
        return (
          <PostsFeed
            feedNav={['all', 'videos', 'premium']}
            userId={parseInt(id ?? '')}
            user={data}
            verifyNavOpen={verifyNavOpen}
            setVerifyNavOpen={setVerifyNavOpen}
            setSubscribeModalOpen={setSubscribeModalOpen}
          />
        )
      } else {
        return (
          <PostsFeed
            feedNav={['']}
            userId={parseInt(id ?? '')}
            isFan={true}
            user={data}
            verifyNavOpen={verifyNavOpen}
            setVerifyNavOpen={setVerifyNavOpen}
            setSubscribeModalOpen={setSubscribeModalOpen}
          />
        )
      }
    } else if (!getAccessToken()) {
      return (
        <PostsFeed
          feedNav={['all', 'premium']}
          userId={parseInt(id ?? '')}
          user={data}
          verifyNavOpen={verifyNavOpen}
          setVerifyNavOpen={setVerifyNavOpen}
          setSubscribeModalOpen={setSubscribeModalOpen}
        />
      )
    }
  }

  if (userData.role === 'fan' && userData.id === parseInt(id ?? '', 10)) {
    return <Navigate to='/' />
  }

  return (
    <BasicLayout
      title={t('profile')}
      handleGoBack={handleGoBack}
      verifyNavOpen={verifyNavOpen}
      setVerifyNavOpen={setVerifyNavOpen}
    >
      <div>
        {data && (
          <>
            <ProfileHolder
              id={data?.id}
              role={data?.role}
              online={data?.online_status}
              last_logged_at={data?.last_logged_at}
              cover={data?.cover.url || data?.cropped_cover.url}
              avatar={
                userData.id === data?.id
                  ? userData.cropped_avatar?.url || userData.avatar?.url
                  : data?.cropped_avatar?.url || data?.avatar?.url
              }
              display_name={data?.display_name}
              follower_count={data?.follower_count}
              friend_count={data?.friend_count}
              username={data?.username}
              show_stories={data?.show_stories}
              show_friend_button={data?.show_friend_button}
              isSubscribed={data?.isSubscribed}
              refetchProfileData={refetchProfile}
              photo_count={data?.photo_count}
              premium_video_count={data?.premium_video_count}
              video_count={data?.video_count}
              friends_status={data?.friends}
              mini_bio={data?.mini_bio}
              stories={data?.stories || []}
              subscribeModalOpen={subscribeModalOpen}
              setSubscribeModalOpen={setSubscribeModalOpen}
              show_follower_count={data?.show_follow_count}
              show_friends_count={data?.show_friend_list}
              show_likes_count={data?.show_like_count}
              show_mini_bio={data?.show_mini_bio}
              post_like_count={data?.post_like_count}
              show_online_status={data?.show_online_status}
              status={data?.status}
            />
            {renderPostsFeed()}
            {/* <div
            className="profile__setup"
            onClick={() => navigate("/account-setup")}
          >
            <img
              className="profile__setup__icon"
              src={AllIcons.shield_done}
              alt="Finish account setup"
            />

            <div className="profile__setup__text">
              <p className="profile__setup__text--top">
                Complete Account Setup
              </p>
              <p className="profile__setup__text--bot">
                Verify your account before posting
              </p>
            </div>
            <img src={AllIcons.three_arrows_right} alt="Go to account setup" />
          </div> */}
          </>
        )}
        {isLoading && <div>{t('loading')}</div>}
      </div>
      <DesktopAdditionalContent />
    </BasicLayout>
  )
}

export default Profile
