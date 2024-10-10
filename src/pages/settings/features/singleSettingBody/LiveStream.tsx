import { FC, useEffect, useState } from 'react'
import './_singleSetting.scss'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import { AllIcons } from '../../../../helpers/allIcons'
import ActionCard from '../../../../features/ActionCard/ActionCard'
import InputCard from '../../../../components/Form/InputCard/InputCard'
import Button from '../../../../components/UI/Buttons/Button'
import SuccessfulChange from '../SuccessfulChange'
import * as spriteIcons from '../../../../assets/svg/sprite'
import { putLiveStreamPrice } from '../../../../services/endpoints/settings'
import { addToast } from '../../../../components/Common/Toast/Toast'
import { useUserContext } from '../../../../context/userContext'

const LiveStream: FC<{
  page: string
}> = ({ page }) => {
  const [price, setPrice] = useState<number>(3)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const userData = useUserContext()
  const { t } = useTranslation()

  const submitFunction = useMutation(() => putLiveStreamPrice({ live_stream_price: price }), {
    onSuccess: () => {
      queryClient.invalidateQueries('loggedProfile')
      setCurrentPage(2)
    },
    onError: err => {
      addToast('error', t('error:errorSomethingWentWrong'))
    }
  })

  if (page === 'cards') {
    return (
      <>
        <ActionCard
          icon={AllIcons.dollar_with_arrows}
          text={t('setPrice')}
          description='Morbi vel leo ut odio iaculis tincidunt.'
          hasArrow={true}
          link='/settings/general/live-stream/set-price'
        />
      </>
    )
  } else {
    if (currentPage === 1) {
      return (
        <>
          <InputCard
            hasIcon={true}
            icon={AllIcons.dollar_with_arrows}
            type='number'
            label={t('pricePerMinute')}
            isTextArea={false}
            value={price}
            changeFn={(val: number) => setPrice(val)}
          />

          <Button
            text={t('save')}
            color='black'
            font='mont-16-bold'
            width='20'
            height='5'
            disabled={!price || price < 3}
            clickFn={() => submitFunction.mutate()}
            customClass='singleSetting__saveBtn'
          />
        </>
      )
    } else {
      return (
        <>
          <SuccessfulChange img={<spriteIcons.IconManCircleBlue />} text={t('successfullyUpdatedMiniBio')} />
          <Button
            text={t('close')}
            color='black'
            font='mont-16-bold'
            width='20'
            height='5'
            clickFn={() => {
              setCurrentPage(1)
              navigate('/settings/general/live-stream')
            }}
            customClass='singleSetting__saveBtn'
          />
        </>
      )
    }
  }
}

export default LiveStream
