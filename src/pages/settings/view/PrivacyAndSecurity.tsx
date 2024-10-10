import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import WithHeaderSection from '../../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../../features/LayoutHeader/LayoutHeader'
import MainSettingsPage from '../layout/MainSettingsPage'

import { useModalContext } from '../../../context/modalContext'
import DeleteAccountModal from '../../../components/UI/Modal/DeleteAccount/DeleteAccountModal'
import ConfirmModal from '../../../components/UI/Modal/Confirm/ConfirmModal'
import { logoutUser } from '../../../services/endpoints/auth'

import * as spriteIcons from '../../../assets/svg/sprite'

const PrivacyAndSecurity: FC = () => {
  const modalData = useModalContext()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const toggleDeleteModal = () => {
    modalData.addModal(t('deleteAccount'), <DeleteAccountModal type='delete' />)
  }
  const toggleDeactivateModal = () => {
    modalData.addModal(t('deactivateAccount'), <DeleteAccountModal type='deactivate' />)
  }

  const privacyAndSecurityCardsFirst = [
    {
      icon: <spriteIcons.IconManLineThrough />,
      body: t('blockedUsers'),
      link: '/settings/account/privacy-and-security/blocked-users',
      currentData: '123 users',
      absfix: true
    },
    {
      icon: <spriteIcons.IconGPSPoint />,
      body: t('geoBlocking'),
      link: '/settings/account/privacy-and-security/geo-blocking',
      absfix: true
    },
    {
      icon: <spriteIcons.IconMagnifyingGlassChecked />,
      body: t('discoverySettings'),
      link: '/settings/account/privacy-and-security/discovery-settings',
      absfix: true
    },
    {
      icon: <spriteIcons.IconScanSquare />,
      body: t('twoStepVerification'),
      link: '/settings/account/privacy-and-security/two-step-verification',
      absfix: true
    },
    {
      icon: <spriteIcons.IconNote />,
      body: t('loginSessions'),
      link: '/settings/account/privacy-and-security/login-sessions',
      absfix: true
    }
  ]

  const privacyAndSecurityCardsSecond = [
    {
      icon: <spriteIcons.IconTrashcanLarge />,
      body: t('deleteAccount'),
      clickFn: () => toggleDeleteModal()
    },
    {
      icon: <spriteIcons.IconLogOut />,
      body: t('logOut'),
      clickFn: () => {
        modalData.addModal(`${t('logOut')}?`, <ConfirmModal confirmFn={() => logoutUser(navigate)} />)
      }
    }
  ]

  return (
    <WithHeaderSection
      headerSection={<LayoutHeader type='basic' section={t('account')} title={t('privacySecurity')} />}
    >
      <MainSettingsPage settingsTop={privacyAndSecurityCardsFirst} settingsBot={privacyAndSecurityCardsSecond} />
    </WithHeaderSection>
  )
}

export default PrivacyAndSecurity
