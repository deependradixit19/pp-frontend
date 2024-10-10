import { FC, useState } from 'react'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { useUserContext } from '../../../context/userContext'
import AvatarHolder from '../../../components/UI/AvatarHolder/AvatarHolder'
import { IconTwoPeopleOutline } from '../../../assets/svg/sprite'
import avatarPlaceholder from '../../../assets/images/user_placeholder.png'
import WhoAreYouWritingModal from './WhoAreYouWritingToModal/WhoAreYouWritingModal'
import { getFansGroups, getUsersFromFansGroup } from '../../../services/endpoints/fans_groups'
import ModalWrapper from '../../../features/ModalWrapper/ModalWrapper'
import StackedAvatar from '../../../components/UI/StackedAvatar/StackedAvatar'
import { getSubscriptionModels } from '../../../services/endpoints/api_subscription'

const Recipients: FC<{
  audience: any
  setAudience: (val: any) => void
}> = ({ audience, setAudience }) => {
  const userData = useUserContext()
  const [groupsModalOpen, setGroupsModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState({
    name: 'Who are you writing to ?',
    avatars: []
  })
  const { data } = useQuery('fans-groups', getFansGroups)
  const allUsersId = data?.data && data?.data[0]?.id ? data.data[0]?.id : null
  const { data: allUsersData } = useQuery('allUsersGroup', () => getUsersFromFansGroup(allUsersId, {}), {
    enabled: !!allUsersId && userData.role === 'model'
  })

  const { data: subscriptionsData } = useQuery('user-subscriptions', getSubscriptionModels, {
    enabled: userData.role === 'fan'
  })

  const { t } = useTranslation()

  return (
    <div className='newMessage__targets'>
      <div className='newMessage__targets__avatar'>
        <AvatarHolder
          img={userData?.cropped_avatar?.url || userData?.avatar?.url || avatarPlaceholder}
          size='50'
          hasStory={true}
          storyRead={false}
        />
      </div>
      <div className='newMessage__targets__groups' onClick={() => setGroupsModalOpen(true)}>
        <div className='newMessage__targets__groups__icon'>
          <IconTwoPeopleOutline color='#ffffff' />
        </div>
        <div className='newMessage__targets__groups__text'>{selectedGroup.name}</div>
        {selectedGroup.avatars && !!selectedGroup.avatars.length && <StackedAvatar avatars={selectedGroup.avatars} />}
      </div>
      <ModalWrapper
        open={groupsModalOpen}
        setOpen={setGroupsModalOpen}
        customClass={`who-are-you-writing-to-modal-wrapper ${
          userData.role === 'fan' ? 'who-are-you-writing-to-modal-wrapper-fan' : ''
        }`}
      >
        <WhoAreYouWritingModal
          closeFn={() => setGroupsModalOpen(false)}
          allUsersData={
            userData.role === 'model' ? (allUsersData ? allUsersData : []) : subscriptionsData ? subscriptionsData : []
          }
          groups={data?.data || []}
          applyFn={(val: any, val2: any) => {
            if (val) {
              setAudience(val)
              setSelectedGroup({ name: val.name, avatars: val.avatars })
            } else if (val2.length > 0) {
              const avatarsArray = val2.map((user: any) => user.avatar.url)
              setAudience(val2)
              setSelectedGroup({
                name: 'Selected Users',
                avatars: avatarsArray
              })
            } else {
              setAudience(val2)
              setSelectedGroup({
                name: 'Who are you writing to?',
                avatars: []
              })
            }
            setGroupsModalOpen(false)
          }}
        />
      </ModalWrapper>
    </div>
  )
}

export default Recipients
