import { FC, useState, useEffect } from 'react'
import { useQueryClient, useMutation } from 'react-query'
import { useTranslation } from 'react-i18next'
import { useUserContext } from '../../../../context/userContext'
import { addToast } from '../../../../components/Common/Toast/Toast'
import MainSettingsPage from '../../layout/MainSettingsPage'

import { putProfileSettings } from '../../../../services/endpoints/settings'

const ProfileSettings: FC = () => {
  const [profileSettingsState, setProfileSettingsState] = useState<{
    [key: string]: boolean
  }>({
    show_like_count: false,
    show_follow_count: false,
    show_online_status: false,
    show_friend_list: false,
    show_mini_bio: false,
    allow_camshow_request: false
  })

  const userData = useUserContext()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  useEffect(() => {
    if (userData) {
      setProfileSettingsState({
        show_like_count: userData.show_like_count,
        show_follow_count: userData.show_follow_count,
        show_online_status: userData.show_online_status,
        show_friend_list: userData.show_friend_list || false,
        show_mini_bio: userData.show_mini_bio || false,
        allow_camshow_request: userData.allow_camshow_request || false
      })
    }
  }, [userData])

  const toggleFunction = useMutation(
    (newProfileSettings: { key: string; value: boolean }) => {
      const { key, value } = newProfileSettings
      setProfileSettingsState({ ...profileSettingsState, [key]: value })
      return putProfileSettings({ [key]: value })
    },
    {
      onMutate: async (newData: any) => {
        await queryClient.cancelQueries('loggedProfile')
        const previousQueryData = queryClient.getQueryData('loggedProfile')
        queryClient.setQueryData('loggedProfile', (oldData: any) => {
          return {
            ...oldData,
            [newData.key]: newData.value
          }
        })
        return { previousQueryData }
      },
      onError: (error, newData, context: any) => {
        queryClient.setQueryData('loggedProfile', context.previousQueryData)
        addToast('error', t('error:errorSomethingWentWrong'))
      }
    }
  )

  useEffect(() => {
    return () => {
      queryClient.refetchQueries(['profile', `${userData.id}`])
      queryClient.invalidateQueries('loggedProfile')
    }
  }, [])

  const profileSettingsCards = [
    {
      body: t('showLikesCount'),
      info: t('controlWhoCanSeeTheLikes'),
      hasToggle: true,
      toggleActive: profileSettingsState.show_like_count,
      toggleFn: () => {
        toggleFunction.mutate({
          key: 'show_like_count',
          value: !profileSettingsState.show_like_count
        })
      },
      hasArrow: false
    },
    {
      body: t('showFollowerCount'),
      info: t('controlWhoCanSeeTheFollowers'),
      hasToggle: true,
      toggleActive: profileSettingsState.show_follow_count,
      toggleFn: () => {
        toggleFunction.mutate({
          key: 'show_follow_count',
          value: !profileSettingsState.show_follow_count
        })
      },
      hasArrow: false
    },
    {
      body: t('showOnlineStatus'),
      info: t('controlWhoCanSeeYourOnlineStatus'),
      hasToggle: true,
      toggleActive: profileSettingsState.show_online_status,
      toggleFn: () => {
        toggleFunction.mutate({
          key: 'show_online_status',
          value: !profileSettingsState.show_online_status
        })
      },
      hasArrow: false
    },
    {
      body: t('showFriendsCount'),
      info: t('controlWhoSeesYourFriendsCount'),
      hasToggle: true,
      toggleActive: profileSettingsState.show_friend_list,
      toggleFn: () => {
        toggleFunction.mutate({
          key: 'show_friend_list',
          value: !profileSettingsState.show_friend_list
        })
      },
      hasArrow: false
    },
    {
      body: t('showProfileBio'),
      info: t('controlWhoSeesYourMiniBioThatIsOnYourProfile'),
      hasToggle: true,
      toggleActive: profileSettingsState.show_mini_bio,
      toggleFn: () => {
        toggleFunction.mutate({
          key: 'show_mini_bio',
          value: !profileSettingsState.show_mini_bio
        })
      },
      link: '/settings/general/profile-settings/mini-bio',
      hasArrow: true
    }
  ]

  return <MainSettingsPage settingsTop={profileSettingsCards} />
}

export default ProfileSettings
