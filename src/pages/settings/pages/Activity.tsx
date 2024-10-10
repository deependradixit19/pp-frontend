import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from 'react-query'
import ActionCard from '../../../features/ActionCard/ActionCard'
import LayoutHeader from '../../../features/LayoutHeader/LayoutHeader'
import WithHeaderSection from '../../../layouts/WithHeaderSection/WithHeaderSection'
import * as spriteIcons from '../../../assets/svg/sprite'
import { useUserContext } from '../../../context/userContext'
import { setActivity } from '../../../services/endpoints/settings'

const Activity: FC = () => {
  const { t } = useTranslation()
  const userData = useUserContext()

  const queryClient = useQueryClient()

  const activitySettingsMutation = useMutation(
    (data: { showLikeHistory: boolean; showWatchedHistory: boolean }) => setActivity(data),
    {
      onMutate: async data => {
        await queryClient.cancelQueries('loggedProfile')
        const previousQueryData = queryClient.getQueryData('loggedProfile')
        queryClient.setQueryData('loggedProfile', (oldData: any) => {
          return {
            ...oldData,
            show_liked_history: data.showLikeHistory,
            show_watched_history: data.showWatchedHistory
          }
        })
        return { previousQueryData }
      },
      onError: (error, newData, context: any) => {
        queryClient.setQueryData('loggedProfile', context.previousQueryData)
      }
    }
  )

  return (
    <WithHeaderSection
      headerSection={<LayoutHeader type='basic' section={t('general')} title={t('activitySettings')} />}
    >
      <ActionCard
        text={t('showLikeHistory')}
        hasToggle={true}
        toggleActive={userData.show_liked_history}
        toggleFn={() =>
          activitySettingsMutation.mutate({
            showLikeHistory: !userData.show_liked_history,
            showWatchedHistory: userData.show_watched_history
          })
        }
        icon={<spriteIcons.IconHeartHole />}
        absFix={true}
      />
      <ActionCard
        text={t('showWatchHistory')}
        hasToggle={true}
        toggleActive={userData.show_watched_history}
        toggleFn={() =>
          activitySettingsMutation.mutate({
            showLikeHistory: userData.show_liked_history,
            showWatchedHistory: !userData.show_watched_history
          })
        }
        icon={<spriteIcons.IconPlayButtonClock />}
        absFix={true}
      />
    </WithHeaderSection>
  )
}

export default Activity
