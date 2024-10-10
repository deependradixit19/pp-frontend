import React, { FC } from 'react'
import { useQuery } from 'react-query'
import axiosInstance from '../../../../services/http/axiosInstance'

// Services
import { useUserContext } from '../../../../context/userContext'
import { StoryActionType } from '../../../../types/types'
// Componeners
import { IconVolumeFill, IconVolumeMutedFill } from '../../../../assets/svg/sprite'
import GroupCircles from '../../../../components/UI/GroupCircles/GroupCircles'
import StoryMessage from '../StoryMessage/StoryMessage'
// Styling
import styles from './StoryFooter.module.scss'
import { IGroupElement } from '../../../../types/interfaces/ITypes'

// MockData for Group circles
const getMockGroupElements = async () => {
  const { data } = await axiosInstance({
    method: 'GET',
    url: 'https://my.api.mockaroo.com/group_element.json?key=03d713c0',
    baseURL: ''
  })

  return data
}

const StoryFooter: FC<{
  role: 'fan' | 'model'
  storyUserId: number
  avatarsList?: {
    avatar: {
      created_at: string
      id: number
      url: string
    }
  }[]
  setAction: (action: StoryActionType) => any
  setIsPaused: (x: boolean) => any
}> = ({ avatarsList, role, storyUserId, setAction, setIsPaused }) => {
  const userData = useUserContext()

  const IGroupElementConstructor = (): IGroupElement => {
    let returnValue: IGroupElement = {
      avatars: [],
      count: 0
    }
    if (avatarsList && avatarsList.length) {
      returnValue.avatars = avatarsList.map(element => element.avatar.url)
      returnValue.count = avatarsList.length
    }

    return returnValue
  }
  return (
    <div className={styles.storyFooterContainer}>
      <div
        className={styles.toggleMute}
        onClick={() => {
          userData.setIsPlayerMuted((prevValue: boolean) => !prevValue)
          setAction && setAction('longPress')
          setIsPaused(false)
        }}
      >
        {userData.isPlayerMuted ? <IconVolumeMutedFill color='#FFFFFF' /> : <IconVolumeFill color='#FFFFFF' />}
      </div>
      {Boolean(storyUserId === userData.id && avatarsList && avatarsList.length > 0) && (
        <GroupCircles group={IGroupElementConstructor()} size='36' />
      )}
      {role === 'fan' && <StoryMessage recipient={storyUserId} setAction={setAction} setIsPaused={setIsPaused} />}
    </div>
  )
}

export default StoryFooter
