import { FC } from 'react'
import AudioMessage from '../../../../../../components/UI/AudioMessage/AudioMessage'

import styles from './mediaItemAudio.module.scss'

interface Props {
  url: string
}

const MediaItemAudio: FC<Props> = ({ url }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <AudioMessage audioBlob={url} audioReady={true} waveColor='gray' waveBackgroundColor='transparent' />
      </div>
    </div>
  )
}

export default MediaItemAudio
