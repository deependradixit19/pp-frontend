import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import ActionCard from '../../../../features/ActionCard/ActionCard'
import * as spriteIcons from '../../../../assets/svg/sprite'
import { useUserContext } from '../../../../context/userContext'

const PayoutSettings: FC = () => {
  const { t } = useTranslation()
  const profile = useUserContext()

  return (
    <>
      <ActionCard
        icon={<spriteIcons.IconCalendarOutline />}
        text={t('payoutFrequency')}
        hasWire={!!profile.payout_frequency}
        wireText={t(profile.payout_frequency)}
        hasArrow={true}
        link='/settings/general/payout-settings/payment-frequency'
        customClass='singleSetting__actionCard7'
      />

      <ActionCard
        icon={<spriteIcons.IconWalletOutline />}
        text={t('payoutMethod')}
        hasWire={!!profile.payout_method}
        wireText={t(profile.payout_method)}
        hasArrow={true}
        link='/settings/general/payout-settings/payment-method'
        customClass='singleSetting__actionCard7'
      />

      <ActionCard
        icon={<spriteIcons.IconNoteOutline />}
        text={t('uploadDocuments')}
        hasArrow={true}
        link='/settings/general/payout-settings/upload-documents'
        customClass='singleSetting__actionCard7'
      />
    </>
  )
}

export default PayoutSettings
