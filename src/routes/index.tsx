import { useEffect, FC } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useQuery, UseQueryResult } from 'react-query'
import { useTranslation } from 'react-i18next'
import { useUserContext } from '../context/userContext'

import { getAccessToken, removeAccessToken } from '../services/storage/storage'
import { getProfile } from '../services/endpoints/profile'

import { IProfile } from '../types/interfaces/IProfile'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import Profile from '../pages/profile/Profile'
import TermsAndConditions from '../pages/termsAndConditions/TermsAndConditions'
import Auth from '../pages/auth/Auth'
import Creators from '../pages/creators/Creators'
import { useLoadingContext } from '../context/loadingContext'
import AccountSetup from '../pages/accountSetup/AccountSetup'
import Support from '../pages/support/Support'
import Earnings from '../pages/earnings/Earnings'
import Analytics from '../pages/analytics/Analytics'
import Fans from '../pages/fans/Fans'
import Friends from '../pages/friends/Friends'
import GroupMessage from '../pages/groupMessage/GroupMessage'
import HowTo from '../pages/howTo/HowTo'
import Menu from '../pages/newmenu/Menu'
import Inbox from '../pages/messaging/Inbox/Inbox'
import NewPost from '../pages/newPost/NewPost'
import EditPost from '../pages/newPost/EditPost'
import Notifications from '../pages/notifications/Notifications'
import SocialTrades from '../pages/socialTrades/SocialTrades'
import SubscriptionsLists from '../pages/subscriptions/SubscriptionsList'
import Subscriptions from '../pages/subscriptions/Subscriptions'
import Fcc from '../pages/forCustomComponents/Fcc'
import Vault from '../pages/vault/Vault'
import Live from '../pages/live/Live'
import Watch from '../pages/watch/Watch'
import Feed from '../pages/feed/Feed'
import Transactions from '../pages/transactions/Transactions'
import MediaCategories from '../pages/mediaCategories/MediaCategories'
import NotFound from '../pages/404'
import { useNotificationContext } from '../context/notificationContext'
import { useRenderSettingsRoutes } from '../pages/settings/settingsRoutes'
import NewStory from '../pages/story/NewStory'
import StoryPreview from '../pages/storyPreview/StoryPreview'
import VerifyEmail from '../pages/verifyEmail/VerifyEmail'
import PublicFriends from '../pages/publicFriends/PublicFriends'
import TwitterLogin from '../pages/auth/view/TwitterLogin'
import NewMessage from '../pages/messaging/NewMessage/NewMessage'
import { setDateTimeLocale } from '../lib/dayjs'
import UserActivity from '../pages/userActivity/UserActivity'
import Post from '../pages/post/Post'
import Media from '../pages/media/Media'
import WatchHistory from '../pages/watchHistory/WatchHistory'
import Purchases from '../pages/purchases/Purchases'
import LikesHistory from '../pages/likesHistory/LikesHistory'
import FreeTrialPage from '../pages/FreeTrialPage/FreeTrialPage'
import Conversation from '../pages/messaging/conversation/Conversation'
import Playlists from '../pages/playlists/Playlists'
import SchedulePage from '../pages/schedule/SchedulePage/SchedulePage'
import EditStory from '../pages/editStory/EditStory'
import StreamsArchive from '../pages/StreamsArchive/StreamsArchive'
import MediaPlaylists from '../pages/mediaPlaylists/MediaPlaylists'

