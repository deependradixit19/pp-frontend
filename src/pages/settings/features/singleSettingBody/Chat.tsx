import { FC } from 'react'
import { useQueryClient, useMutation } from 'react-query'
import { useTranslation } from 'react-i18next'
import { useUserContext } from '../../../../context/userContext'
import { addToast } from '../../../../components/Common/Toast/Toast'
import { putChatSettings } from '../../../../services/endpoints/settings'

import ActionCard from '../../../../features/ActionCard/ActionCard'
import SwitchButton from '../../../../components/Common/SwitchButton/SwitchButton'
import SSAccordion from '../SSAccordion'

const Chat: FC = () => {
  const userData = useUserContext()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const chatSettingsMutation = useMutation((params: { [key: string]: boolean | string }) => putChatSettings(params), {
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

  return (
    <>
      {userData.role === 'model' && (
        <>
          <ActionCard
            text={t('welcomeMessage')}
            description={t('setUpAnAutoMessageToYourNewSubscribers')}
            hasToggle={true}
            toggleActive={userData.chat_settings.welcome_message_enabled}
            toggleFn={() =>
              chatSettingsMutation.mutate({
                welcome_message_enabled: !userData.chat_settings.welcome_message_enabled
              })
            }
            link='/settings/general/chat-settings/welcome-message'
            hasArrow={true}
          />

          <SSAccordion
            expanded={true}
            customClass='chat-ssacrodion'
            head={
              <>
                <span>Premium Videos</span>
              </>
            }
            items={[
              {
                text: 'No Preview',
                active: userData?.chat_settings?.video_preview_type === 'no-preview',
                toggle: () =>
                  chatSettingsMutation.mutate({
                    video_preview_type: 'no-preview'
                  })
              },
              {
                text: 'Picture Preview',
                active: userData?.chat_settings?.video_preview_type === 'picture-preview',
                toggle: () =>
                  chatSettingsMutation.mutate({
                    video_preview_type: 'picture-preview'
                  })
              },
              {
                text: 'Video Preview',
                active: userData?.chat_settings?.video_preview_type === 'video-preview',
                toggle: () =>
                  chatSettingsMutation.mutate({
                    video_preview_type: 'video-preview'
                  })
              }
            ]}
          />
        </>
      )}
      <SSAccordion
        expanded={userData?.chat_settings?.favorite_contacts || false}
        customClass={`chat-ssacrodion chat-ssacrodion-close ${
          userData?.chat_settings?.favorite_contacts && 'chat-ssacrodion-open'
        }`}
        customExpandClass={true}
        head={
          <>
            <span>{t('favoriteContacts')}</span>
            <SwitchButton
              active={userData?.chat_settings?.favorite_contacts || false}
              toggle={() =>
                chatSettingsMutation.mutate({
                  favorite_contacts: !userData.chat_settings.favorite_contacts
                })
              }
            />
          </>
        }
        items={[
          {
            text: t('mostMessages'),
            active: userData?.chat_settings?.most_messages || false,
            toggle: () =>
              chatSettingsMutation.mutate({
                most_messages: true,
                most_messages_purchases: false,
                latest_subscribed: false,
                online: false
              })
          },
          {
            text: t('mostMessagePurchases'),
            active: userData?.chat_settings?.most_messages_purchases || false,
            toggle: () =>
              chatSettingsMutation.mutate({
                most_messages: false,
                most_messages_purchases: true,
                latest_subscribed: false,
                online: false
              })
          },
          {
            text: t('latestSubscribed'),
            active: userData?.chat_settings?.latest_subscribed || false,
            toggle: () =>
              chatSettingsMutation.mutate({
                most_messages: false,
                most_messages_purchases: false,
                latest_subscribed: true,
                online: false
              })
          },
          {
            text: t('online'),
            active: userData?.chat_settings?.online || false,
            toggle: () =>
              chatSettingsMutation.mutate({
                most_messages: false,
                most_messages_purchases: false,
                latest_subscribed: false,
                online: true
              })
          }
        ]}
      />
    </>
  )
}

export default Chat
