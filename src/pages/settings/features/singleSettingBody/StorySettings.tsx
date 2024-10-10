import { FC, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import { Icons } from '../../../../helpers/icons'
import ActionCard from '../../../../features/ActionCard/ActionCard'
import { useUserContext } from '../../../../context/userContext'
import { getOtherProfileWithGroups, putStorySettings } from '../../../../services/endpoints/settings'
import { addToast } from '../../../../components/Common/Toast/Toast'
import GroupsDropdown from '../../../../features/GroupsDropdown/GroupsDropdown'
import { IGroup } from '../../../../types/interfaces/ITypes'
import { getProfileGroups } from '../../../../services/endpoints/social'

const StorySettings: FC<{ page: string }> = ({ page }) => {
  const [saveStoriesToSharedMedia, setSaveStoriesToSharedMedia] = useState(true)
  const [currentSetting, setCurrentSetting] = useState<number[]>([1])
  const [selectedGroups, setSelectedGroups] = useState<IGroup[]>([
    {
      id: 1,
      name: 'All',
      users: [],
      date_added: new Date('2022-08-04T13:06:03.000000Z'),
      default: 1,
      primary: 0
    }
  ])
  const navigate = useNavigate()
  const userData = useUserContext()

  const queryClient = useQueryClient()

  const groupsDropdownRef = useRef<any>()

  const { t } = useTranslation()

  const { data: groups, isLoading: isGroupsLoading } = useQuery('allGroups', getProfileGroups, {
    refetchOnWindowFocus: false,
    staleTime: 5000
  })

  const { data: otherProfileWithGroups, isLoading: isOtherProfileWithGroupsLoading } = useQuery(
    'otherProfileWithGroups',
    () => getOtherProfileWithGroups(userData.id),
    {
      refetchOnWindowFocus: false,
      staleTime: 5000
    }
  )

  const putSaveStoriesToSharedMedia = useMutation(
    () =>
      putStorySettings({
        save_stories_to_shared_media: !saveStoriesToSharedMedia
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('loggedProfile')
      },
      onError: err => {
        addToast('error', 'Something went wrong')
      }
    }
  )

  const putStoryVisibilitySetting = useMutation(putStorySettings, {
    onSuccess: () => {
      queryClient.invalidateQueries('loggedProfile')
      queryClient.invalidateQueries('otherProfileWithGroups')
    },
    onError: err => {
      addToast('error', t('error:errorSomethingWentWrong'))
    }
  })

  const findSelectedGroupsFromIds = (): IGroup[] => {
    let tmpSelected: IGroup[] = []
    if (!isGroupsLoading && !isOtherProfileWithGroupsLoading) {
      groups.data.forEach((profileGroup: IGroup) => {
        otherProfileWithGroups.data.show_stories.forEach((userGroupId: number) => {
          if (profileGroup.id === userGroupId) {
            tmpSelected.push(profileGroup)
          }
        })
      })
      if (tmpSelected.length === 0) tmpSelected.push(groups?.data[0]?.id)
    }

    return tmpSelected
  }

  const onDropdownApply = (dropdownSelection: IGroup[]): void => {
    const selectedGroupIds = dropdownSelection.map(value => value.id)
    const { mutate } = putStoryVisibilitySetting
    setCurrentSetting(selectedGroupIds)

    mutate({ can_see_stories: selectedGroupIds })
  }

  useEffect(() => {
    if (userData) {
      setSaveStoriesToSharedMedia(userData.save_stories_to_shared_media || false)

      const tempSelectedGroups = findSelectedGroupsFromIds()
      tempSelectedGroups.length && setSelectedGroups(tempSelectedGroups)
    }
  }, [isOtherProfileWithGroupsLoading, isGroupsLoading])

  const renderImgCircles = (imgArray: [] | {}[]): JSX.Element | JSX.Element[] => {
    return (
      <div className='stacked-img-circles'>
        {imgArray.map((img, index) => {
          return (
            index < 4 && (
              <div key={index} className='stacked-img'>
                <img src={`${img}`} alt='circle' />
              </div>
            )
          )
        })}
        {imgArray.length > 4 && (
          <div className='stacked-img'>
            <div className='stacked-img-placeholder'>
              {imgArray.length - 4 <= 999
                ? `+${imgArray.length - 4}`
                : imgArray.length - 4 < 999500
                ? `+${(Math.abs(imgArray.length - 4) / 1000).toFixed()}K`
                : imgArray.length - 4 >= 999500 && `+${(Math.abs(imgArray.length - 4) / 1000000).toFixed()}M`}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (page === 'story-settings-main') {
    return (
      <>
        <GroupsDropdown
          apply={(selectedValue: IGroup[]) => onDropdownApply(selectedValue)}
          headText={t('selectAudience')}
          preview={selectedGroups}
          isEdit={true}
          hasCloseButton={true}
          ref={groupsDropdownRef}
        >
          <ActionCard
            icon={Icons.profile_lock}
            text={t('whoCanSeeYourPosts')}
            description={t('Fans')}
            hasArrow={true}
            clickFn={() => groupsDropdownRef.current.openDropdown()}
          />
        </GroupsDropdown>
        <ActionCard
          text={t('saveStoriesToSharedMedia')}
          hasToggle={true}
          toggleActive={saveStoriesToSharedMedia}
          toggleFn={() => {
            setSaveStoriesToSharedMedia(!saveStoriesToSharedMedia)
            putSaveStoriesToSharedMedia.mutate()
          }}
        />
      </>
    )
  } else {
    return <div>Page not found</div>
  }
}

export default StorySettings
