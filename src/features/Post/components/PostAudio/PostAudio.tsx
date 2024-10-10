import { FC } from 'react'
import AudioMessage from '../../../../components/UI/AudioMessage/AudioMessage'

interface PostWithAudioProps {
  url: string
  updateSelectedPost: () => void
}

const PostAudio: FC<PostWithAudioProps> = ({ url, updateSelectedPost }) => {
  return (
    <div className={`post__files__file post__files__file--sound`} onClick={updateSelectedPost}>
      <div className='post-sound-container'>
        <AudioMessage audioBlob={url} audioReady={true} waveColor='gray' waveBackgroundColor='transparent' />
      </div>
    </div>
  )
}

export default PostAudio
