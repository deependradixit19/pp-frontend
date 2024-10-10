import { FC, useState, useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from 'react-query'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { AllIcons } from '../../../helpers/allIcons'

import WithHeaderSection from '../../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../../features/LayoutHeader/LayoutHeader'
import DropdownSelect from '../../../features/DropdownSelect/DropdownSelect'
import Button from '../../../components/UI/Buttons/Button'
import { getLanguages, setLanguage } from '../../../services/endpoints/settings'
import { useUserContext } from '../../../context/userContext'
import { ILanguage } from '../../../types/interfaces/ITypes'

const EditLanguage: FC = () => {
  const userData = useUserContext()

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedLanguage, setSelectedLanguage] = useState<ILanguage>(userData.language)

  const queryClient = useQueryClient()
  const { t, i18n } = useTranslation()

  const { data } = useQuery('allLanguages', getLanguages, {
    refetchOnWindowFocus: false
  })

  const configData = () => {
    if (data) {
      let countryArray = Object.values(data.data)

      // for (let i = 0; i < data.length; i++) {
      //   countryArray.push({
      //     name: data[i].name.common,
      //     code: data[i].cca2,
      //   });
      // }

      if (searchTerm.length === 0) {
        return countryArray
      } else {
        return countryArray.filter((item: any) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      }
    } else {
      return []
    }
  }

  const setLanguageMutation = useMutation(() => setLanguage(selectedLanguage?.id), {
    onSuccess: () => {
      i18n.changeLanguage(selectedLanguage.code.toLowerCase())
      queryClient.invalidateQueries('loggedProfile')
    }
  })

  return (
    <WithHeaderSection headerSection={<LayoutHeader type='basic' section={t('general')} title={t('language')} />}>
      <DropdownSelect
        icon={AllIcons.globe_black}
        placeHolder={t('selectLanguage')}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        elementsArr={configData()}
        topSectionSelected={selectedLanguage}
        topSectionSelect={setSelectedLanguage}
      />

      <Button
        text={t('setLanguage')}
        color='black'
        font='mont-16-bold'
        height='5'
        width='20'
        customClass='settings__addlanguage'
        clickFn={() => setLanguageMutation.mutate()}
      />
    </WithHeaderSection>
  )
}

export default EditLanguage
