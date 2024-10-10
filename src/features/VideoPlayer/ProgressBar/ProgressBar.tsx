import { FC, useRef } from 'react'
import './_progressBar.scss'

interface Props {
  progressData: {
    played: number
    playedSeconds: number
    loaded: number
    loadedSeconds: number
  }
  currentSeek: number
  handleOnSeekChange: (e: any) => void
}

const ProgressBar: FC<Props> = ({ progressData, handleOnSeekChange, currentSeek }) => {
  const progressBarRef = useRef<HTMLInputElement>(null)

  return (
    <div
      ref={progressBarRef}
      className='progressBar'
      onClick={event => {
        console.log({ event })
        console.log(currentSeek)
        let newValue = null
        console.log(progressBarRef.current)
        if (progressBarRef.current) {
          newValue = event.nativeEvent.offsetX / progressBarRef.current?.offsetWidth
        }
        console.log({ newValue })
        handleOnSeekChange(newValue)
      }}
    >
      <div className='progressBar__range' style={{ width: `${progressData.played * 100}%` }}></div>
    </div>
  )
}

export default ProgressBar
