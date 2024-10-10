import { FC, useState, useEffect } from 'react'
import './_accountSettings.scss'
import { useNavigate } from 'react-router-dom'
import { useQueryClient, useMutation } from 'react-query'
import { useTranslation } from 'react-i18next'
import { useUserContext } from '../../../../context/userContext'
import WithHeaderSection from '../../../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../../../features/LayoutHeader/LayoutHeader'
import FixedBottomButton from '../../../../components/UI/FixedBottomButton/FixedBottomButton'
import SuccessfulChange from '../../features/SuccessfulChange'

import { editProfileInfo } from '../../../../services/endpoints/settings'
import { Icons } from '../../../../helpers/icons'

import InputCard from '../../../../components/Form/InputCard/InputCard'

const ChangeUsername: FC = () => {
  const [newUsername, setNewUsername] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [usernameTaken, setUsernameTaken] = useState<boolean>(false)

  const userData = useUserContext()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    if (userData) {
      setNewUsername(userData.username)
    }
  }, [userData])

  const updateUsername = useMutation(
    (newUsername: { username: string }) => editProfileInfo({ username: newUsername.username }, userData.id),
    {
      onError: err => {
        setUsernameTaken(true)
      },
      onSuccess: () => {
        setCurrentPage(2)
        queryClient.invalidateQueries('loggedProfile')
      }
    }
  )

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <InputCard
            hasAvatar={true}
            type='text'
            label={t('username')}
            value={newUsername}
            changeFn={(val: string) => {
              setUsernameTaken(false)
              setNewUsername(val)
            }}
            errorActive={usernameTaken}
            errorMessage={t('error:thatUsernameIsTaken')}
            validate='letters/numbers'
          />
        )

      case 2:
        return <SuccessfulChange img={Icons.avatar_big} text={t('yourUsernameHasSuccessfullyChanged')} />
    }
  }

  const renderBottomButton = () => {
    switch (currentPage) {
      case 1:
        return (
          <FixedBottomButton
            customClass='accountsettings__card__fixedbottombtn'
            text={t('update')}
            disabled={newUsername.length < 6 || !/^[a-zA-Z0-9._]*$/.test(newUsername)}
            // clickFn={() => updateUsername()}
            clickFn={() => {
              if (newUsername.length >= 6 && /^[a-zA-Z0-9._]*$/.test(newUsername)) {
                updateUsername.mutate({ username: newUsername })
              }
            }}
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
    <WithHeaderSection headerSection={<LayoutHeader type='basic' section={t('account')} title={t('changeUsername')} />}>
      <>
        {renderCurrentPage()}
        {renderBottomButton()}
      </>
    </WithHeaderSection>
  )
}

export default ChangeUsername
