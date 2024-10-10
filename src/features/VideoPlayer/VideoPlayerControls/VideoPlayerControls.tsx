import { FC, useState } from 'react'
import AutoplayToggle from '../AutoplayToggle/AutoplayToggle'
import './_videoPlayerControls.scss'
import ProgressBar from '../ProgressBar/ProgressBar'
import { formatVideoTime } from '../../../lib/dayjs'
import RadioButton from '../../../components/Common/RadioButton/RadioButton'
import {
  IconPauseFill,
  IconPlayFill,
  IconPlayOutline,
  IconSettingsOutline,
  IconVolumeFill,
  IconVolumeMutedFill
} from '../../../assets/svg/sprite'

interface Props {
  playing: boolean
  setPlaying: (playing: boolean) => void
  volume: number
  setVolume: (volume: number) => void
  volumeBarShowing: boolean
  setVolumeBarShowing: (volumeBarShowing: boolean) => void
  muted: boolean
  setMuted: (muted: boolean) => void
  progressData: {
    played: number
    playedSeconds: number
    loaded: number
    loadedSeconds: number
  }
  currentSeek: number
  handleOnSeekChange: (event: any) => void
  setProgress: (event: any) => void
  minimized: boolean
  autoplay: boolean
  autoplayFn: (prev: boolean) => void
  autoplayLoading: boolean
}

interface IVideoSetting {
  name: string
  active: boolean
}

const VideoPlayerControls: FC<Props> = ({
  playing,
  setPlaying,
  volume,
  setVolume,
  volumeBarShowing,
  setVolumeBarShowing,
  muted,
  setMuted,
  progressData,
  currentSeek,
  handleOnSeekChange,
  setProgress,
  minimized,
  autoplay,
  autoplayFn,
  autoplayLoading
}) => {
  const [settingsOptions, setSettingsOptions] = useState<IVideoSetting[]>([
    { name: '240', active: false },
    { name: '720', active: false },
    { name: 'original', active: true }
  ])
  const [settingsShowing, setSettingsShowing] = useState<boolean>(false)

  const handleSettingChange = (name: string) => {
    const newSettingsState = settingsOptions.map(setting => {
      if (name === setting.name) {
        setting.active = true
      } else {
        setting.active = false
      }
      return setting
    })
    setSettingsOptions(newSettingsState)
  }

  return (
    <div className='videoPlayerControls'>
      <div className='videoPlayerControls__progress'>
        <ProgressBar progressData={progressData} currentSeek={currentSeek} handleOnSeekChange={handleOnSeekChange} />
      </div>
      <div className='videoPlayerControls__actions'>
        <div className='videoPlayerControls__actions--left'>
          <div
            onClick={() => setPlaying(!playing)}
            className='videoPlayerControls__action videoPlayerControls__action--play'
          >
            {minimized ? (
              <>{playing ? <IconPauseFill color='#2894FF' /> : <IconPlayOutline />}</>
            ) : (
              <>{playing ? <IconPauseFill /> : <IconPlayFill />}</>
            )}
          </div>
          {!minimized && (
            <>
              <div
                className={`videoPlayerControls__action videoPlayerControls__action--volume ${
                  volumeBarShowing ? 'active' : ''
                }`}
              >
                <div className='videoPlayerControls__action--volume-icon' onClick={() => setMuted(!muted)}>
                  {muted ? <IconVolumeMutedFill /> : <IconVolumeFill />}
                </div>
              </div>
              <div className='videoPlayerControls__duration'>
                <span className='videoPlayerControls__duration--played'>
                  {formatVideoTime(progressData.playedSeconds)}
                </span>
                <span className='videoPlayerControls__duration--divider'> / </span>
                <span className='videoPlayerControls__duration--loaded'>
                  {formatVideoTime(progressData.loadedSeconds)}
                </span>
              </div>
            </>
          )}
        </div>
        {!minimized && (
          <div className='videoPlayerControls__actions--right'>
            <div className='videoPlayerControls__action videoPlayerControls__action--autoplay'>
              <AutoplayToggle
                active={autoplay}
                clickFn={() =>
                  // setAutoplayActive((autoplayActive) => !autoplayActive)
                  !autoplayLoading && autoplayFn(autoplay)
                }
              />
            </div>
            <div
              className='videoPlayerControls__action'
              onClick={() => setSettingsShowing(settingsShowing => !settingsShowing)}
            >
              <IconSettingsOutline />
            </div>
            {settingsShowing && (
              <div className='videoPlayerControls__settings'>
                {settingsOptions &&
                  settingsOptions.map(setting => (
                    <div
                      key={setting.name}
                      className='videoPlayerControls__setting'
                      onClick={() => {
                        handleSettingChange(setting.name)
                        setSettingsShowing(false)
                      }}
                    >
                      <RadioButton active={setting.active} />
                      <div className='videoPlayerControls__setting--name'>{setting.name}</div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoPlayerControls
