import { FC } from 'react'
import { IconChatOutline, IconEdit, IconPlusInCircleDashed } from '../../../../assets/svg/sprite'
import { addToast } from '../../../Common/Toast/Toast'
import style from './_share-modal.module.scss'

const ShareModal: FC<{
  storyDisabled?: boolean
  clickFns: { newPost: () => void; newTabPost: () => void; message: () => void; story: () => void }
}> = ({ storyDisabled = false, clickFns }) => {
  return (
    <div className={style.container}>
      <div className={style.share_item} onClick={clickFns.newPost}>
        <IconEdit color='#2894ff' />
        Share to New Post
      </div>
      <div className={style.share_item} onClick={clickFns.newTabPost}>
        <IconEdit color='#2894ff' />
        Share to Post in New Tab
      </div>
      <div className={style.share_item} onClick={clickFns.message}>
        <IconChatOutline color='#2894ff' />
        Share to New Message
      </div>
      <div
        className={`${style.share_item} ${storyDisabled ? style.share_story_disabled : ''}`}
        onClick={
          storyDisabled ? () => addToast('error', 'You can only share one media file to story.') : clickFns.story
        }
      >
        <IconPlusInCircleDashed color={storyDisabled ? '#AFAFAF' : '#2894ff'} />
        Share to Your Story
      </div>
    </div>
  )
}

export default ShareModal
