import { FC, useState, useEffect } from 'react'
import './_accountSettings.scss'
import { useNavigate } from 'react-router-dom'
import { useQueryClient, useMutation } from 'react-query'
import { useTranslation } from 'react-i18next'
import { Icons } from '../../../../helpers/icons'
import WithHeaderSection from '../../../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../../../features/LayoutHeader/LayoutHeader'
import SuccessfulChange from '../../features/SuccessfulChange'

import { useUserContext } from '../../../../context/userContext'
import { putEmail } from '../../../../services/endpoints/settings'

import InputCard from '../../../../components/Form/InputCard/InputCard'
import FixedBottomButton from '../../../../components/UI/FixedBottomButton/FixedBottomButton'

const ChangeEmail: FC = () => {
  const [emailState, setEmailState] = useState<{ [key: string]: string }>({
    newEmail: '',
    recoveryEmail: ''
  })
  const [currentPage, setCurrentPage] = useState<number>(1)

  const navigate = useNavigate()
  const userData = useUserContext()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  useEffect(() => {
    if (userData) {
      setEmailState({ ...emailState, newEmail: userData.email })
    }
    //eslint-disable-next-line
  }, [userData])

  const validateInput = (text: string) => {
    if (/\S+@\S+\.\S+/.test(text) && text.length > 0 && text.length > 0) {
      return true
    } else {
      return false
    }
  }

  const updateEmail = useMutation((newEmail: { email: string }) => putEmail(newEmail.email), {
    onSuccess: () => {
      setCurrentPage(2)
      queryClient.invalidateQueries('loggedProfile')
    }
  })

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <>
            <InputCard
              hasIcon={true}
              icon={Icons.mailoutline}
              type='text'
              label={t('email')}
              value={emailState.newEmail}
              changeFn={(val: string) => {
                setEmailState({ ...emailState, newEmail: val })
              }}
              validate='email'
            />
            <InputCard
              hasIcon={true}
              icon={Icons.mailoutline}
              type='text'
              label={t('recoverEmail')}
              value={emailState.recoveryEmail}
              changeFn={(val: string) => {
                setEmailState({ ...emailState, recoveryEmail: val })
              }}
              validate='email'
            />
          </>
        )

      case 2:
        return <SuccessfulChange img={Icons.email_big} text={t('yourEmailHasSuccessfullyChanged')} />
    }
  }

  const renderBottomButton = () => {
    switch (currentPage) {
      case 1:
        return (
          <FixedBottomButton
            customClass='accountsettings__card__fixedbottombtn'
            text={t('update')}
            disabled={!validateInput(emailState.newEmail)}
            clickFn={() => updateEmail.mutate({ email: emailState.newEmail })}
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
      headerSection={<LayoutHeader type='basic' section={t('account')} title={t('settings:changeEmail')} />}
    >
      <>
        {renderCurrentPage()}
        {renderBottomButton()}
      </>
    </WithHeaderSection>
  )
}

export default ChangeEmail
