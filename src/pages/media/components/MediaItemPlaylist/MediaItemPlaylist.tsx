import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { IconThreeDots } from '../../../../assets/svg/sprite'
import { IPlaylist } from '../../../../types/interfaces/ITypes'

import MediaItemSidebar from '../MediaItemSidebar/MediaItemSidebar'
import styles from './mediaItemPlaylist.module.scss'

interface Props {
  playlistData: IPlaylist
  active: boolean
  setIsActive: () => void
  customClass?: string
}

const MediaItemPlaylist: FC<Props> = ({
  playlistData,
  active,
  // isOpen,
  // setIsOpen,
  setIsActive,
  customClass
}) => {
  const { t } = useTranslation()
  return (
    <div onClick={setIsActive} className={`${styles.wrapper} ${customClass ?? ''}`}>
      <div className={`${styles.media} ${active ? styles.active : ''}`}>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>{playlistData.playlist_info.playlist_name}</div>
          {!playlistData.media_counters.photo_sum &&
            !playlistData.media_counters.video_sum &&
            !playlistData.media_counters.sound_sum && <div className={styles.subtitle}>{t('thisPlaylistIsEmpty')}</div>}
        </div>
      </div>
    </div>
  )
}

export default MediaItemPlaylist
