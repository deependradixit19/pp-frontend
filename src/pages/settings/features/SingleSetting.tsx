import { FC, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import { useUserContext } from '../../../context/userContext'
import WithHeaderSection from '../../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../../features/LayoutHeader/LayoutHeader'
import { addToast } from '../../../components/Common/Toast/Toast'

import { putProfileSettings, putChatSettings } from '../../../services/endpoints/settings'

const SingleSetting: FC<{
  section: string
  title: string
  withoutHeaderSwitch?: boolean
  withHeaderUnderline?: boolean
  body?: JSX.Element
}> = ({ section, title, withoutHeaderSwitch, withHeaderUnderline = true, body }) => {
  const [settingActive, setSettingActive] = useState<boolean>(false)

  const userData = useUserContext()
  const queryClient = useQueryClient()
  const location = useLocation()
  const { t } = useTranslation()

  const chatSettingsMutation = useMutation((params: {}) => putChatSettings(params), {
    onMutate: async (newData: { [key: string]: boolean | string }) => {
      await queryClient.cancelQueries('loggedProfile')
      const previousQueryData = queryClient.getQueryData('loggedProfile')
      queryClient.setQueryData('loggedProfile', (oldData: any) => {
        return {
          ...oldData,
          chat_settings: {
            ...oldData.chat_settings,
            ...newData
          }
        }
      })
      return { previousQueryData }
    },
    onError: (error, newData, context: any) => {
      queryClient.setQueryData('loggedProfile', context.previousQueryData)
      addToast('error', t('error:errorSomethingWentWrong'))
    }
  })

  useEffect(() => {
    const checkActiveStatus = () => {
      switch (location.pathname) {
        case '/settings/general/profile-settings/likes-count':
          return userData.show_like_count
        case '/settings/general/profile-settings/follower-count':
          return userData.show_follow_count
        case '/settings/general/profile-settings/online-status':
          return userData.show_online_status
        case '/settings/general/profile-settings/friend-list':
          return userData.show_friend_list
        case '/settings/general/profile-settings/camshow-requests':
          return userData.allow_camshow_request

        case '/settings/general/chat-settings/connect-instagram':
          return userData.connect_instagram_enabled
        case '/settings/general/chat-settings/welcome-message':
          return userData?.chat_settings?.welcome_message_enabled

        case '/settings/general/profile-settings/mini-bio':
          return userData.show_mini_bio

        default:
          return false
      }
    }

    setSettingActive(checkActiveStatus())
  }, [userData, location.pathname])

  const updateProfileSettings = (key: string, value: boolean) => {
    setSettingActive(value)
    putProfileSettings({ [key]: value }).then(() => {
      queryClient.invalidateQueries('loggedProfile')
    })
  }
  const updateChatSettings = (key: string, value: boolean) => {
    setSettingActive(value)
    putChatSettings({ [key]: value }).then(() => {
      queryClient.invalidateQueries('loggedProfile')
    })
  }

  const toggleFunction = () => {
    setSettingActive(!settingActive)
    switch (location.pathname) {
      case '/settings/general/profile-settings/likes-count':
        updateProfileSettings('show_like_count', !userData.show_like_count)
        break
      case '/settings/general/profile-settings/follower-count':
        updateProfileSettings('show_follow_count', !userData.show_follow_count)
        break
      case '/settings/general/profile-settings/online-status':
        updateProfileSettings('show_online_status', !userData.show_online_status)
        break
      case '/settings/general/profile-settings/friend-list':
        updateProfileSettings('show_friend_list', !userData.show_friend_list)
        break
      case '/settings/general/profile-settings/mini-bio':
        updateProfileSettings('show_mini_bio', !userData.show_mini_bio)
        break
      case '/settings/general/profile-settings/camshow-requests':
        updateProfileSettings('allow_camshow_request', !userData.allow_camshow_request)
        break

      case '/settings/general/chat-settings/welcome-message':
        chatSettingsMutation.mutate({
          welcome_message_enabled: !userData?.chat_settings?.welcome_message_enabled
        })
        break
      case '/settings/general/chat-settings/connect-instagram':
        updateChatSettings('connect_instagram_enabled', !userData.connect_instagram_enabled)
        break

      default:
        return
    }
  }

  return (
    <WithHeaderSection
      customClass='single-setting-withheader-section'
      withoutBorder={!withHeaderUnderline}
      headerSection={
        withoutHeaderSwitch ? (
          <LayoutHeader type='basic' section={section} title={title.split('-').join(' ')} />
        ) : (
          <LayoutHeader
            type='switch'
            section={section}
            title={title.split('-').join(' ')}
            switchActive={settingActive}
            switchFn={() => toggleFunction()}
          />
        )
      }
    >
      <>{body ? body : ''}</>
    </WithHeaderSection>
  )
}

export default SingleSetting
