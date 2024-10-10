import { FC, useState, createContext, useContext } from 'react'
import './_modal.scss'

import ReactPlayer from 'react-player'

const defaultValues = {
  url: ''
}

export const VideoModalContext = createContext<any>(defaultValues)

export const VideoModalProvider: FC<{ children?: any }> = ({ children }) => {
  const [state, setState] = useState<{ url: string }>({
    url: ''
  })
  // const [videoState, setVideoState] = useState<{
  //   playing: boolean
  // }>({
  //   playing: false
  // })

  const addModal = (url: string) => {
    setState({ url })
  }

  const clearModal = () => {
    setState({ url: '' })
  }

  return (
    <VideoModalContext.Provider value={{ addModal, clearModal }}>
      <div className={`videoModal videoModal--${state.url ? 'active' : 'inactive'}`}>
        <ReactPlayer height='100%' width='100%' url={state.url} controls={true} />
      </div>
      {children}
    </VideoModalContext.Provider>
  )
}

export const useVideoModalContext = () => useContext(VideoModalContext)
