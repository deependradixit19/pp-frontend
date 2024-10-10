import { Route, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ProtectedRoute from '../../routes/ProtectedRoute'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import GeneralSettings from './GeneralSettings'
import SubscriptionOptions from './pages/subscriptionOptions/SubscriptionOptions'
import SingleSetting from './features/SingleSetting'
import PayoutSettings from './features/singleSettingBody/Payout'
import PaymentMethod from './pages/paymentSettings/PaymentMethod'
import PaymentFrequency from './pages/paymentSettings/PaymentFrequency'
import PaymentList from './pages/paymentSettings/PaymentList'
import BankInformation from './pages/paymentSettings/BankInformation'
import Post from './features/singleSettingBody/Post'
import JustCheckboxCards from './layout/JustCheckboxCards'
import MiniBio from './features/singleSettingBody/MiniBio'
import Chat from './features/singleSettingBody/Chat'
import WelcomeMessage from './features/singleSettingBody/WelcomeMessage'
import LiveStream from './features/singleSettingBody/LiveStream'
import StorySettings from './features/singleSettingBody/StorySettings'
import EditLanguage from './pages/EditLanguage'
import AccountSettings from './AccountSettings'
import ChangeDisplayName from './pages/accountSettings/ChangeDisplayName'
import ChangeUsername from './pages/accountSettings/ChangeUsername'
import ChangeEmail from './pages/accountSettings/ChangeEmail'
import ChangePassword from './pages/accountSettings/ChangePassword'
import ChangePhone from './pages/accountSettings/ChangePhone'
import ConnectAnotherAccount from './pages/accountSettings/ConnectAnotherAccount'
import PrivacyAndSecurity from './view/PrivacyAndSecurity'
import LoginSessions from './pages/LoginSessions'
import TwoStepVerification from './pages/privacySettings/TwoStepVerification'
import AuthentificatorApp from './pages/privacySettings/AuthentificatorApp'
import BlockedUsers from './pages/privacySettings/BlockedUsers'
import GeoBlocking from './pages/privacySettings/GeoBlocking'
import Discovery from './pages/privacySettings/Discovery'
import NotificationSettings from './NotificationSettings'
import EditNotifications from './pages/EditNotifications'
import Wallet from './pages/paymentSettings/Wallet'
import Activity from './pages/Activity'
import SetSubscriptionPrice from './pages/subscriptionOptions/SetPrice/SetSubscriptionPrice'
import DiscountedBundles from './pages/subscriptionOptions/DiscountedBundles/DiscountedBundles'
import FreeTrial from './pages/subscriptionOptions/FreeTrial/FreeTrial'
import PromoCampaigns from './pages/subscriptionOptions/PromoCampaigns/PromoCampaigns'
import EditWelcomeMessage from './features/singleSettingBody/EditWelcomeMessage'
import UploadDocuments from './pages/paymentSettings/UploadDocuments'
import DesktopAdditionalContent from '../../features/DesktopAdditionalContent/DesktopAdditionalContent'

interface ISettingsRoute {
  path: string | { path: string; roles: string[]; props?: {}; exact?: boolean }[]
  Component: JSX.Element | JSX.Element[] | any
  roles?: string[]
  exact?: boolean
}

const useSettingsRoutes = (): ISettingsRoute[] => {
  const { t } = useTranslation()
  return [
    // GENERAL ↓
    {
      path: '/settings/general',
      Component: <GeneralSettings />,
      roles: ['fan', 'model'],
      exact: true
    },
    {
      path: '/settings/general/subscription-options',
      Component: <SubscriptionOptions />,
      roles: ['model'],
      exact: true
    },
    {
      path: '/settings/general/subscription-options/set-price',
      Component: <SetSubscriptionPrice />,
      roles: ['model']
    },
    {
      path: '/settings/general/subscription-options/discounted-bundles',
      Component: <DiscountedBundles />,
      roles: ['model']
    },
    {
      path: '/settings/general/subscription-options/promo-campaigns',
      Component: <PromoCampaigns />,
      roles: ['model']
    },
    {
      path: '/settings/general/subscription-options/free-trial-link',
      Component: <FreeTrial />,
      roles: ['model']
    },
    {
      path: [
        {
          path: '/settings/general/payout-settings',
          roles: ['model'],
          props: {
            section: t('general'),
            title: t('settings:payoutSettings'),
            withoutHeaderSwitch: true,
            withHeaderUnderline: true,
            body: <PayoutSettings />
          },
          exact: true
        },
        {
          path: '/settings/general/post-settings',
          roles: ['model'],
          props: {
            section: t('general'),
            title: t('settings:postSettings'),
            withoutHeaderSwitch: true,
            body: <Post />
          }
        },
        {
          path: '/settings/general/profile-settings/mini-bio',
          roles: ['model'],
          props: {
            section: t('settings:profileSettings'),
            title: t('miniBio'),
            body: <MiniBio />
          }
        },
        {
          path: '/settings/general/chat-settings',
          roles: ['model', 'fan'],
          props: {
            section: t('general'),
            title: t('settings:chatSettings'),
            body: <Chat />,
            withoutHeaderSwitch: true
          },
          exact: true
        },
        {
          path: '/settings/general/chat-settings/welcome-message',
          roles: ['model'],
          props: {
            section: t('settings:chatSettings'),
            title: t('welcomeMessage'),
            body: <WelcomeMessage />
          }
        },
        {
          path: '/settings/general/chat-settings/edit-welcome-message',
          roles: ['model'],
          props: {
            section: t('settings:chatSettings'),
            title: t('welcomeMessage'),
            body: <EditWelcomeMessage />
          }
        },
        {
          path: '/settings/general/live-stream',
          roles: ['model'],
          props: {
            section: t('general'),
            title: t('settings:liveStream'),
            body: <LiveStream page='cards' />
          },
          exact: true
        },
        {
          path: '/settings/general/live-stream/set-price',
          roles: ['model'],
          props: {
            section: t('settings:liveStreamSettings'),
            title: t('setPrice'),
            body: <LiveStream page='price' />
          }
        },
        {
          path: '/settings/general/story-settings',
          roles: ['model'],
          props: {
            section: t('general'),
            title: t('settings:storySettings'),
            body: <StorySettings page='story-settings-main' />,
            withoutHeaderSwitch: true
          },
          exact: true
        },
        {
          path: '/settings/general/story-settings/who-can-see',
          roles: ['model'],
          props: {
            section: t('settings:storySettings'),
            title: t('whoCanSee'),
            body: <StorySettings page='who-can-see' />
          }
        }
      ],
      Component: SingleSetting
    },
    {
      path: '/settings/general/payout-settings/payment-method',
      Component: <PaymentMethod />,
      roles: ['model'],
      exact: true
    },
    {
      path: [
        {
          path: '/settings/general/payout-settings/payment-method/wire',
          roles: ['model'],
          props: { page: 'wire' },
          exact: true
        }
      ],
      Component: PaymentList
    },
    {
      path: '/settings/general/payout-settings/payment-method/wire/bank-information',
      Component: <BankInformation />,
      roles: ['model']
    },
    {
      path: '/settings/general/payout-settings/payment-frequency',
      Component: <PaymentFrequency />,
      roles: ['model']
    },
    {
      path: '/settings/general/payout-settings/upload-documents',
      Component: <UploadDocuments />,
      roles: ['model']
    },
    {
      path: '/settings/general/profile-settings',
      Component: <JustCheckboxCards page='profile-settings' main={t('general')} />,
      roles: ['model'],
      exact: true
    },
    {
      path: '/settings/general/language',
      Component: <EditLanguage />,
      roles: ['model', 'fan']
    },
    {
      path: '/settings/general/wallet',
      Component: <Wallet />,
      roles: ['model', 'fan']
    },
    {
      path: '/settings/general/activity',
      Component: <Activity />,
      roles: ['model', 'fan']
    },

    // GENERAL ↑

    // ACCOUNT ↓

    {
      path: '/settings/account',
      Component: <AccountSettings />,
      roles: ['model', 'fan'],
      exact: true
    },
    {
      path: '/settings/account/change-display-name',
      Component: <ChangeDisplayName />,
      roles: ['model', 'fan']
    },
    {
      path: '/settings/account/change-username',
      Component: <ChangeUsername />,
      roles: ['model', 'fan']
    },
    {
      path: '/settings/account/change-email',
      Component: <ChangeEmail />,
      roles: ['model', 'fan']
    },
    {
      path: '/settings/account/change-password',
      Component: <ChangePassword />,
      roles: ['model', 'fan']
    },
    {
      path: '/settings/account/change-phone',
      Component: <ChangePhone />,
      roles: ['model', 'fan']
    },
    {
      path: '/settings/account/connect-another-account',
      Component: <ConnectAnotherAccount />,
      roles: ['model', 'fan']
    },
    {
      path: '/settings/account/connect-social-accounts',
      Component: <JustCheckboxCards main={t('account')} page='connect-social-accounts' />,
      roles: ['model', 'fan']
    },
    {
      path: '/settings/account/privacy-and-security',
      Component: <PrivacyAndSecurity />,
      roles: ['model', 'fan'],
      exact: true
    },
    {
      path: '/settings/account/privacy-and-security/login-sessions',
      Component: <LoginSessions />,
      roles: ['model', 'fan']
    },
    {
      path: '/settings/account/privacy-and-security/two-step-verification',
      Component: <TwoStepVerification />,
      roles: ['model', 'fan'],
      exact: true
    },
    {
      path: '/settings/account/privacy-and-security/two-step-verification/authentificator-app',
      Component: <AuthentificatorApp />,
      roles: ['model', 'fan']
    },
    {
      path: '/settings/account/privacy-and-security/blocked-users',
      Component: <BlockedUsers />,
      roles: ['model', 'fan']
    },
    {
      path: '/settings/account/privacy-and-security/geo-blocking',
      Component: <GeoBlocking />,
      roles: ['model', 'fan']
    },
    {
      path: '/settings/account/privacy-and-security/discovery-settings',
      Component: <Discovery />,
      roles: ['model', 'fan']
    },

    // ACCOUNT ↑

    // NOTIFICATIONS ↓
    {
      path: '/settings/notifications',
      Component: <NotificationSettings />,
      roles: ['model', 'fan'],
      exact: true
    },
    {
      path: [
        {
          path: '/settings/notifications/push-notifications',
          roles: ['model', 'fan'],
          props: { type: '?push-notifications' }
        },
        {
          path: '/settings/notifications/in-app-notifications',
          roles: ['model', 'fan'],
          props: { type: '?in-app-notifications' }
        },
        {
          path: '/settings/notifications/email-notifications',
          roles: ['model', 'fan'],
          props: { type: '?email-notifications' }
        },
        {
          path: '/settings/notifications/sms-notifications',
          roles: ['model', 'fan'],
          props: { type: '?sms-notifications' }
        }
      ],
      Component: EditNotifications
    }
  ]
}

export const useRenderSettingsRoutes = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const settingsRoutes = useSettingsRoutes()
  const { t } = useTranslation()
  const handleGoBack = () => {
    if (location.pathname.split('/').length === 3) {
      navigate('/menu')
    } else {
      const newLocation = location.pathname.slice(0, location.pathname.lastIndexOf('/'))
      navigate(newLocation)
    }
  }

  return settingsRoutes.map(({ path, Component, roles, exact }) =>
    typeof path !== 'object' && typeof path === 'string' ? (
      <Route
        path={path}
        key={path}
        element={
          <ProtectedRoute roles={roles ? roles : []}>
            <BasicLayout
              title={t('settings')}
              headerNav={['/settings/general', '/settings/account', '/settings/notifications']}
              customContentClass='settings__content__wrapper'
              handleGoBack={() => handleGoBack()}
            >
              {typeof Component === 'function' ? <Component /> : Component}
              <DesktopAdditionalContent />
            </BasicLayout>
          </ProtectedRoute>
        }
      />
    ) : (
      path.map(item => (
        <Route
          path={item.path}
          key={item.path}
          element={
            <ProtectedRoute roles={item.roles}>
              <BasicLayout
                title={t('settings')}
                headerNav={['/settings/general', '/settings/account', '/settings/notifications']}
                customContentClass='settings__content__wrapper'
                handleGoBack={() => handleGoBack()}
              >
                {typeof Component === 'function' ? (
                  item.props ? (
                    <Component {...item.props} />
                  ) : (
                    <Component />
                  )
                ) : (
                  Component
                )}
              </BasicLayout>
            </ProtectedRoute>
          }
        />
      ))
    )
  )
}
