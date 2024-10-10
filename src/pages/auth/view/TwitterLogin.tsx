import { FC, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Trans, useTranslation } from 'react-i18next'
import { twitterApiCallback } from '../../../services/endpoints/auth'
import { setAccessToken } from '../../../services/storage/storage'
import { addToast } from '../../../components/Common/Toast/Toast'
import { useLoadingContext } from '../../../context/loadingContext'
import { destroyCookie, getCookie } from '../../../services/cookies/cookies'

const TwitterLogin: FC<{}> = () => {
  const { handleGlobalLoading } = useLoadingContext()
  const { t } = useTranslation()

  useEffect(() => {
    const loginUser = async () => {
      const { oauth_token, oauth_verifier } = Object.fromEntries(new URLSearchParams(window.location.search).entries())
      // Oauth Step 3: callback backend and login user
      console.log('login user', { oauth_token, oauth_verifier })
      if (oauth_token && oauth_verifier) {
        try {
          handleGlobalLoading(true)
          await toast.dismiss()
          addToast('loading', () => (
            <Trans i18nKey='multilineLoginWithTwitter'>
              Login with Twitter is in progress...
              <br />
              Please wait...
            </Trans>
          ))
          if (window.name === 'twitter_popup') {
            console.log('Posting message to parent', window.parent?.opener)
            window.parent?.opener?.postMessage?.({
              twitterSuccess: true,
              oauth_token,
              oauth_verifier
            })
            return
          }
          const { token } = await twitterApiCallback({
            oauth_token,
            oauth_verifier
          })
          const remember = !!getCookie('pp_remember')
          setAccessToken(token, remember)
          if (remember) {
            destroyCookie('pp_remember')
          }
          // history.replace('/');
          // window.location.reload();
          window.location.replace('/')
        } catch (error) {
          console.error('Twitter login', error)
          await toast.dismiss()
          addToast('error', t('error:errorLoginTwitter'), 7000)
          window.parent?.opener?.postMessage?.({
            twitterSuccess: false,
            twitterError: error
          })
        }
      }
    }

    loginUser()
  }, [])

  return <></>
}

export default TwitterLogin
