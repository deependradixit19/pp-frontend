import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import InputField from '../../../components/Form/InputField/InputField'
import Button from '../../../components/UI/Buttons/Button'
import LoginLayout from '../../../layouts/loginLayout/LoginLayout'
import bg from '../../../assets/images/home/bg4.png'
import logo2 from '../../../assets/images/home/logo2.svg'
import { useFilterQuery } from '../../../helpers/hooks'
import { resetPassword } from '../../../services/endpoints/auth'
import { addToast } from '../../../components/Common/Toast/Toast'

const ResetPassword: FC = () => {
  const [submitBlocked, setSubmitBlocked] = useState<boolean>(true)
  const [passwordInputType, setPasswordInputType] = useState<boolean>(true)
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false)
  const [passState, setPassState] = useState<{
    new: string
    confirm: string
  }>({
    new: '',
    confirm: ''
  })

  const navigate = useNavigate()
  const queryParams = useFilterQuery()
  const { t } = useTranslation()

  const submitForm = () => {
    const token = queryParams.get('token')
    const email = queryParams.get('email')

    if (!submitBlocked) {
      if (typeof token !== 'string' || typeof email !== 'string') {
        addToast('error', t('error:errorInvalidTokenOrEmail'))
      } else if (passwordsMatch) {
        resetPassword({
          token,
          email,
          password: passState.new,
          password_confirmation: passState.new
        })
          .then(resp => {
            console.log(resp.message)
            addToast('success', t('passwordResetSuccessMessage'))
            setTimeout(() => navigate('/auth/login', { replace: true }), 500)
          })
          .catch(err => {
            console.error(err)
            addToast('error', t('error:errorInvalidPasswordReset'))
          })
      } else {
        addToast('error', t('error:errorPasswordsDontMatch'))
      }
    } else {
      addToast('error', t('error:errorInvalidDataEntered'))
    }
  }

  return (
    <LoginLayout bgImg={bg} logo={logo2}>
      <div className='auth-reset-password'>
        <h1 className='auth-reset-password__title'>{t('paswordResset')}</h1>

        <p className='auth-reset-password__text'>{t('pleaseEnterYourNewPassword')}</p>

        <div className='auth-reset-password__form'>
          {/* PASSWORD */}
          <InputField
            customClass='auth-reset-password__new-password'
            id='new-password'
            type={passwordInputType ? 'password' : 'text'}
            value={passState.new}
            label={t('pleaseEnterYourNewPassword')}
            changeFn={(val: string) => {
              setPassState({ ...passState, new: val })
              setPasswordsMatch(passState.confirm === val)
            }}
            inputvisible={passwordInputType}
            swaptypeicon={true}
            swaptype={() => setPasswordInputType(!passwordInputType)}
            validate='required|password'
            validationCheck={(val: boolean) => setSubmitBlocked(val)}
            validationErrorMessage={t('error:errorPasswordReset')}
            validationCharactersNumber={8}
            additionalProps={{
              placeholder: t('pleaseEnterYourNewPassword'),
              autoComplete: 'new-password'
            }}
          />

          {/* CONFIRM PASSWORD */}
          <InputField
            id='confirm-password'
            type={passwordInputType ? 'password' : 'text'}
            value={passState.confirm}
            label={t('confirmPassword')}
            changeFn={(val: string) => {
              setPassState({ ...passState, confirm: val })
              setPasswordsMatch(passState.new === val)
            }}
            inputvisible={passwordInputType}
            swaptypeicon={true}
            swaptype={() => setPasswordInputType(!passwordInputType)}
            validate='required|password'
            validationCheck={(val, confirmPassword) => {
              if (confirmPassword !== passState.new) {
                setSubmitBlocked(true)
                return {
                  isValid: false,
                  message: t('error:errorPasswordsDontMatch')
                }
              }
              setSubmitBlocked(val)
            }}
            validationErrorMessage={t('error:errorPasswordReset')}
            validationCharactersNumber={8}
            additionalProps={{
              placeholder: t('confirmPassword'),
              autoComplete: 'new-password'
            }}
          />

          <div className='auth-reset-password__buttons'>
            <Button
              text={t('cancel')}
              color='transparent'
              type='transparent--black'
              font='mont-18-semi-bold'
              width='100'
              height='6'
              clickFn={() => navigate('/')}
            />

            <Button
              text={t('send')}
              color='blue'
              font='mont-18-semi-bold'
              width='100'
              height='6'
              clickFn={() => submitForm()}
            />
          </div>
        </div>
      </div>
    </LoginLayout>
  )
}

export default ResetPassword
