import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import {
  IconDollarCircleArrows,
  IconDollarCircleArrowsNoShadow,
  IconDotInCircle
} from '../../../../../assets/svg/sprite'
import { addToast } from '../../../../../components/Common/Toast/Toast'
import AddPromoCampaign from '../../../../../components/UI/Modal/AddPromoCampaign/AddPromoCampaign'
import StackedAvatar from '../../../../../components/UI/StackedAvatar/StackedAvatar'
import { useModalContext } from '../../../../../context/modalContext'
import LayoutHeader from '../../../../../features/LayoutHeader/LayoutHeader'
import WithHeaderSection from '../../../../../layouts/WithHeaderSection/WithHeaderSection'
import {
  createPromoCampaign,
  deletePromoCampaign,
  getFreeTrialLink,
  getPromoCampaigns,
  updatePromoCampaign
} from '../../../../../services/endpoints/api_subscription'
import ClaimedUsersModal from '../components/ClaimedUsersModal'
import SubscriptionCard from '../components/SubscriptionCard'
import style from './_free-trial.module.scss'

const FreeTrial: FC = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const modalData = useModalContext()
  const dateArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const [activeFilter, setActiveFilter] = useState('Active')
  const filterTabs = ['Active', 'Disabled', 'Expired']

  const [copyLinksLoading, setCopyLinksLoading] = useState<number[]>([])

  const toggleCampaignMutation = useMutation(
    (data: { id: number; index: number; campaignData: any }) => updatePromoCampaign(data.id, data.campaignData),
    {
      onMutate: async (newData: any) => {
        await queryClient.cancelQueries('freeTrials')
        const previousQueryData = queryClient.getQueryData('freeTrials')
        queryClient.setQueryData('freeTrials', (oldData: any) => {
          const newQueryData = oldData
          newQueryData[newData.index] = newData.campaignData
          return newQueryData
        })

        return previousQueryData
      },
      onError: (error, newData, context: any) => {
        queryClient.setQueryData('creators-recent-search', context.previousQueryData)
      }
    }
  )

  const deleteCampaignMutation = useMutation((id: number) => deletePromoCampaign(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('freeTrials')
      addToast('success', 'Successfully deleted')
    },
    onError: () => {
      addToast('error', 'An error occured, please try again')
    }
  })

  const { data, isLoading } = useQuery('freeTrials', () => getPromoCampaigns('trial'))

  const copyFreeTrialLink = (id: number) => {
    setCopyLinksLoading((prevState: number[]) => [...prevState, id])
    getFreeTrialLink(id).then((resp: { link: string }) => {
      navigator.clipboard.writeText(resp.link)
      addToast('success', 'Successfully copied')
      setCopyLinksLoading((prevState: number[]) => prevState.filter((item: number) => item !== id))
    })
  }

  return (
    <WithHeaderSection headerSection={<LayoutHeader type='basic' title='Free Trials' section={t('subscriptions')} />}>
      <div className={style.filter_tabs}>
        {filterTabs.map((tab: string) => (
          <div
            key={tab}
            className={`${style.filter_tab} ${activeFilter === tab ? style.filter_tab_active : ''}`}
            onClick={() => setActiveFilter(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
      {isLoading && <div className='loader'></div>}

      {!isLoading &&
        data &&
        data
          .filter((trial: any) => {
            const today = new Date()
            if (activeFilter === 'Active')
              return trial.active === 1 && today.getTime() < new Date(trial.expiry_at).getTime()
            if (activeFilter === 'Disabled') return trial.active === 0
            if (activeFilter === 'Expired') return new Date(trial.expiry_at).getTime() <= today.getTime()
          })
          .map((trial: any) => {
            const createdDate = new Date(trial.created_at)
            const expireDate = new Date(trial.expiry_at)
            return (
              <SubscriptionCard
                type='card'
                key={trial.id}
                icon={<IconDollarCircleArrowsNoShadow />}
                alwaysExpanded={true}
                selectable={false}
                hideArrow={true}
                isActive={trial.active === 1}
                switchFn={() =>
                  toggleCampaignMutation.mutate({
                    id: trial.id,
                    index: data.indexOf(trial),
                    campaignData: { ...trial, active: trial.active === 1 ? 0 : 1 }
                  })
                }
                editFn={() =>
                  modalData.addModal('Update Promotional Campaign', <AddPromoCampaign isEdit={true} campaign={trial} />)
                }
                deleteFn={() => deleteCampaignMutation.mutate(trial.id)}
                name={<div className={style.card_title}>Trial</div>}
                subname={
                  <div className={style.duration}>
                    Duration <span>{trial.duration} Days</span>
                  </div>
                }
                hideEdit={activeFilter === 'Expired'}
                hideToggle={activeFilter === 'Expired'}
                descritpion={
                  <div className={style.description_container}>
                    <div className={style.description_title}>Details</div>

                    <div className={style.description_date_container}>
                      <div className={style.description_date}>
                        Created{' '}
                        <span>
                          {dateArray[createdDate.getMonth()]} {createdDate.getDate()} {createdDate.getFullYear()}
                        </span>
                      </div>
                      <div className={style.description_date}>
                        Expires{' '}
                        <span>
                          {dateArray[expireDate.getMonth()]} {expireDate.getDate()} {expireDate.getFullYear()}
                        </span>
                      </div>
                    </div>

                    <div className={style.description_limit}>
                      <IconDotInCircle />
                      <span>{trial.limit} Subscriptions Max</span>
                    </div>

                    <div className={style.description_options}>
                      <button
                        className={`${style.description_copy_link} ${
                          copyLinksLoading.indexOf(trial.id) >= 0 ? style.description_copy_link_loading : ''
                        }`}
                        onClick={() => copyFreeTrialLink(trial.id)}
                      >
                        Copy Link
                      </button>

                      <div
                        className={style.description_claimed_by}
                        onClick={() =>
                          trial.used > 0
                            ? modalData.addModal('Trial Claimed By', <ClaimedUsersModal users={trial.users} />)
                            : null
                        }
                      >
                        <div className={style.description_claimed_by_text}>Claimed by</div>{' '}
                        {trial.used > 0 ? (
                          <div className={style.stacked_img_container}>
                            <StackedAvatar
                              avatars={trial.avatars}
                              count={trial.used}
                              avtarsCount={5}
                              customClass={style.stacked_img}
                            />
                          </div>
                        ) : (
                          <span>{trial.used} Users</span>
                        )}
                      </div>
                    </div>
                  </div>
                }
              />
            )
          })}
      {!isLoading && (
        <SubscriptionCard
          clickFn={() => modalData.addModal('Promotional Campaign', <AddPromoCampaign />)}
          name='Add New Trial'
        />
      )}
    </WithHeaderSection>
  )
}

export default FreeTrial
