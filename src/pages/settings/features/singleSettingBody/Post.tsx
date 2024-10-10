import { FC, useState, useEffect } from 'react'
import { useQueryClient, useMutation } from 'react-query'
import { useTranslation } from 'react-i18next'
import { produce } from 'immer'
import { AllIcons } from '../../../../helpers/allIcons'
import { useUserContext } from '../../../../context/userContext'
import { addToast } from '../../../../components/Common/Toast/Toast'

import { putProfileSettings } from '../../../../services/endpoints/settings'

import ActionCard from '../../../../features/ActionCard/ActionCard'
import SSAccordion from '../SSAccordion'
import { IProfile } from '../../../../types/interfaces/IProfile'

interface IPostSettings {
  auto_post_to_twitter: boolean
  post_preview_type: string | null
}

const Post: FC = () => {
  const [postSettingsState, setPostSettingsState] = useState<IPostSettings>({
    auto_post_to_twitter: false,
    post_preview_type: null
  })

  const userData = useUserContext()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  useEffect(() => {
    if (userData) {
      setPostSettingsState({
        auto_post_to_twitter: userData.auto_post_to_twitter,
        post_preview_type: userData.post_preview_type
      })
    }
  }, [userData])

  const cachedData = queryClient.getQueryData<IProfile>('loggedProfile')

  const toggleFunction = useMutation(
    (newPostSettings: { key: string; value: boolean | string | null }) => {
      const { key, value } = newPostSettings
      setPostSettingsState({ ...postSettingsState, [key]: value })
      return putProfileSettings({ [key]: value })
    },
    {
      onMutate: (vars: { key: string; value: boolean | string }) => {
        const { key, value } = vars
        if (cachedData) {
          const newData: IProfile = produce(cachedData, draft => {
            return { ...draft, [key]: value }
          })
          queryClient.setQueryData('loggedProfile', newData)
        }
      },
      onError: err => {
        queryClient.setQueryData('loggedProfile', cachedData)
        addToast('error', t('error:errorSomethingWentWrong'))
      }
    }
  )

  return (
    <>
      {userData.twitter_nickname && (
        <ActionCard
          icon={AllIcons.twitter_active}
          text={t('twitter')}
          subtext={`@${userData.twitter_nickname}`}
          customClass='singleSetting__autotwitter'
        />
      )}

      <ActionCard
        text={t('autoPostToTwitter')}
        hasToggle={true}
        toggleFn={() => {
          if (userData.twitter) {
            toggleFunction.mutate({
              key: 'auto_post_to_twitter',
              value: !postSettingsState.auto_post_to_twitter
            })
          } else {
            addToast('error', t('error:addYourTwitterAccountInAccountSettings'))
          }
        }}
        toggleActive={postSettingsState.auto_post_to_twitter}
        customClass='singleSetting__autotwitter'
      />

      <SSAccordion
        expanded={true}
        head={<>{t('premiumVideos')}</>}
        items={[
          {
            text: t('noPreview'),
            active: postSettingsState.post_preview_type === 'no-preview',
            toggle: () => {
              setPostSettingsState({
                ...postSettingsState,
                post_preview_type: 'no-preview'
              })
              toggleFunction.mutate({
                key: 'post_preview_type',
                value: 'no-preview'
              })
            }
          },
          {
            text: t('picturePreview'),
            active: postSettingsState.post_preview_type === 'picture',
            toggle: () => {
              setPostSettingsState({
                ...postSettingsState,
                post_preview_type: 'picture'
              })
              toggleFunction.mutate({
                key: 'post_preview_type',
                value: 'picture'
              })
            }
          },
          {
            text: t('videoPreview'),
            active: postSettingsState.post_preview_type === 'video',
            toggle: () => {
              setPostSettingsState({
                ...postSettingsState,
                post_preview_type: 'video'
              })
              toggleFunction.mutate({
                key: 'post_preview_type',
                value: 'video'
              })
            }
          }
        ]}
      />
    </>
  )
}

export default Post
