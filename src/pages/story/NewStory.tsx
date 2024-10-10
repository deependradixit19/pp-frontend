import ReactDom from 'react-dom'
import { FC, useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import ReactPlayer from 'react-player'

// Services
import { useModalContext } from '../../context/modalContext'
import { IPoll } from '../../types/interfaces/ITypes'
import { Orientation } from '../../helpers/media'
import { NewStory as Story } from '../../types/types'

// Components
import SvgIconButton from '../../components/UI/Buttons/SvgIconButton'
import * as SvgIcons from '../../assets/svg/sprite'
import DateModal from '../../components/UI/Modal/Date/DateModal'
import BackgroundPicker, { GRADIENTS } from '../../components/UI/BackgroundPicker/BackgroundPicker'
import Sidebar from '../../components/UI/Sidebar/Sidebar'
import SidebarItem from '../../components/UI/Sidebar/SidebarItem'
import AddPoll from '../../features/AddPoll/AddPoll'
import CloseButton from '../../components/UI/CloseButton/CloseButton'
import UploadStoryMedia from './components/UploadStoryMedia'
import ShareStory, { ClickActionType } from './components/ShareStory'
import PollPreview from '../newPost/components/PollPreview'
import ProcessingFile from '../../features/ProcessingFile/ProcessingFile'
import DraggableTextContainer from '../../features/PhotoEdit/DraggableText/DraggableTextContainer'
import ScheduledInfoBubble from './components/ScheduledInfoBubble/ScheduledInfoBubble'

// Styling
import styles from './NewStory.module.scss'

type UploadProgress = {
  percentage: number
  cancelCb: () => void
  error?: string
}

interface NewStoryProps {
  existingStory?: Story
}

const NewStory: FC<NewStoryProps> = ({ existingStory }) => {
  const modalData = useModalContext()
  const location = useLocation()
  const navigate = useNavigate()
  const playerRef = useRef<ReactPlayer>(null)
  const { t } = useTranslation()

  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)

  const [shareClickAction, setShareClickAction] = useState<ClickActionType>('share')
  // Polls
  const [pollData, setPollData] = useState<IPoll | null>(null)
  const [addPollOpen, setAddPollOpen] = useState(false)
  // Text
  const [isAddTextOpen, setIsAddTextOpen] = useState(false)
  const [textValue, setTextValue] = useState('')
  const [textPosition, setTextPosition] = useState<[number, number]>([50.0, 50.0])
  const [initialPosition, setInitialPos] = useState([50.0, 50.0])
  const [initialText, setInitialText] = useState('')
  const [isTextDragged, setIsTextDragged] = useState(false)
  // Schedule
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null)

  const [background, setBackground] = useState<string>(GRADIENTS[0])
  const [image, setImage] = useState<{
    path: string
    orientation: Orientation
  }>()
  const [videos, setVideos] = useState<
    {
      path: string
      orientation: Orientation
    }[]
  >([])

  useEffect(() => {
    if (localStorage.getItem('share-story')) {
      const newStoryMedia = localStorage.getItem('share-story')
      const parsedMedia = newStoryMedia ? JSON.parse(newStoryMedia) : null
      if (parsedMedia) {
        if (parsedMedia[0].post) {
          if (parsedMedia[0].post.photos[0]) {
            handleSetImageData(parsedMedia[0].post.photos[0].url, parsedMedia[0].post.photos[0].orientation)
            if (
              parsedMedia[0].post.photos[0].text.value &&
              parsedMedia[0].post.photos[0].text.x &&
              parsedMedia[0].post.photos[0].text.y
            ) {
              setTextValue(parsedMedia[0].post.photos[0].text.value)
              setInitialText(parsedMedia[0].post.photos[0].text.value)
              handleSetCoordinates(parsedMedia[0].post.photos[0].text.x, parsedMedia[0].post.photos[0].text.y)
              setInitialPos([parsedMedia[0].post.photos[0].text.x, parsedMedia[0].post.photos[0].text.y])
            }
          }
          if (parsedMedia[0].post.videos[0]) {
            handleSetVideoData([
              {
                path: parsedMedia[0].post.videos[0].url,
                orientation: parsedMedia[0].post.videos[0].orientation
              }
            ])
          }
        }
      }
      if (parsedMedia[0].story) {
        if (parsedMedia[0].story.image_src) {
          handleSetImageData(parsedMedia[0].story.image_src, parsedMedia[0].story.image_orientation)
        }
        if (parsedMedia[0].story.text) {
          setTextValue(parsedMedia[0].story.text.value)
          setInitialText(parsedMedia[0].story.text.value)
          setIsAddTextOpen(true)
          handleSetCoordinates(parsedMedia[0].story.text.x, parsedMedia[0].story.text.y)
          setInitialPos([parsedMedia[0].story.text.x, parsedMedia[0].story.text.y])
        }
        if (parsedMedia[0].story.video_src) {
          handleSetVideoData([
            {
              path: parsedMedia[0].story.video_src,
              orientation: parsedMedia[0].story.video_orientation
            }
          ])
        }
        if (parsedMedia[0].story.poll) {
          setPollData({
            type: parsedMedia[0].story.poll.type,
            question: parsedMedia[0].story.poll.question,
            pollBg: parsedMedia[0].story.poll.background_color || '',
            pollBgImg: parsedMedia[0].story.poll.background_src || '',
            answers:
              parsedMedia[0].story.poll.answers_count.length > 0
                ? parsedMedia[0].story.poll.answers_count.map((item: any) => item.text)
                : []
          })
        }
      }
      localStorage.removeItem('share-story')
    }
  }, [])

  useEffect(() => {
    initializeStoryFromProps()
    initializeDateFromQuery()
  }, [])

  useEffect(() => {
    initializeStoryFromProps()
  }, [existingStory])

  const initializeStoryFromProps = () => {
    if (existingStory) {
      setShareClickAction('edit')
      if (existingStory.background_color) {
        setBackground(existingStory.background_color)
      }
      if (existingStory.photo) {
        setImage(existingStory.photo)
      }
      if (existingStory.videos && existingStory.videos.length) {
        setVideos(existingStory.videos)
      }
      if (existingStory.text) {
        setTextPosition([existingStory.text.x, existingStory.text.y])
        setInitialPos([existingStory.text.x, existingStory.text.y])
        setTextValue(existingStory.text.value)
        setInitialText(existingStory.text.value)
        setIsAddTextOpen(true)
      }
      if (existingStory.poll) {
        setPollData({ ...existingStory.poll, pollBg: '', pollBgImg: null })
      }
      if (existingStory.schedule_date) {
        setScheduleDate(new Date(existingStory.schedule_date))
      }
    }
  }

  const initializeDateFromQuery = () => {
    if (location.search) {
      const dateString = location.search.split('?date=')[1]
      setScheduleDate(new Date(dateString))
    }
  }

  const handleCloseClick = useCallback(() => {
    navigate('/')
  }, [navigate])

  const handleSettingsClick = useCallback(() => {
    navigate('/settings/general/story-settings')
  }, [navigate])

  const handleRemoveText = useCallback(() => {
    setIsAddTextOpen(false)
    setTextPosition([50, 50])
    setTextValue('')
  }, [])

  const handleSetCoordinates = useCallback(
    (x: number, y: number) => {
      if (x !== textPosition[0] || y !== textPosition[1]) {
        setTextPosition([x, y])
      }
    },
    [textPosition]
  )

  const handleSetProgressInfo = useCallback((percentage: number, cancelCb: () => void, error?: string) => {
    setUploadProgress({
      percentage,
      cancelCb,
      error
    })
  }, [])

  const handleSetImageData = useCallback((path: string, orientation: Orientation) => {
    setImage({ path, orientation })
    setUploadProgress(null)
  }, [])

  const handleSetVideoData = useCallback((videos: { path: string; orientation: Orientation }[]) => {
    setVideos(videos)
    setUploadProgress(null)
  }, [])

  const story = useMemo<Story>(() => {
    const result: Story = {}
    if (image) {
      result.photo = image
    } else if (!!videos.length) {
      result.videos = videos
    } else if (background) {
      result.background_color = background
    }
    if (textValue) {
      result.text = {
        value: textValue,
        x: textPosition[0],
        y: textPosition[1]
      }
    }
    if (pollData) {
      result.poll = {
        type: pollData.type,
        question: pollData.question,
        answers: pollData.answers?.filter(answer => answer) ?? null
      }
    }
    if (scheduleDate) {
      result.schedule_date = scheduleDate
    }
    return result
  }, [background, image, videos, textPosition, textValue, pollData, scheduleDate])

  const toggleDateModal = () => {
    modalData.addModal(t('schedulePost'), <DateModal confirmFn={setScheduleDate} />)
  }

  if (addPollOpen) {
    const portal = document.getElementById('portal')

    if (!portal) return null
    !portal.classList.contains('portal--open') && portal.classList.add('portal--open')
    return ReactDom.createPortal(
      <AddPoll
        handleClose={() => {
          portal.classList.contains('portal--open') && portal.classList.remove('portal--open')
          setAddPollOpen(false)
        }}
        handleSetPollData={(data: IPoll) => {
          setPollData({
            ...data,
            pollBg: 'transparent'
          })
        }}
        noControls
        backgroundColor={background}
      />,
      portal
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{t('addStory')}</div>

      {Boolean(background && !image && !videos.length) && (
        <div
          className={styles.container}
          style={{
            backgroundImage: background
          }}
        />
      )}

      {Boolean(image) && (
        <div
          className={styles.background}
          style={{
            backgroundImage: `url(${image?.path})`
          }}
        >
          <div
            className={styles.container}
            style={{
              backgroundImage: `url(${image?.path})`
            }}
          />
        </div>
      )}

      {Boolean(videos && videos.length && videos[0].path) && (
        <div
          className={styles.background}
          style={{
            backgroundImage: 'black'
          }}
        >
          <div className={styles.container}>
            <ReactPlayer
              ref={playerRef}
              url={videos ? videos[0].path : ''}
              width='100%'
              height='100%'
              controls={false}
              playing={true}
            />
          </div>
        </div>
      )}

      {(textValue || isAddTextOpen) && (
        <div className={styles.textContainer}>
          <DraggableTextContainer
            customClass='photoEdit__container__text'
            initialValue={initialText}
            initialX={initialPosition[0]}
            initialY={initialPosition[1]}
            isEditable={true}
            isOpen={isAddTextOpen}
            isDragging={isTextDragged}
            setValue={setTextValue}
            setCoordinates={handleSetCoordinates}
            setIsDragging={setIsTextDragged}
            onRemove={handleRemoveText}
          />
        </div>
      )}

      {pollData && (
        <div className={styles.pollContainer}>
          <PollPreview
            pollData={pollData}
            clearPollData={() => {
              setPollData(null)
            }}
          />
        </div>
      )}

      <button className={styles.settingsButton} onClick={handleSettingsClick}>
        <SvgIcons.IconSettingsOutline />
      </button>

      <div className={styles.storySidebar}>
        <Sidebar>
          <SidebarItem
            icon={<SvgIcons.IconText color='white' />}
            text={t('text')}
            isDisabled={isAddTextOpen}
            onClick={() => setIsAddTextOpen(true)}
          />
          <SidebarItem
            icon={<SvgIcons.IconPoll color='white' />}
            text={t('poll')}
            isDisabled={Boolean(pollData)}
            onClick={() => setAddPollOpen(true)}
          />
          <BackgroundPicker
            background={background}
            setBackground={setBackground}
            isDisabled={Boolean(image || (videos && videos.length))}
          />
        </Sidebar>
      </div>

      <CloseButton onClick={handleCloseClick} />

      <div className={styles.footer}>
        {scheduleDate && (
          <div className={styles.footerOne}>
            <ScheduledInfoBubble date={scheduleDate} removeSchedule={() => setScheduleDate(null)} />
          </div>
        )}
        <div className={styles.footerTwo}>
          <UploadStoryMedia
            setImageData={handleSetImageData}
            setVideosData={handleSetVideoData}
            setProgressInfo={handleSetProgressInfo}
          />
          <ShareStory story={story} clickAction={shareClickAction} />
          <SvgIconButton
            clickFn={toggleDateModal}
            icon={<SvgIcons.IconCalendarClockOutline2 color={scheduleDate ? '#2894FF' : 'white'} />}
            type='black--transparent'
            customClass={styles.footerButton}
          />
        </div>
      </div>

      {uploadProgress !== null && (
        <ProcessingFile
          className={styles.progress}
          percentage={uploadProgress?.percentage}
          onAbort={() => {
            uploadProgress.cancelCb()
            setUploadProgress(null)
          }}
        />
      )}
    </div>
  )
}

export default NewStory
