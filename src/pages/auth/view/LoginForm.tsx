import { FC, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GoogleLogin } from '@react-oauth/google'

// Services
import { getTwitterLoginLink, googleCallback, loginUser } from '../../../services/endpoints/auth'
import { IProfile } from '../../../types/interfaces/IProfile'
import { addToast } from '../../../components/Common/Toast/Toast'
import { destroyCookie, setCookie } from '../../../services/cookies/cookies'
import { setAccessToken } from '../../../services/storage/storage'
import { Icons } from '../../../helpers/icons'
import { userLogin } from '../../../types/types'

// Context
import { useUserContext } from '../../../context/userContext'

// Components
import Button from '../../../components/UI/Buttons/Button'
import InputField from '../../../components/Form/InputField/InputField'
import CheckboxField from '../../../components/Form/CheckboxField/CheckboxField'

const LoginForm: FC<{ fromUser?: boolean }> = ({ fromUser = false }) => {
  const [loginData, setLoginData] = useState<userLogin>({
    //email works for username also
    email: '',
    password: '',
    remember: false
  })
  const [loginAttempted, setLoginAttempted] = useState<{
    email: boolean
    password: boolean
  }>({
    email: false,
    password: false
  })
  const [passwordInputType, setPasswordInputType] = useState<boolean>(true)
  const [remember, setRemember] = useState<boolean>(false)
  const [twitterUrl, setTwitterUrl] = useState<string>()
  const navigate = useNavigate()
  const location = useLocation()
  const userData = useUserContext()

  const { t } = useTranslation()

  const getTwitterLink = useCallback(async () => {
    return (await getTwitterLoginLink()).target_url
  }, [])

  const updateLoginData = (field: string, val: string): void => {
    setLoginData({ ...loginData, [field]: val })
  }

  const setLoggedInUser = (user: IProfile) => {
    userData.setUser(user)
  }

  const submitForm = async () => {
    let id = null
    if (loginData.email.length > 0 && loginData.password.length > 0) {
      if (fromUser) {
        id = location.pathname.split('/')[2]
      }
      loginUser(
        loginData,
        navigate,
        id ? parseInt(id) : null,
        () => {
          setLoginAttempted({ email: true, password: true })
          addToast('error', t('error:errorInvalidDataLogin'))
        },
        setLoggedInUser
      )
    } else {
      setLoginAttempted({ email: true, password: true })
    }
  }

  useEffect(() => {
    // reset remember cookie (used for twitter login)
    destroyCookie('pp_remember')
  }, [])

  return (
    <div className='auth-login__form'>
      {/* TwitterLogin */}
      <Button
        text={t('continueTwitter')}
        color='white'
        type='transparent--login'
        height='5'
        width='100'
        font='mont-14-normal'
        customClass='auth-login__twitter'
        hasCircleIcon={true}
        circleIcon={Icons.twitter}
        circleIconBg='twitter'
        clickFn={async () => {
          if (!twitterUrl) {
            const twitterLink = await getTwitterLink()
            setTwitterUrl(twitterLink)
            window.open(twitterLink, '_self')
            return
          }
          window.open(twitterUrl, '_self')
        }}
      />

      <GoogleLogin
        locale={t('login')}
        onSuccess={res => {
          googleCallback(res)
            .then(resp => {
              setAccessToken(resp.data.token, remember)
              if (resp.data.user.is_model === true) {
                navigate(`/profile/${resp.data.user.id}/all`)
              } else {
                navigate('/')
              }
              window.location.reload()
            })
            .catch(err => console.log(err))
        }}
        onError={() => console.log('Google login error')}
      />

      <div className='auth-login__hr'>
        <span className='auth-login__hr--side'></span>
        <span className='auth-login__hr--or'>{t('or')}</span>
        <span className='auth-login__hr--side'></span>
      </div>

      <InputField
        id='login-email'
        type='email'
        value={loginData.email}
        label={`${t('email')} / ${t('username')}`}
        changeFn={(val: string) => {
          setLoginAttempted({ ...loginAttempted, email: false })
          updateLoginData('email', val)
        }}
        additionalProps={{
          placeholder: `${t('email')} / ${t('username')}`
        }}
        loginAttempted={loginAttempted.email}
      />
      <InputField
        id='login-password'
        type={passwordInputType ? 'password' : 'text'}
        value={loginData.password}
        label={t('password')}
        changeFn={(val: string) => {
          setLoginAttempted({ ...loginAttempted, password: false })
          updateLoginData('password', val)
        }}
        inputvisible={passwordInputType}
        swaptypeicon={true}
        swaptype={() => setPasswordInputType(!passwordInputType)}
        additionalProps={{
          placeholder: t('password')
        }}
        loginAttempted={loginAttempted.password}
      />

      <div className='auth-login__actions'>
        <CheckboxField
          id='login-remember'
          value='login-remember'
          label={t('rememberMe')}
          checked={remember}
          changeFn={() => {
            setLoginData({
              ...loginData,
              remember: !loginData.remember
            })
            setRemember(!remember)
            if (!remember) {
              setCookie('pp_remember', '1')
            } else {
              destroyCookie('pp_remember')
            }
          }}
        />

        <Link className='auth-login__forgot-password' to={`/auth/recover`}>
          {t('forgotPassword')}
        </Link>
      </div>

      <Button text={t('login')} color='blue' font='mont-18-semi-bold' width='100' height='6' clickFn={submitForm} />
    </div>
  )
}

export default LoginForm
