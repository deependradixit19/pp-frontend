import { FC, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useUserContext } from '../../../context/userContext'

import bg1 from '../../../assets/images/home/bg1.png'
import AvatarHolder from '../../../components/UI/AvatarHolder/AvatarHolder'

import GroupsDropdown from '../../../features/GroupsDropdown/GroupsDropdown'
import { IGroup } from '../../../types/interfaces/ITypes'
import ActionCard from '../../../features/ActionCard/ActionCard'
import { Icons } from '../../../helpers/icons'

const PostVisibility: FC<{
  isEdit: boolean
  audience: IGroup[]
  setAudience: any
}> = ({ audience, setAudience, isEdit }) => {
  const userData = useUserContext()
  const { t } = useTranslation()

  const groupsDropdownRef = useRef<any>()
  return (
    <div className='newpost__visibility'>
      <div className='newpost__user'>
        <AvatarHolder
          img={userData?.cropped_avatar?.url || userData?.avatar?.url || bg1}
          size='50'
          hasStory={true}
          storyRead={false}
        />
      </div>
      <div className='newpost__visibility__select'>
        {/* <GroupsDropdown
          apply={(val: number[]) => {
            setAudience(val);
          }}
          preview={audience}
          isEdit={isEdit}
        /> */}
        <GroupsDropdown
          apply={(selectedValue: IGroup[]) => setAudience(selectedValue)}
          headText={t('selectAudience')}
          preview={audience}
          isEdit={isEdit}
          hasCloseButton={true}
          ref={groupsDropdownRef}
        >
          {/* <ActionCard
            icon={Icons.profile_lock}
            text={t('whoCanSeeYourPosts')}
            description={t('Fans')}
            hasArrow={true}
            // clickFn={() => groupsDropdownRef.current.openDropdown()}
          /> */}
        </GroupsDropdown>
      </div>
    </div>
  )
}

export default PostVisibility
