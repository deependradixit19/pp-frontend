import { FC, useState, useEffect } from 'react'
import { useQueryClient, useMutation } from 'react-query'
import { useTranslation } from 'react-i18next'
import { addToast } from '../../../../components/Common/Toast/Toast'
import { putChatSettings } from '../../../../services/endpoints/settings'
import MainSettingsPage from '../../layout/MainSettingsPage'

import { useUserContext } from '../../../../context/userContext'
import { AllIcons } from '../../../../helpers/allIcons'

const ChatSettings: FC = () => {
  const [chatSettingsState, setChatSettingsState] = useState<{
    [key: string]: boolean
  }>({
    welcome_message_enabled: false,
    connect_instagram_enabled: false
  })

  const userData = useUserContext()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  useEffect(() => {
    if (userData) {
      setChatSettingsState({
        welcome_message_enabled: userData.welcome_message_enabled,
        connect_instagram_enabled: userData.connect_instagram_enabled
      })
    }
  }, [userData])

  const toggleFunction = useMutation(
    (newChatSettings: { key: string; value: boolean }) => {
      const { key, value } = newChatSettings
      setChatSettingsState({ ...chatSettingsState, [key]: value })
      return putChatSettings({ [key]: value })
    },
    {
      onError: err => {
        addToast('error', t('error:errorSomethingWentWrong'))
      },
      onSuccess: () => {
        queryClient.invalidateQueries('loggedProfile')
      }
    }
  )

  const chatSettingsCards = [
    {
      body: t('welcomeMessage'),
      info: t('setUpAnAutoMessageToYourNewSubscribers'),
      hasToggle: true,
      toggleActive: chatSettingsState.welcome_message_enabled,
      toggleFn: () => {
        toggleFunction.mutate({
          key: 'welcome_message_enabled',
          value: !chatSettingsState.welcome_message_enabled
        })
      },
      link: '/settings/general?chat-settings&welcome-message',
      hasArrow: true
    },
    {
      icon: AllIcons.instagram_active,
      body: t('instagram'),
      hasToggleWithText: true,
      toggleText: chatSettingsState.connect_instagram_enabled ? t('connected') : t('connect'),
      toggleActive: chatSettingsState.connect_instagram_enabled,
      toggleFn: () => {
        toggleFunction.mutate({
          key: 'connect_instagram_enabled',
          value: !chatSettingsState.connect_instagram_enabled
        })
      },
      link: '/settings/general?chat-settings&connect-instagram',
      hasArrow: false
    }
  ]

  return <MainSettingsPage settingsTop={chatSettingsCards} />
}

export default ChatSettings
