import { FC, useState } from 'react'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import { useTranslation } from 'react-i18next'
import LayoutHeader from '../../../../../features/LayoutHeader/LayoutHeader'
import WithHeaderSection from '../../../../../layouts/WithHeaderSection/WithHeaderSection'
import {
  getPromoCampaigns,
  updatePromoCampaign,
  deletePromoCampaign
} from '../../../../../services/endpoints/api_subscription'
import SubscriptionCard from '../components/SubscriptionCard'
import { IconDollarCircleArrowsNoShadow, IconDotInCircle } from '../../../../../assets/svg/sprite'
import { useModalContext } from '../../../../../context/modalContext'
import AddPromoCampaign from '../../../../../components/UI/Modal/AddPromoCampaign/AddPromoCampaign'
import { addToast } from '../../../../../components/Common/Toast/Toast'
import StackedAvatar from '../../../../../components/UI/StackedAvatar/StackedAvatar'
import ClaimedUsersModal from '../components/ClaimedUsersModal'
import style from './_promo-campaigns.module.scss'

const PromoCampaigns: FC = () => {
  const { t } = useTranslation()
  const { data, isLoading } = useQuery('promoCampaigns', () => getPromoCampaigns('promo'))
  const queryClient = useQueryClient()
  const modalData = useModalContext()
  const [activeFilter, setActiveFilter] = useState('Active')
  const dateArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const filterTabs = ['Active', 'Disabled', 'Expired']

  const toggleCampaignMutation = useMutation(
    (data: { id: number; index: number; campaignData: any }) => updatePromoCampaign(data.id, data.campaignData),
    {
      onMutate: async (newData: any) => {
        await queryClient.cancelQueries('promoCampaigns')
        const previousQueryData = queryClient.getQueryData('promoCampaigns')
        queryClient.setQueryData('promoCampaigns', (oldData: any) => {
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
      queryClient.invalidateQueries('promoCampaigns')
      addToast('success', 'Successfully deleted')
    },
    onError: () => {
      addToast('error', 'An error occured, please try again')
    }
  })
  return (
    <WithHeaderSection
      headerSection={<LayoutHeader type='basic' title='Promotional Campaigns' section={t('subscriptions')} />}
    >
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
          .filter((campaign: any) => {
            const today = new Date()
            if (activeFilter === 'Active')
              return campaign.active === 1 && today.getTime() < new Date(campaign.expiry_at).getTime()
            if (activeFilter === 'Disabled') return campaign.active === 0
            if (activeFilter === 'Expired') return new Date(campaign.expiry_at).getTime() <= today.getTime()
          })
          .map((campaign: any) => {
            const createdDate = new Date(campaign.created_at)
            const expireDate = new Date(campaign.expiry_at)
            return (
              <SubscriptionCard
                type='card'
                customClass={style.promo_campaign_card}
                key={campaign.id}
                icon={<IconDollarCircleArrowsNoShadow />}
                alwaysExpanded={true}
                selectable={false}
                hideArrow={true}
                isActive={campaign.active === 1}
                switchFn={() =>
                  toggleCampaignMutation.mutate({
                    id: campaign.id,
                    index: data.indexOf(campaign),
                    campaignData: { ...campaign, active: campaign.active === 1 ? 0 : 1 }
                  })
                }
                editFn={() =>
                  modalData.addModal(
                    'Update Promotional Campaign',
                    <AddPromoCampaign isEdit={true} campaign={campaign} />
                  )
                }
                deleteFn={() => deleteCampaignMutation.mutate(campaign.id)}
                name={<div className={style.card_title}>Limited Offer</div>}
                subname={
                  <div className={style.duration}>
                    {campaign.discount}% Off for {campaign.length} Days
                  </div>
                }
                hideEdit={activeFilter === 'Expired'}
                hideToggle={activeFilter === 'Expired'}
                descritpion={
                  <div className={style.description_container}>
                    <div className={style.description_additional_text}>
                      Lorem ipsum dolor sit amet, consec tetur adipiscing elit ipsum dolor sit.
                    </div>
                    <div className={style.description_bottom_area}>
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
                        <span>{campaign.limit} Subscriptions Max</span>
                      </div>

                      <div className={style.description_options}>
                        <div
                          className={style.description_claimed_by}
                          onClick={() =>
                            campaign.used > 0
                              ? modalData.addModal('Trial Claimed By', <ClaimedUsersModal users={campaign.users} />)
                              : null
                          }
                        >
                          <div className={style.description_claimed_by_text}>Claimed by</div>{' '}
                          {campaign.used > 0 ? (
                            <div className={style.stacked_img_container}>
                              <StackedAvatar
                                avatars={campaign.avatars}
                                count={campaign.used}
                                avtarsCount={5}
                                customClass={style.stacked_img}
                              />
                            </div>
                          ) : (
                            <span>{campaign.used} Users</span>
                          )}
                        </div>
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
          name={'Add New Campaign'}
        />
      )}
    </WithHeaderSection>
  )
}

export default PromoCampaigns
