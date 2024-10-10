import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactPlayer from 'react-player'
import { useVideoPlayerOrientation } from '../../../helpers/helperHooks'
import Girl from '../../../assets/images/girl.jpg'
import { IconCaret, IconStatsClose } from '../../../assets/svg/sprite'
import LiveStats from '../LiveStats/LiveStats'
import LiveTopRated from '../LiveTopRated/LiveTopRated'
import LiveActions from '../LiveActions/LiveActions'
import LiveChat from '../LiveChat/LiveChat'
import LiveFooter from '../LiveFooter/LiveFooter'
import StartModal from '../LiveModal/StartModal/StartModal'
import EndStats from '../EndStats/EndStats'
import TipModal from '../LiveModal/TipModal/TipModal'
import ViewersModal from '../LiveModal/ViewersModal/ViewersModal'
import EndModal from '../LiveModal/EndModal/EndModal'
import CloseButton from '../../../components/UI/CloseButton/CloseButton'

const LiveStreamCreator: FC = () => {
  const navigate = useNavigate()
  const [muted, setMuted] = useState<boolean>(false)

  const [commentsActive, setCommentsActive] = useState<boolean>(false)

  const [streaming, setStreaming] = useState<boolean>(false)

  const [startModalOpen, setStartModalOpen] = useState(true)

  const [tipModalOpen, setTipModalOpen] = useState(false)
  const [tipModalData, setTipModalData] = useState({
    goal: '',
    reward: '',
    showGoal: false
  })
  const [viewersModalOpen, setViewersModalOpen] = useState(false)

  const [videoOrientation, setVideoOrientation] = useState('portrait')

  const [endModalOpen, setEndModalOpen] = useState(false)

  const [endStatsOpen, setEndStatsOpen] = useState(false)

  const [settingsType, setSettingsType] = useState('default')

  const { deviceOrientation, playerWidth, playerHeight } = useVideoPlayerOrientation(videoOrientation)

  if (!deviceOrientation) return null

  return (
    <div
      className={`livestream ${deviceOrientation.type.includes('portrait') ? 'portrait' : ''} ${
        deviceOrientation.type.includes('landscape') ? 'landscape' : ''
      }`}
    >
      <div
        className='livestream__bg'
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${Girl})`
        }}
      ></div>
      <div className='livestream__header'>
        <div className='livestream__header--wrapper'>
          <div className='livestream__header__top'>
            <div className='livestream__header__top--left'>
              <div className='livestream__header__top--minimize'>
                <IconCaret />
              </div>
              <div className='livestream__header__top--name'>@Chomii</div>
            </div>
          </div>
          <div className='livestream__header__bottom'>
            <div className='livestream__header__bottom--stats'>
              <LiveStats type='viewers' clickFn={() => setViewersModalOpen(true)} />
              <LiveStats type='goal' clickFn={() => setTipModalOpen(true)} />
            </div>
            <div className='livestream__toprated'>
              <LiveTopRated />
            </div>
          </div>
        </div>
        <CloseButton
          onClick={() => {
            const portal = document.getElementById('portal')
            if (portal) {
              portal?.classList.contains('portal--open') && portal.classList.add('portal--open')
            }
            setEndModalOpen(true)
          }}
        />
      </div>

      <div className='livestream__actions'>
        <LiveActions
          role='creator'
          openTipModal={() => setTipModalOpen(true)}
          toggleComments={() => setCommentsActive(commentsActive => !commentsActive)}
        />
      </div>
      <div className='livestream__player'>
        <ReactPlayer
          className={`livestream__player__video `}
          width={playerWidth}
          height={playerHeight}
          url={'/moon.mp4'}
          controls={false}
          volume={0.5}
          playing={streaming}
          loop={true}
          muted={muted}
        />
      </div>
      {commentsActive && (
        <div className='livestream__chat'>
          <LiveChat muted={muted} setMuted={setMuted} />
        </div>
      )}
      {!streaming && startModalOpen && (
        <div className={`livestream__footer ${settingsType === 'default' ? 'active' : ''}`}>
          <LiveFooter
            broadcaster
            muted={muted}
            setMuted={setMuted}
            streaming={streaming}
            startStreaming={() => {
              setStreaming(true)
              setStartModalOpen(false)
            }}
            onCameraSettingsClick={() => setSettingsType('camera')}
          />
        </div>
      )}
      {startModalOpen && (
        <StartModal settingsType={settingsType} onChangeSettingsType={settingsType => setSettingsType(settingsType)} />
      )}
      {endStatsOpen && (
        <EndStats
          onClose={() => {
            const portal = document.getElementById('portal')
            if (portal) {
              portal?.classList.contains('portal--open') && portal.classList.remove('portal--open')
            }
            navigate(-1)
          }}
        />
      )}
      {tipModalOpen && (
        <TipModal
          data={tipModalData}
          setTipModalData={(data: { goal: string; reward: string; showGoal: boolean }) => setTipModalData(data)}
          onClose={() => setTipModalOpen(false)}
        />
      )}
      {viewersModalOpen && <ViewersModal onClose={() => setViewersModalOpen(false)} />}
      {endModalOpen && (
        <EndModal
          onClose={() => setEndModalOpen(false)}
          onConfirm={() => {
            setEndStatsOpen(true)
            setEndModalOpen(false)
          }}
        />
      )}
    </div>
  )
}

export default LiveStreamCreator
