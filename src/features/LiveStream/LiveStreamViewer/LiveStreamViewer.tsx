import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactPlayer from 'react-player'
import { useVideoPlayerOrientation } from '../../../helpers/helperHooks'
import Girl from '../../../assets/images/girl.jpg'
import { IconCaret, IconStatsClose } from '../../../assets/svg/sprite'
import LiveStats from '../LiveStats/LiveStats'
import LiveActions from '../LiveActions/LiveActions'
import LiveChat from '../LiveChat/LiveChat'
import LiveFooter from '../LiveFooter/LiveFooter'
import TipModalViewer from '../LiveModal/TipModal/TipModalViewer'
import EndModalViewer from '../LiveModal/EndModal/EndModalViewer'
import PrivateMessageModal from '../LiveModal/PrivateMessageModal/PrivateMessageModal'
import CloseButton from '../../../components/UI/CloseButton/CloseButton'

const LiveStreamViewer: FC = () => {
  const navigate = useNavigate()
  const [muted, setMuted] = useState<boolean>(false)
  const [goalShowing, setGoalShowing] = useState(false)

  const [commentsActive, setCommentsActive] = useState<boolean>(false)

  const [streaming, setStreaming] = useState<boolean>(true)
  const [priveteMessageModalOpen, setPriveteMessageModalOpen] = useState(false)

  const [tipModalOpen, setTipModalOpen] = useState(true)
  const [endModalOpen, setEndModalOpen] = useState(false)

  const [videoOrientation, setVideoOrientation] = useState('portrait')

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
              <LiveStats type='viewers' />
              {goalShowing && <LiveStats type='goal' clickFn={() => setTipModalOpen(true)} />}
            </div>
          </div>
        </div>
        <CloseButton onClick={() => setEndModalOpen(true)} />
      </div>

      <div className='livestream__actions'>
        <LiveActions
          role='viewer'
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
      {!commentsActive && (
        <div className={`livestream__footer`}>
          <LiveFooter
            broadcaster={false}
            muted={muted}
            setMuted={setMuted}
            streaming={streaming}
            startStreaming={() => {
              setStreaming(true)
            }}
          />
        </div>
      )}

      {tipModalOpen && <TipModalViewer onClose={() => setTipModalOpen(false)} />}
      {priveteMessageModalOpen && <PrivateMessageModal onClose={() => setPriveteMessageModalOpen(false)} />}
      {endModalOpen && (
        <EndModalViewer
          onClose={() => setEndModalOpen(false)}
          onConfirm={() => {
            const portal = document.getElementById('portal')
            if (portal) {
              portal?.classList.contains('portal--open') && portal.classList.remove('portal--open')
            }
            navigate(-1)
          }}
        />
      )}
    </div>
  )
}

export default LiveStreamViewer
