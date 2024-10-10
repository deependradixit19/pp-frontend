import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import {
  IconImageOutlineCounter,
  IconPlaylist,
  IconPlus,
  IconPlusInBox,
  IconVideoOutlineCounter
} from '../../../../assets/svg/sprite'
import ActionCard from '../../../../features/ActionCard/ActionCard'
import { getPlaylists } from '../../../../services/endpoints/media'
import { IPlaylist } from '../../../../types/interfaces/ITypes'
import Button from '../../Buttons/Button'
import styles from './addToPlaylist.module.scss'

interface Props {
  closeFn: () => void
  confirmFn: () => void
  addNew: () => void
  selectedPlaylist: number
  setSelectedPlaylist: (val: number) => void
}

interface IMediaCounter {
  photoCount?: number
  videoCount?: number
  audioCount?: number
}

const MediaCounter: FC<IMediaCounter> = ({ photoCount, videoCount, audioCount }) => {
  return (
    <div className={styles.counterWrapper}>
      {!!photoCount && (
        <div className={styles.info}>
          <IconImageOutlineCounter color='#828C94' />
          <div className={styles.count}>
            <p>{photoCount}</p>
          </div>
        </div>
      )}
      {!!videoCount && (
        <div className={styles.info}>
          <IconVideoOutlineCounter color='#828C94' />
          <div className={styles.count}>
            <p>{videoCount}</p>
          </div>
        </div>
      )}
      {!!audioCount && (
        <div className={styles.info}>
          <div className={styles.count}>
            <p>{audioCount}</p>
          </div>
        </div>
      )}
    </div>
  )
}

const Playlists: FC<Props> = ({ closeFn, confirmFn, addNew, selectedPlaylist, setSelectedPlaylist }) => {
  const { data } = useQuery(['getPlaylists'], () => getPlaylists(), {
    refetchOnWindowFocus: false,
    staleTime: 10000
  })

  const { t } = useTranslation()

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.title}>{t('playlists')}</div>
        <div className={styles.button} onClick={() => addNew()}>
          <IconPlus />
        </div>
      </div>
      <div className={styles.list}>
        <div className={styles.inner}>
          {data &&
            data.map((playlist: IPlaylist) => {
              return (
                <div key={playlist.playlist_info.id} onClick={() => setSelectedPlaylist(playlist.playlist_info.id)}>
                  <ActionCard
                    icon={
                      <div className={styles.iconWrapperBlue}>
                        <IconPlaylist />
                      </div>
                    }
                    text={playlist.playlist_info.playlist_name}
                    subtext={
                      <MediaCounter
                        photoCount={playlist.media_counters.photo_sum}
                        videoCount={playlist.media_counters.video_sum}
                        audioCount={playlist.media_counters.sound_sum}
                      />
                    }
                    customClass='add-to-playlist-action-card'
                    hasRadio={true}
                    toggleActive={selectedPlaylist === playlist.playlist_info.id ? true : false}
                  />
                </div>
              )
            })}

          <ActionCard
            icon={<IconPlusInBox width='28' height='28' />}
            subtext={t('addNewPlaylist')}
            clickFn={() => addNew()}
            customClass='add-user-to-groups-action-card'
          />
        </div>
      </div>
      <div className={styles.footer}>
        <Button text={t('cancel')} color='grey' font='mont-14-normal' width='10' height='3' clickFn={closeFn} />

        <Button
          text={t('addToPlaylist')}
          color='black'
          font='mont-14-normal'
          width='13'
          height='3'
          clickFn={() => confirmFn()}
          disabled={!selectedPlaylist}
        />
      </div>
    </div>
  )
}

export default Playlists
