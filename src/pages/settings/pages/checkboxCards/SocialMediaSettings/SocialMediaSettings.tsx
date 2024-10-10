import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import { useQueryClient } from 'react-query'
import { AxiosError } from 'axios'
import { addToast } from '../../../../../components/Common/Toast/Toast'
import { GOOGLE_LOGIN_CLIENT_ID } from '../../../../../constants/constants'
import { useUserContext } from '../../../../../context/userContext'
import { Icons } from '../../../../../helpers/icons'
import {
  disconnectSocialMedia,
  getTwitterLoginLink,
  googleConnect,
  logoutUserAndRedirect,
  twitterConnect
} from '../../../../../services/endpoints/auth'
import MainSettingsPage from '../../../layout/MainSettingsPage'
import styles from './SocialMediaSettings.module.scss'

const resetPasswordRoute = '/auth/reset-password-email'

const SocialMediaSettings: FC = () => {
  const userData = useUserContext()
  const { t } = useTranslation()
  const [socialMediaState, setSocialMediaState] = useState<{
    twitter_connected: boolean
    google_connected: boolean
  }>({
    twitter_connected: !!userData.twitter,
    google_connected: !!userData.google
  })
  const [twitterUrl, setTwitterUrl] = useState<string>()
  const getTwitterLink = useCallback(async () => {
    return (await getTwitterLoginLink()).target_url
  }, [])
  const twtrPopup = useRef<Window | null>(null)
  const queryClient = useQueryClient()

  const twtrClosePopup = useCallback(async () => {
    twtrPopup.current?.close()
  }, [])

  useEffect(() => {
    setSocialMediaState({
      twitter_connected: !!userData.twitter,
      google_connected: !!userData.google
    })
  }, [userData])

  const onTwitterResult = useCallback(
    (msgEvent: any) => {
      const twitterErrorFn = (twitterError: AxiosError) => {
        twtrClosePopup()
        const error = twitterError
        console.error('Connecting Twitter account failed', error)
        if (error?.response?.data === 'This twitter account is already connected!') {
          addToast('error', t('error:alreadyConnectedTwitter'), 7000, true)
          return
        }
        addToast('error', t('error:errorWhileTryingToConnectTwitterAccount'), 7000, true)
      }

      const { twitterSuccess, twitterError, oauth_token, oauth_verifier } = msgEvent.data
      if (twitterSuccess) {
        twitterConnect({ oauth_token, oauth_verifier })
          .then(() => {
            twtrClosePopup()
            setSocialMediaState({
              ...socialMediaState,
              twitter_connected: true
            })
            addToast('success', t('twitterAccountConnectedSuccessfully'))
            queryClient.invalidateQueries('loggedProfile')
          })
          .catch(error => {
            twitterErrorFn(error)
          })
        return
      } else if (twitterError) {
        twitterErrorFn(twitterError)
      }
    },
    [queryClient, socialMediaState, t, twtrClosePopup]
  )

  useEffect(() => {
    window.addEventListener('message', onTwitterResult)

    return () => {
      window.removeEventListener('message', onTwitterResult)
    }
  }, [onTwitterResult])

  const twtrSignIn = useCallback(async () => {
    if (!twitterUrl) {
      const twitterLink = await getTwitterLink()
      setTwitterUrl(twitterLink)
      twtrPopup.current = window.open(twitterLink, 'twitter_popup', 'popup=true')
      return
    }
    twtrPopup.current = window.open(twitterUrl, 'twitter_popup', 'popup=true')
  }, [getTwitterLink, twitterUrl])

  // GOOGLE LOGIN
  const gglSignIn = useGoogleLogin({
    onSuccess: res => {
      googleConnect({ email: (res as any)?.profileObj?.email })
        .then(() => {
          setSocialMediaState({ ...socialMediaState, google_connected: true })
          addToast('success', t('googleAccountConnectedSuccessfully'))
          queryClient.invalidateQueries('loggedProfile')
        })
        .catch((err: AxiosError) => {
          console.error('Server Google connect failed', err)
          addToast('error', t('error:errorSomethingWentWrong'))
        })
    },
    onError: err => {
      console.error('Google login failed', err)
      addToast('error', t('error:errorSomethingWentWrong'))
    }
  })

  const disconnectSocialAccount = async (mediaName: string) => {
    const toastId = addToast('loading', t('disconnectingYourSocialMediaAccount'))
    const res = await disconnectSocialMedia(mediaName)
    toast.dismiss(toastId)

    if (res) {
      addToast('success', t('socialMediaAccountDisconnectedSuccessfully'))
      setSocialMediaState({
        ...socialMediaState,
        [`${mediaName}_connected`]: false
      })
      queryClient.invalidateQueries('loggedProfile')
    }
  }

  const passwordNeededAlert = () => {
    return toast(
      toast => (
        <span className='social__accounts__password__needed'>
          {t('youMustHaveAPasswordSetOnYourAccountBeforeYouCan')}
          <br />
          <button
            className='social__accounts__password__needed__btn'
            onClick={async () => {
              await logoutUserAndRedirect(resetPasswordRoute)
            }}
          >
            AAAA{t('clickHereTo')} <strong>{t('setYourPassword')}</strong>
          </button>
        </span>
      ),
      {
        duration: 10000,
        position: 'bottom-center'
      }
    )
  }

  const socialMediaCards = [
    {
      icon: Icons.twitter_small,
      body: t('twitter'),
      currentData: userData.twitter_nickname ? `@${userData.twitter_nickname}` : undefined,
      hasToggleWithText: true,
      toggleText: socialMediaState.twitter_connected ? t('conected') : t('connect'),
      toggleActive: socialMediaState.twitter_connected,
      toggleFn: () => {
        if (socialMediaState.twitter_connected) {
          if (socialMediaState.google_connected || userData.has_password) {
            // Disconnect
            disconnectSocialAccount('twitter')
            return
          }
          passwordNeededAlert()
        } else if (userData.email) {
          // Connect
          twtrSignIn()
        }
      },
      customClass: styles.socialCard
    },
    {
      icon: Icons.google,
      body: t('google'),
      hasToggleWithText: true,
      toggleText: socialMediaState.google_connected ? t('connected') : t('connect'),
      toggleActive: socialMediaState.google_connected,
      toggleFn: async () => {
        if (socialMediaState.google_connected) {
          if (socialMediaState.twitter_connected || userData.has_password) {
            // Disconnect
            disconnectSocialAccount('google')
            return
          }
          passwordNeededAlert()
        } else if (userData.email) {
          // Connect
          gglSignIn()
        }
      },
      customClass: styles.socialCard
    }
  ]

  return <MainSettingsPage settingsTop={socialMediaCards} />
}

export default SocialMediaSettings
