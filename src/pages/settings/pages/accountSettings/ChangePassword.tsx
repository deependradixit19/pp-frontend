import { FC, useState } from 'react'
import './_accountSettings.scss'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import { Icons } from '../../../../helpers/icons'
import WithHeaderSection from '../../../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../../../features/LayoutHeader/LayoutHeader'
import SuccessfulChange from '../../features/SuccessfulChange'
import FixedBottomButton from '../../../../components/UI/FixedBottomButton/FixedBottomButton'

import { editPassword } from '../../../../services/endpoints/settings'

import InputCard from '../../../../components/Form/InputCard/InputCard'

const ChangePassword: FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [passState, setPassState] = useState<{
    current: string
    new: string
    confirm: string
  }>({
    current: '',
    new: '',
    confirm: ''
  })
  const [errorMsg, setErrorMsg] = useState<string>('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const validateInput = (text: string) => {
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(text) && text.length > 8) {
      return true
    } else {
      return false
    }
  }

  const updatePassword = () => {
    if (validateInput(passState.current) && validateInput(passState.new) && validateInput(passState.confirm)) {
      if (passState.current === passState.new) {
        setErrorMsg(t('error:newPasswordCannotBeTheSameAsTheCurrentOne'))
      } else if (passState.new === passState.confirm) {
        editPassword({
          old_password: passState.current,
          password: passState.new,
          password_confirmation: passState.confirm
        }).then(resp => {
          if (resp.message === 'Wrong password') {
            setErrorMsg(t('error:incorrectCurrentPassword'))
          } else {
            queryClient.invalidateQueries('loggedProfile')
            setCurrentPage(2)
          }
        })
      }
    }
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <>
            <InputCard
              type='password'
              label={t('currentPassword')}
              value={passState.current}
              changeFn={(val: string) =>
                setPassState({
                  ...passState,
                  current: val
                })
              }
              hasTypeChanger={true}
              validate='password'
            />
            <InputCard
              type='password'
              label={t('newPassword')}
              value={passState.new}
              changeFn={(val: string) =>
                setPassState({
                  ...passState,
                  new: val
                })
              }
              hasTypeChanger={true}
              validate='password'
            />
            <InputCard
              type='password'
              label={t('confirmNewPassword')}
              value={passState.confirm}
              changeFn={(val: string) =>
                setPassState({
                  ...passState,
                  confirm: val
                })
              }
              hasTypeChanger={true}
              validate='password'
            />
          </>
        )

      case 2:
        return <SuccessfulChange img={Icons.password_big} text={t('yourPasswordHasSuccessfullyChanged')} />
    }
  }

  const renderBottomButton = () => {
    switch (currentPage) {
      case 1:
        return (
          <FixedBottomButton
            customClass='accountsettings__card__fixedbottombtn'
            text={t('update')}
            disabled={
              !validateInput(passState.current) ||
              !validateInput(passState.confirm) ||
              !validateInput(passState.new) ||
              passState.new !== passState.confirm
            }
            clickFn={() => updatePassword()}
          />
        )

      case 2:
        return (
          <FixedBottomButton
            customClass='accountsettings__card__fixedbottombtn'
            text={t('close')}
            clickFn={() => navigate('/settings/account')}
          />
        )
    }
  }

  return (
    <WithHeaderSection
      headerSection={<LayoutHeader type='basic' section={t('account')} title={t('settings:changePassword')} />}
    >
      <>
        {renderCurrentPage()}
        {renderBottomButton()}
        {errorMsg ? (
          <div className='accountsettings__card__error'>
            <p>{errorMsg}</p>
          </div>
        ) : (
          ''
        )}
      </>
    </WithHeaderSection>
  )
}

export default ChangePassword
