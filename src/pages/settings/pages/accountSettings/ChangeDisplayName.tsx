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

const ChangeDisplayName: FC = () => {
  const [newDisplayName, setNewDisplayName] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [usernameTaken, setUsernameTaken] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [isDirty, setIsDirty] = useState<boolean>(false)

  const userData = useUserContext()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    if (userData) {
      setNewDisplayName(userData.display_name)
      setName(userData.display_name)
    }
  }, [userData])

  useEffect(() => {
    name !== newDisplayName ? setIsDirty(true) : setIsDirty(false)
  }, [name, newDisplayName])

  const updateDisplayName = useMutation(
    (newName: { display_name: string }) => editProfileInfo({ display_name: newName.display_name }, 'display-name'),
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
            label={t('displayName')}
            value={newDisplayName}
            changeFn={(val: string) => {
              setUsernameTaken(false)
              setNewDisplayName(val)
            }}
            errorActive={usernameTaken}
            errorMessage={t('error:thatNameIsTaken')}
            validate='letters/numbers'
          />
        )

      case 2:
        return <SuccessfulChange img={Icons.avatar_big} text={t('yourDisplayNameHasSuccessfullyChanged')} />
    }
  }

  const renderBottomButton = () => {
    switch (currentPage) {
      case 1:
        return (
          <FixedBottomButton
            customClass='accountsettings__card__fixedbottombtn'
            text={t('update')}
            disabled={!isDirty || (newDisplayName.length < 6 && !/^[a-zA-Z0-9._]*$/.test(newDisplayName))}
            clickFn={() => updateDisplayName.mutate({ display_name: newDisplayName })}
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
      headerSection={<LayoutHeader type='basic' section={t('account')} title={t('changeDisplayName')} />}
    >
      <>
        {renderCurrentPage()}
        {renderBottomButton()}
      </>
    </WithHeaderSection>
  )
}

export default ChangeDisplayName
