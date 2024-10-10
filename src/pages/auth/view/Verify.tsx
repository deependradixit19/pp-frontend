import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LoginLayout from '../../../layouts/loginLayout/LoginLayout'
import VerificationCode from '../../../features/VerificationCode/VerificationCode'
import RadioButton from '../../../components/Common/RadioButton/RadioButton'
import Button from '../../../components/UI/Buttons/Button'

import bg from '../../../assets/images/home/bg7.png'
import avatarPlaceholder from '../../../assets/images/user_placeholder.png' // temp

const Verify: FC = () => {
  const [remember, setRemember] = useState<boolean>(false)

  const user = { name: 'Nicolas Cage', avatar: avatarPlaceholder }
  const { t } = useTranslation()

  return (
    <LoginLayout bgImg={bg} logo={user.avatar}>
      <div className='auth-verify'>
        <h1 className='auth-verify__title'>
          {t('hi')}, <span>{user.name}</span>
        </h1>

        <p className='auth-verify__text'>
          {t('not')} {user.name}? <span>{t('swithcUser')}</span>
        </p>

        <div className='auth-verify__form'>
          <VerificationCode />

          <div className='auth-verify__remember' onClick={() => setRemember(!remember)}>
            <RadioButton active={remember} />
            {t('remember30Days')}
          </div>

          <Button
            text={t('submit')}
            color='blue'
            font='mont-18-bold'
            width='100'
            height='6'
            clickFn={() => console.log('ok')}
          />
        </div>
      </div>
    </LoginLayout>
  )
}

export default Verify
