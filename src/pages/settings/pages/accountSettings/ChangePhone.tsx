import { FC, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient, useMutation } from 'react-query'
import { useTranslation } from 'react-i18next'
import { AllIcons } from '../../../../helpers/allIcons'
import { useUserContext } from '../../../../context/userContext'
import { editProfileInfo } from '../../../../services/endpoints/settings'

import WithHeaderSection from '../../../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../../../features/LayoutHeader/LayoutHeader'
import FixedBottomButton from '../../../../components/UI/FixedBottomButton/FixedBottomButton'
import SuccessfulChange from '../../features/SuccessfulChange'
import StyledPhoneInput from '../../../../components/Form/StyledPhoneInput/StyledPhoneInput'

const ChangePhone: FC = () => {
  const [newPhone, setNewPhone] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [phoneTaken, setPhoneTaken] = useState<boolean>(false)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const userData = useUserContext()
  const { t } = useTranslation()
  useEffect(() => {
    if (userData) {
      setNewPhone(userData.phone_number)
    }
  }, [userData])
  function subminFn(phoneNumber: string) {
    if (phoneNumber.length < 16 && phoneNumber.length > 4) {
      updatePhoneNumber.mutate({ phone_number: phoneNumber })
    }
  }
  const updatePhoneNumber = useMutation(
    (newPhone: { phone_number: string }) => {
      return editProfileInfo({ phone_number: newPhone.phone_number }, 'phone-number')
    },
    {
      onError: err => {
        setPhoneTaken(true)
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
          <>
            <StyledPhoneInput
              phone={newPhone}
              setPhone={(val: string) => {
                setNewPhone(val)
              }}
            />
            {/* <InputCard
              validate="phoneNumber"
              hasIcon={true}
              icon={AllIcons.phone_black}
              type="number"
              label={t('phoneNumber')}
              value={newPhone}
              changeFn={(val: string) => {
                setNewPhone(val);
              }}
              errorActive={phoneTaken}
              errorMessage={t('required')}
            /> */}
          </>
        )

      case 2:
        return <SuccessfulChange img={AllIcons.settings_mobile_big} text={t('yourPhoneNumberHasSuccessfullyChanged')} />
    }
  }

  const renderBottomButton = () => {
    switch (currentPage) {
      case 1:
        return (
          <FixedBottomButton
            customClass='accountsettings__card__fixedbottombtn'
            text={t('save')}
            disabled={newPhone?.length < 4 || newPhone?.length > 16}
            clickFn={() => subminFn(newPhone)}
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
      headerSection={<LayoutHeader type='basic' section={t('account')} title={t('settings:changePhoneNumber')} />}
    >
      <>
        {renderCurrentPage()}
        {renderBottomButton()}
      </>
    </WithHeaderSection>
  )
}

export default ChangePhone