interface Props {}
const Router: FC<Props> = () => {
  const userData = useUserContext()
  const navigate = useNavigate()
  const loadingContext = useLoadingContext()
  const token = getAccessToken()
  const isAuthenticated = !!token
  const notificationsContext = useNotificationContext()
  const { i18n } = useTranslation()

  const { data, error, isLoading }: UseQueryResult<IProfile, Error> = useQuery<IProfile, Error>(
    'loggedProfile',
    () => getProfile(),
    {
      refetchOnWindowFocus: false,
      retry: false,
      enabled: isAuthenticated
    }
  )

  useEffect(() => {
    if (data) {
      userData.setUser(data)
      i18n.changeLanguage(data.language.code.toLowerCase())
      setDateTimeLocale(data.language.code.toLowerCase())
      userData.setUserLoading(isLoading)
      loadingContext.handleGlobalLoading(isLoading)
    }
    //@ts-ignore
    if (error?.response?.status === 401) {
      removeAccessToken()
      navigate('/')
      loadingContext.handleGlobalLoading(false)
    }
    //eslint-disable-next-line
  }, [data, error, isLoading])

  useEffect(() => {
    if (token) {
      notificationsContext.setToken(token)
    }
  }, [token])

  const settingsRoutes = useRenderSettingsRoutes()

  return (
    <Routes>
      {settingsRoutes}
      <Route path='/profile/:id/:feed' element={<Profile />} />
      <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
      <Route
        path={'/auth'}
        element={
          <PublicRoute path={'/auth'}>
            <Auth />
          </PublicRoute>
        }
      />
      <Route path={'/auth/login-twitter'} element={<TwitterLogin />} />
      <Route
        path={'/auth/:type'}
        element={
          <PublicRoute path={'/auth/:type'}>
            <Auth />
          </PublicRoute>
        }
      />
      <Route
        path={'/account-setup'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <AccountSetup />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/support/:id'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <Support />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/chat/:id'}
        element={
          <ProtectedRoute roles={['model', 'fan']}>
            <Conversation />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/earnings/:id'}
        element={
          <ProtectedRoute roles={['model']}>
            <Earnings />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/analytics/:id'}
        element={
          <ProtectedRoute roles={['model']}>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/fans'}
        element={
          <ProtectedRoute roles={['model']}>
            <Fans displayPage='home' />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/fans/:id'}
        element={
          <ProtectedRoute roles={['model']}>
            <Fans displayPage='group' />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/friends'}
        element={
          <ProtectedRoute roles={['model']}>
            <Friends />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/streams-library'}
        element={
          <ProtectedRoute roles={['model']}>
            <StreamsArchive />
          </ProtectedRoute>
        }
      />
      <Route path={'/model/:modelId/friends'} element={<PublicFriends />} />
      <Route
        path={'/new/message/:id'}
        element={
          <ProtectedRoute roles={['model']}>
            <GroupMessage />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/how-to/:id?'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <HowTo />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/menu'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <Menu />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/messages/new'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <NewMessage />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/messages/inbox'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <Inbox />
          </ProtectedRoute>
        }
      />
      <Route path={'/post/:id'} element={<Post />} />
      <Route
        path={'/new/post/create'}
        element={
          <ProtectedRoute roles={['model']}>
            <NewPost />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/edit/post/:id'}
        element={
          <ProtectedRoute roles={['model']}>
            <EditPost />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/new/story'}
        element={
          <ProtectedRoute roles={['model']}>
            <NewStory />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/edit/story/:id'}
        element={
          <ProtectedRoute roles={['model']}>
            <EditStory />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/view/story'}
        element={
          <ProtectedRoute roles={['model', 'fan']}>
            <StoryPreview />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/notifications'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/social-trade'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <SocialTrades />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/subscriptions/lists'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <SubscriptionsLists />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/subscriptions/:type?'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <Subscriptions />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/fcc'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <Fcc />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/vault'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <Vault />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/vault/:id'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <Vault />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/live'}
        element={
          <ProtectedRoute roles={['model']}>
            <Live />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/watch/:id'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <Watch />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/creators'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <Creators />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/transactions'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <Transactions />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/media'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <Media />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/media_categories'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <MediaCategories />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/watch-history'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <WatchHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/purchases'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <Purchases />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/likes'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <LikesHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/playlists'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <Playlists />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/playlists/:id'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <MediaPlaylists />
          </ProtectedRoute>
        }
      />
      <Route
        path={'/'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <Feed />
          </ProtectedRoute>
        }
      />

      <Route
        path={'/email/verify/:userId/:token'}
        element={
          <ProtectedRoute roles={['fan', 'model']}>
            <VerifyEmail />
          </ProtectedRoute>
        }
      />

      <Route
        path={'/user-activity/:id'}
        element={
          <ProtectedRoute roles={['model']}>
            <UserActivity />
          </ProtectedRoute>
        }
      />

      <Route
        path={'/trial-link/:id'}
        element={
          <ProtectedRoute roles={['model', 'fan']}>
            <FreeTrialPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={'/schedule'}
        element={
          <ProtectedRoute roles={['model']}>
            <SchedulePage />
          </ProtectedRoute>
        }
      />

      <Route path={'*'} element={<NotFound />} />
    </Routes>
  )
}

export default Router
