import { useState, useEffect } from 'react'
import { off, on } from './util'

export interface OrientationState {
  angle: number
  type: string
}

const defaultState: OrientationState = {
  angle: 0,
  type: 'landscape-primary'
}

export const useOrientation = () =>
  // initialState: OrientationState = defaultState
  {
    const [state, setState] = useState<OrientationState | null>(null)

    useEffect(() => {
      const screen = window.screen
      let mounted = true

      const onChange = () => {
        if (mounted) {
          const { orientation } = screen as any

          if (orientation) {
            const { angle, type } = orientation
            setState({ angle, type })
          } else if (window.orientation !== undefined) {
            setState({
              angle: typeof window.orientation === 'number' ? window.orientation : 0,
              type: ''
            })
          } else {
            console.log('no orientation')
            setState(null)
          }
        }
      }

      on(window, 'orientationchange', onChange)
      onChange()

      return () => {
        mounted = false
        off(window, 'orientationchange', onChange)
      }
    }, [])

    return state
  }

export const useVideoPlayerOrientation = (videoOrientation?: string) => {
  const deviceOrientation = useOrientation()

  const [playerWidth, setPlayerWidth] = useState('640px')
  const [playerHeight, setPlayerHeight] = useState('360px')

  useEffect(() => {
    if (deviceOrientation) {
      if (deviceOrientation.type.includes('portrait')) {
        if (videoOrientation?.toLowerCase() === 'portrait') {
          setPlayerHeight('100%')
          setPlayerWidth('auto')
        } else {
          setPlayerHeight('auto')
          setPlayerWidth('100%')
        }
      } else {
        if (videoOrientation?.toLowerCase() === 'portrait') {
          setPlayerHeight('100%')
          setPlayerWidth('auto')
        } else {
          setPlayerHeight('auto')
          setPlayerWidth('100%')
        }
      }
    }
  }, [deviceOrientation, videoOrientation])

  return {
    deviceOrientation,
    playerWidth,
    playerHeight
  }
}
