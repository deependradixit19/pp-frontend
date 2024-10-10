import { FC } from 'react'
import './_liveFooter.scss'
import { useTranslation } from 'react-i18next'
import { IconCameraOutline, IconVolumeFill, IconVolumeMutedFill } from '../../../assets/svg/sprite'
import Button from '../../../components/UI/Buttons/Button'

interface Props {
  broadcaster: boolean
  muted: boolean
  streaming: boolean
  setMuted: (fn: (value: boolean) => boolean) => void
  startStreaming: () => void
  onCameraSettingsClick?: () => void
}

const LiveFooter: FC<Props> = ({
  broadcaster = false,
  muted,
  setMuted,
  streaming,
  startStreaming,
  onCameraSettingsClick
}) => {
  const { t } = useTranslation()
  return (
    <div className='livefooter'>
      <div className='livefooter__left'>
        <div className='livefooter__icon' onClick={() => setMuted(muted => !muted)}>
          {muted ? <IconVolumeMutedFill /> : <IconVolumeFill />}
        </div>
      </div>
      {!streaming && broadcaster && (
        <>
          <div className='livefooter__middle'>
            <Button
              text={`${streaming ? t('stopLive') : t('startLive')}`}
              color='blue'
              width='fit'
              height='5'
              padding='2'
              font='mont-16-semi-bold'
              clickFn={startStreaming}
            />
          </div>

          <div className='livefooter__right'>
            {onCameraSettingsClick && (
              <div className='livefooter__icon' onClick={onCameraSettingsClick}>
                <IconCameraOutline />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default LiveFooter
