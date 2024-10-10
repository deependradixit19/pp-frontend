import React, { FC, useMemo } from 'react'

import {
  IconChatOutline,
  IconHeartFill,
  IconHeartOutline,
  IconLockFill,
  IconPostStats,
  IconLiveCircleTip
} from '../../../../assets/svg/sprite'

import styles from './StoryAction.module.scss'

type TypeАctionIcon = 'ChatOutline' | 'HeartFill' | 'HeartOutline' | 'LockFill' | 'PostStats' | 'LiveCircleTip'
type TypeLocation = 'story' | 'post'

export interface IStoryActionProps {
  icon: TypeАctionIcon
  text?: string
  onClickAction?: Function
  location?: TypeLocation
}

const StoryAction: FC<IStoryActionProps> = ({ icon, text, onClickAction, location = 'post' }) => {
  const renderIconComponent = (icon: TypeАctionIcon): JSX.Element => {
    switch (icon) {
      // case 'ChatOutline':
      //   return <IconChatOutline color="#FFFFFF" />;
      case 'HeartFill':
        return <IconHeartFill />
      case 'HeartOutline':
        return <IconHeartOutline color='#FFFFFF' />
      case 'LockFill':
        return <IconLockFill />
      case 'ChatOutline':
        return <IconChatOutline color='#FFFFFF' />
      case 'PostStats':
        return <IconPostStats color='#FFFFFF' />
      case 'LiveCircleTip':
        return <IconLiveCircleTip color='#FFFFFF' />

      default:
        return <IconHeartOutline />
    }
  }

  const memoizedClass = useMemo(() => {
    if (location === 'story') return styles.action_story
    return styles.action_post
  }, [location])

  return (
    <div
      className={memoizedClass}
      onClick={event => {
        event.stopPropagation()
        onClickAction && onClickAction()
      }}
    >
      <div>{renderIconComponent(icon)}</div>
      {!!text && <p>{text}</p>}
    </div>
  )
}

export default StoryAction
