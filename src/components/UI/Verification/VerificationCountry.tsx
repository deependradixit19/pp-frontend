import { FC, useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { StepWizardChildProps } from 'react-step-wizard'
import { useTranslation } from 'react-i18next'
import { getGeoCountries } from '../../../services/endpoints/settings'
import VerificationLayout from './VerificationLayout'

import DropdownSelect from '../../../features/DropdownSelect/DropdownSelect'
import { AllIcons } from '../../../helpers/allIcons'
import { ICountry } from '../../../types/interfaces/IGeoBlock'
import { putUserCountry } from '../../../services/endpoints/profile'
import { useUserContext } from '../../../context/userContext'

const VerificationCountry: FC<Partial<StepWizardChildProps>> = ({ currentStep, nextStep, previousStep, hashKey }) => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null)
  const userData = useUserContext()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { data } = useQuery('allCountries', getGeoCountries, {
    refetchOnWindowFocus: false
  })

  useEffect(() => {
    if (userData && data) {
      if (userData.country) {
        const tmp = data.data.filter((country: ICountry) => country.id === userData.country.id)
        tmp.length && setSelectedCountry(tmp[0])
      }
    }
  }, [userData, data])

  const configData = () => {
    if (data) {
      if (searchTerm.length === 0) {
        return data.data
      } else {
        return data.data.filter((item: any) => item.name.toLowerCase().includes(searchTerm.toLocaleLowerCase()))
      }
    } else {
      return []
    }
  }

  const handleNextClick = useMutation((country_id: number) => putUserCountry(country_id), {
    onMutate: resData => {},
    onSettled: () => {
      queryClient.invalidateQueries('loggedProfile')
      nextStep && nextStep()
    }
  })

  return (
    <VerificationLayout
      currentStep={currentStep}
      nextStep={() => selectedCountry && handleNextClick.mutate(selectedCountry.id)}
      previousStep={previousStep}
      nextDisabled={!selectedCountry}
    >
      <div className='verificationStep country'>
        <h3 className='verificationStep__title'>{t('countryOfLegalResidence')}</h3>
        <DropdownSelect
          customClass='verification-country-dropdown'
          icon={AllIcons.globe_black}
          placeHolder={t('selectCountry')}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          elementsArr={configData()}
          topSectionSelected={selectedCountry}
          topSectionSelect={setSelectedCountry}
          hasBottomSection={false}
        />
      </div>
    </VerificationLayout>
  )
}

export default VerificationCountry
