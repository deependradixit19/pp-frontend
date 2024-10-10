import React, { FC, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ReactPlayer from 'react-player'
// Services
import { useModalContext } from '../../../../context/modalContext'
import { useUserContext } from '../../../../context/userContext'
import { IProgress, ProgressBar } from '../../../../features/Post/components/PostStory/PostStory'
import PostPoll from '../../../../features/Post/components/PostPoll'
import { IProfile } from '../../../../types/interfaces/IProfile'
import { useEventDefiner } from '../../../../helpers/hooks'
import { Story, StoryActionType } from '../../../../types/types'
import { likeStory } from '../../../../services/endpoints/story'
// Components
import TipModal from '../../../../components/UI/Modal/Tip/TipModal'
import StoryAction from '../StoryAction/StoryAction'
import StoryFooter from '../StoryFooter/StoryFooter'
import StoryHeader from '../StoryHeader/StoryHeader'
import StoryText from '../StoryText/StoryText'
// Styling
import styles from './StoryFullscreen.module.scss'

interface IStoryFullscreenProps {
  story: Story
  user: IProfile
  progressList: IProgress[]
  isPaused: boolean
  activeStoryIndex: number
  withCloseButton: boolean
  setIsPaused: (x: boolean) => any
  setAction: (action: StoryActionType) => any
  onBack?: () => any
  onForward?: () => any
  onSwipeLeft?: () => any
  onSwipeRight?: () => any
  onAnswerPoll: (params: { pollId: number; answer?: string | number | null; answerId?: number }) => any
}

const StoryFullscreen: FC<IStoryFullscreenProps> = ({
  story,
  user,
  progressList,
  isPaused,
  activeStoryIndex,
  withCloseButton = true,
  setIsPaused,
  setAction,
  onBack,
  onForward,
  onSwipeLeft,
  onSwipeRight,
  onAnswerPoll
}) => {
  const { t } = useTranslation()
  const userData = useUserContext()
  const modalData = useModalContext()
  const profileData = useUserContext()
  const { action: storyAction, handlers: storyHandlers } = useEventDefiner({
    onLongPressStart: () => {
      setAction && setAction(null)
      setIsPaused(true)
    },
    onLongPressEnd: () => {
      setAction && setAction('longPress')
      setIsPaused(false)
    },
    onSwipeLeft: () => {
      setAction && setAction('swipeLeft')
      setIsPaused(false)
      onSwipeLeft && onSwipeLeft()
    },
    onSwiperight() {
      setAction && setAction('swipeRight')
      setIsPaused(false)
      onSwipeRight && onSwipeRight()
    }
  })
  const { handlers: leftHandlers } = useEventDefiner({
    onClick: () => {
      setAction && setAction('click')
      setIsPaused(false)
      onBack && onBack()
    }
  })

  const { handlers: rightHandlers } = useEventDefiner({
    onClick: () => {
      setAction && setAction('click')
      setIsPaused(false)
      onForward && onForward()
    }
  })

  const [isLiked, setIsLiked] = useState<boolean>(false)

  useEffect(() => {
    setIsLiked(story.liked)
  }, [story])

  const addTip = ({ modelId, avatarSrc }: { modelId: number; avatarSrc: string }) => {
    setAction && setAction(null)
    setIsPaused(true)
    modalData.addModal(
      t('tipAmount'),
      <TipModal
        tipType='post'
        modelData={{
          postId: story.id,
          modelId,
          avatarSrc
        }}
        onClose={() => {
          setAction && setAction('longPress')
          setIsPaused(false)
        }}
      />
    )
  }

  return (
    <div {...storyHandlers}>
      <div {...leftHandlers} className={styles.goLeft}></div>
      <div {...rightHandlers} className={styles.goRight}></div>
      <ProgressBar progressList={progressList} activeIndex={activeStoryIndex} active={!isPaused} />
      <StoryHeader
        avatar={user.avatar.url}
        username={user.username}
        date={new Date(story.created_at)}
        withCloseButton={withCloseButton}
      />
      <div className={styles.actionsContainer}>
        <StoryAction
          icon={profileData.role === 'fan' && isLiked ? 'HeartFill' : 'HeartOutline'}
          location='story'
          text={profileData.id === story.user_id && story.statistics ? story.statistics.likes.length.toString() : ''}
          onClickAction={() => {
            if (profileData.id !== story.user_id) {
              likeStory(story.id)
              setIsLiked(prevValue => !prevValue)
            }

            setAction && setAction('longPress')
            setIsPaused(false)
          }}
        />
        {Boolean(profileData.id === user.id && story.statistics) && (
          <StoryAction icon='PostStats' text={`$${story.statistics?.tipped}`} location='story' />
        )}
        {profileData.role === 'fan' && (
          <StoryAction
            icon='LiveCircleTip'
            text='TIP'
            location='story'
            onClickAction={() => addTip({ modelId: user.id, avatarSrc: user.avatar.url })}
          />
        )}
      </div>
      {Boolean(story && !story.image_src && !story.video_src) && (
        <div
          className={styles.container}
          style={{
            backgroundImage:
              story.background_color ||
              'linear-gradient(166deg, rgb(233, 28, 121) 0%, rgb(163, 104, 144) 46.88%, rgb(110, 42, 143) 100%)'
          }}
        />
      )}
      {Boolean(story && story.image_src) && (
        <div
          className={styles.background}
          style={{
            backgroundImage: `url(${story.image_src})`
          }}
        >
          <div
            className={styles.container}
            style={{
              backgroundImage: `url(${story.image_src})`
            }}
          />
        </div>
      )}
      {Boolean(story && story.video_src) && (
        <div
          className={styles.background}
          style={{
            backgroundColor: 'black'
          }}
        >
          <ReactPlayer
            width='100%'
            height='100%'
            url={story.video_src ? story.video_src : ''}
            controls={false}
            volume={1}
            muted={profileData.isPlayerMuted}
            playing={Boolean(!isPaused && story.video_src)}
          />
        </div>
      )}
      {Boolean(story && story.poll) && (
        <div className={styles.pollContainer} onClick={e => e.stopPropagation()}>
          <PostPoll
            pollData={story.poll}
            setAnswer={ans => {
              onAnswerPoll(ans)
              setAction && setAction('longPress')
              setIsPaused(false)
            }}
            isMyPost={user.id === userData.id}
          />
        </div>
      )}
      {Boolean(story && story.text && story.text.value) && (
        <div className={styles.textContainer}>
          <StoryText
            text={story && story.text ? story.text.value : ''}
            coordinates={{
              x: story && story.text ? story.text.x : 0,
              y: story && story.text ? story.text.y : 0
            }}
          />
        </div>
      )}
      <StoryFooter
        role={user.role === 'model' ? 'model' : 'fan'}
        avatarsList={story.statistics ? story.statistics.views : []}
        storyUserId={user.id}
        setAction={setAction}
        setIsPaused={setIsPaused}
      />
    </div>
  )
}

export default StoryFullscreen
