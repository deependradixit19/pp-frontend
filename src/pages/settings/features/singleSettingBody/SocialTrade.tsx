import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icons } from '../../../../helpers/icons'

import ActionCard from '../../../../features/ActionCard/ActionCard'

const SocialTrade: FC = () => {
  const [active, setActive] = useState<boolean>(false)
  const { t } = useTranslation()
  return (
    <ActionCard
      icon={Icons.socialtrade}
      absFix={true}
      text={t('enableSocialTrade')}
      hasToggle={true}
      toggleActive={active}
      toggleFn={() => {
        setActive(!active)
        // fn to update settings
      }}
    />
  )
}

export default SocialTrade
