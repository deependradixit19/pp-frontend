import { FC, useState } from 'react'
import { Carousel } from 'react-responsive-carousel'
import ReactPlayer from 'react-player'
import { AllIcons } from '../../../helpers/allIcons'

import bg1 from '../../../assets/images/home/bg1.png'

const JustView: FC<{
  files: Array<{
    caption?: string | null
    created_at: string
    id: number
    order: number
    url: string
    thumbnail_src?: null | string
  }>
  selectedItem?: number
}> = ({ files, selectedItem }) => {
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false)

  console.log('SELECTED ITEM', selectedItem)

  return (
    <Carousel
      axis='horizontal'
      autoPlay={false}
      interval={60000}
      showArrows={false}
      showIndicators={true}
      infiniteLoop={false}
      showThumbs={false}
      showStatus={false}
      swipeScrollTolerance={80}
      useKeyboardArrows={true}
      selectedItem={selectedItem}
      onChange={() => setVideoPlaying(false)}
      className='preview__carousel'
    >
      {files.map(
        (
          item: {
            created_at: string
            id: number
            order: number
            url: string
          },
          key: number
        ) => {
          if (item.url.includes('/images/originals')) {
            return (
              <div className='preview__file' key={key}>
                <img className='preview__background' src={item.url} alt='Background' />
                <img className='preview__file__image' src={item.url} alt='Preview' />
              </div>
            )
          } else if (item.url.includes('/videos/originals')) {
            return (
              <div className='preview__file' key={key}>
                <img className='preview__background' src={bg1} alt='Video background' />
                <div className='preview__videoctrl' onClick={() => setVideoPlaying(!videoPlaying)}>
                  {videoPlaying ? (
                    <img className='preview__videoctrl--playing' src={AllIcons.video_pause} alt='Pause' />
                  ) : (
                    <img src={AllIcons.video_play} alt='Play' />
                  )}
                </div>
                <ReactPlayer
                  className='preview__file__video'
                  width='100%'
                  height='100%'
                  url={item.url}
                  controls={true}
                  playing={videoPlaying}
                  onPlay={() => setVideoPlaying(true)}
                  onEnded={() => setVideoPlaying(false)}
                />
              </div>
            )
          } else {
            return <div className='preview__video'>Whatever</div>
          }
        }
      )}
    </Carousel>
  )
}

export default JustView
