import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import LoginLayout from '../../../layouts/loginLayout/LoginLayout'
import LoginForm from './LoginForm'

import bg from '../../../assets/images/home/bg5.png'

const Login: FC<{}> = () => {
  const { t } = useTranslation()
  return (
    <LoginLayout bgImg={bg}>
      <div className='auth-login'>
        <h1 className='auth-login__title'>{t('login')}</h1>
        <LoginForm />
      </div>
    </LoginLayout>
  )
}

export default Login
