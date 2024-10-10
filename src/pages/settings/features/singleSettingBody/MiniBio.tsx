import { FC, useEffect, useState } from 'react'
import './_singleSetting.scss'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import { Icons } from '../../../../helpers/icons'
import SuccessfulChange from '../SuccessfulChange'
import InputCard from '../../../../components/Form/InputCard/InputCard'
import Button from '../../../../components/UI/Buttons/Button'
import { useUserContext } from '../../../../context/userContext'
import { putProfileSettings } from '../../../../services/endpoints/settings'
import { addToast } from '../../../../components/Common/Toast/Toast'

const MiniBio: FC = () => {
  const [value, setValue] = useState<string>('')
  const [page, setPage] = useState<number>(1)

  const navigate = useNavigate()

  const userData = useUserContext()

  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const submitFunction = useMutation(() => putProfileSettings({ mini_bio: value }), {
    onSuccess: data => {
      queryClient.invalidateQueries('loggedProfile')
      queryClient.refetchQueries(['profile', `${userData.id}`])
      setPage(2)
    },
    onError: err => {
      addToast('error', t('error:errorSomethingWentWrong'))
    }
  })

  useEffect(() => {
    if (userData) {
      setValue(userData.mini_bio || '')
    }
  }, [userData])

  const renderPage = () => {
    if (page === 1) {
      return (
        <>
          <InputCard
            hasAvatar={true}
            type='text'
            label={t('miniBio')}
            value={value}
            changeFn={(val: string) => setValue(val)}
            hasDesc={true}
            maxChars={30}
            desc={`${value.trim().length} / 30 ${t('characters')}`}
            customClass='mini-bio-input'
          />

          <Button
            text={t('save')}
            color='black'
            font='mont-16-bold'
            width='20'
            height='5'
            disabled={!value.trim() || value.trim().length > 30}
            clickFn={() => submitFunction.mutate()}
            customClass='mini-bio-save-button'
          />
        </>
      )
    } else {
      return (
        <>
          <SuccessfulChange img={Icons.avatar_big} text={t('successfullyUpdatedMiniBio')} />
          <Button
            text={t('close')}
            color='black'
            font='mont-16-bold'
            width='20'
            height='5'
            clickFn={() => navigate('/settings/general/profile-settings')}
            customClass='mini-bio-save-button'
          />
        </>
      )
    }
  }

  return <>{renderPage()}</>
}

export default MiniBio
