import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import InputField from '../../../components/Form/InputField/InputField'
import Button from '../../../components/UI/Buttons/Button'
import LoginLayout from '../../../layouts/loginLayout/LoginLayout'
import bg from '../../../assets/images/home/bg4.png'
import logo2 from '../../../assets/images/home/logo2.svg'
import { sendPasswordResetEmail } from '../../../services/endpoints/auth'
import { addToast } from '../../../components/Common/Toast/Toast'

const RecoverAccount: FC<{ id?: string; email?: string; title?: string }> = ({ id, email, title }) => {
  const [recoverData, setRecoverData] = useState<string>(email ?? '')
  const [recoverAttempted, setRecoverAttempted] = useState<boolean>(false)
  const [isValid, setIsValid] = useState<boolean>(false)

  const navigate = useNavigate()
  const { t } = useTranslation()

  const submitForm = async () => {
    if (!isValid) {
      addToast('error', t('error:errorInvalidDataEntered'))
      return false
    }
    try {
      await sendPasswordResetEmail({
        email: recoverData
      })
      addToast('success', t('passwordResetLinkEmail'), 4000)
    } catch (error) {
      setRecoverAttempted(true)
      if (axios.isAxiosError(error)) {
        addToast(
          'error',
          error?.response?.data?.errors?.email?.[0] ?? error?.response?.data?.message ?? t('error:errorInvalidEmail')
        )
        return false
      }
      addToast('error', t('error:errorSendingEmail'))
    }
  }

  return (
    <LoginLayout bgImg={bg} logo={logo2}>
      <div className='auth-recover'>
        <h1 className='auth-recover__title'>{title ?? t('forgotPassword')}</h1>

        <p className='auth-recover__text'>{t('ifYouHaveAnAccount')}</p>

        <div className='auth-recover__form'>
          <InputField
            id='recover-email'
            type='email'
            validate='required|email'
            validationCheck={(invalid: boolean) => {
              setIsValid(!invalid)
            }}
            value={recoverData}
            label={t('email')}
            changeFn={(val: string) => {
              setRecoverAttempted(false)
              setRecoverData(val)
            }}
            additionalProps={{
              placeholder: `${t('email')} / ${t('phoneNumber')}`
            }}
            loginAttempted={recoverAttempted}
          />

          <p className='auth-recover__help'>
            {t('stillHavingTroubles')} <span>{t('clickHere')}</span>
          </p>

          <div className='auth-recover__buttons'>
            <Button
              text={t('cancel')}
              color='transparent'
              type='transparent--black'
              font='mont-18-semi-bold'
              width='100'
              height='6'
              clickFn={() => navigate(-1)}
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

export default RecoverAccount
