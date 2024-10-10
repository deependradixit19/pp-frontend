import { FC, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { quickRegistration } from '../../../types/types'
import { registerUser } from '../../../services/endpoints/auth'

import LoginLayout from '../../../layouts/loginLayout/LoginLayout'
import InputField from '../../../components/Form/InputField/InputField'
import CheckboxField from '../../../components/Form/CheckboxField/CheckboxField'
import Button from '../../../components/UI/Buttons/Button'

import bg from '../../../assets/images/home/bg4.png'
import { useProfileContext } from '../../../context/profileContext'
import { useUserContext } from '../../../context/userContext'
import { IProfile } from '../../../types/interfaces/IProfile'
import logo2 from '../../../assets/images/home/logo2.svg'
import { addToast } from '../../../components/Common/Toast/Toast'

const Register: FC<{}> = () => {
  const [registrationData, setRegistrationData] = useState<quickRegistration>({
    name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    is_model: 0
  })
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false)
  const [registrationLocked, setRegistrationLocked] = useState<boolean>(false)
  const [passwordInputType, setPasswordInputType] = useState<boolean>(true)

  const navigate = useNavigate()
  const userData = useUserContext()
  const { t } = useTranslation()

  const { profileMarker, setProfileMarker } = useProfileContext()

  const updateRegistrationData = (field: string, val: string): void => {
    if (field === 'password') {
      setRegistrationData({
        ...registrationData,
        password: val,
        password_confirmation: val
      })
    } else {
      setRegistrationData({ ...registrationData, [field]: val })
    }
  }
  const setLoggedInUser = (user: IProfile) => {
    userData.setUser(user)
  }

  const submitErrorFn = (err: any) => {
    let errorWithMsg = false
    if (err?.response?.status === 422) {
      if (err.response.data?.errors?.email?.[0] === 'The email has already been taken.') {
        addToast('error', t('error:thatEmailIsTaken'))
        errorWithMsg = true
      }
      if (err.response.data?.errors?.name?.[0] === 'The name has already been taken.') {
        addToast('error', t('error:thatDisplayNameIsTaken'))
        errorWithMsg = true
      }
      if (err.response.data?.errors?.username?.[0] === 'The username has already been taken.') {
        addToast('error', t('error:thatUsernameIsTaken'))
        errorWithMsg = true
      }
      if (!errorWithMsg) {
        addToast('error', t('error:errorInvalidData'))
      }
    } else {
      addToast('error', t('error:registrationError'))
    }
  }

  const submitForm = () => {
    registerUser(registrationData, navigate, profileMarker.profileId, setLoggedInUser, submitErrorFn)
  }

  const missingData = (): boolean => {
    const { username, email, password } = registrationData
    return username.length === 0 || email.length === 0 || password.length === 0 || !termsAccepted
  }

  return (
    <LoginLayout bgImg={bg} logo={logo2}>
      <div className='auth-register'>
        <h1 className='auth-register__title'>{t('signup')}</h1>

        <div className='auth-register__form'>
          {/* DISPLAY NAME */}
          <InputField
            id='registration-name'
            type='text'
            value={registrationData.name}
            label={t('displayName')}
            changeFn={(val: string) => updateRegistrationData('name', val)}
            validate='letters/numbers/spaces'
            validationCheck={(val: boolean) => setRegistrationLocked(val)}
            validationErrorMessage={t('error:errorDisplayName')}
            validationCharactersNumber={4}
            additionalProps={{
              placeholder: t('displayName')
            }}
          />

          {/* USERNAME */}
          <InputField
            id='registration-username'
            type='text'
            value={registrationData.username}
            label={t('username')}
            changeFn={(val: string) => updateRegistrationData('username', val)}
            validate='letters/numbers'
            validationCheck={(val: boolean) => setRegistrationLocked(val)}
            validationErrorMessage={t('error:errorUsername')}
            validationCharactersNumber={4}
            additionalProps={{
              placeholder: t('username')
            }}
          />

          {/* EMAIL */}
          <InputField
            id='registration-email'
            type='email'
            value={registrationData.email}
            label={t('email')}
            changeFn={(val: string) => updateRegistrationData('email', val)}
            validate='email'
            validationCheck={(val: boolean) => setRegistrationLocked(val)}
            validationErrorMessage={t('error:errorEmail')}
            additionalProps={{
              placeholder: t('email')
            }}
          />

          {/* PASSWORD */}
          <InputField
            id='registration-password'
            type={passwordInputType ? 'password' : 'text'}
            value={registrationData.password}
            label={t('password')}
            changeFn={(val: string) => updateRegistrationData('password', val)}
            inputvisible={passwordInputType}
            swaptypeicon={true}
            swaptype={() => setPasswordInputType(!passwordInputType)}
            validate='password'
            validationCheck={(val: boolean) => setRegistrationLocked(val)}
            validationErrorMessage={t('error:errorPassword')}
            validationCharactersNumber={8}
            additionalProps={{
              placeholder: t('password'),
              autoComplete: 'new-password'
            }}
          />

          {/* TERMS */}
          <CheckboxField
            customClass='auth-register__checkbox'
            id='registration-terms'
            value='terms'
            label={
              <>
                {t('agreeToTerms')}{' '}
                <Link to='/terms-and-conditions' target='_blank'>
                  {t('terms')}, {t(' privacyPolicy')} {t('and')} {t('fees')}
                </Link>
              </>
            }
            checked={termsAccepted}
            changeFn={() => setTermsAccepted(!termsAccepted)}
          />

          <div className='auth-register__action'>
            <Button
              text={t('signup')}
              color='blue'
              font='mont-18-semi-bold'
              width='100'
              height='6'
              clickFn={submitForm}
              disabled={registrationLocked || missingData()}
            />
          </div>
        </div>
      </div>
    </LoginLayout>
  )
}

export default Register
