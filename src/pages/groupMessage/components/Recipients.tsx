import { FC } from 'react'
import { useUserContext } from '../../../context/userContext'

import AvatarHolder from '../../../components/UI/AvatarHolder/AvatarHolder'
import GroupsDropdown from '../../../features/GroupsDropdown/GroupsDropdown'

import bg1 from '../../../assets/images/home/bg1.png'

const Recipients: FC<{
  audience: any
  setAudience: (val: any) => void
}> = ({ audience, setAudience }) => {
  const userData = useUserContext()

  return (
    <div className='groupMessage__targets'>
      <div className='groupMessage__targets__avatar'>
        <AvatarHolder
          img={userData.cropped_avatar.url || userData.avatar.url || bg1}
          size='50'
          hasStory={true}
          storyRead={false}
        />
      </div>
      <div className='groupMessage__targets__groups'>
        <GroupsDropdown isEdit={false} apply={(val: any) => setAudience(val)} preview={audience} />
      </div>
    </div>
  )
}

export default Recipients
