import { FC, useState, useEffect } from 'react'

import { IPost } from '../../../../types/interfaces/ITypes'
import styles from './singlePostPreview.module.scss'

import { usePreviewContext } from '../../../../context/previewContext'
import { useOrientation } from '../../../../helpers/helperHooks'

import StoryPreview from '../../../../pages/storyPreview/StoryPreview'

interface Props {
  post: IPost
  showControls: boolean
  isFirstPost: boolean
  hasNextPage: boolean
  isInViewport: boolean
  minimizeFn: (fileIndex: number, type: string) => void
  toggleControls: () => void
}

const SinglePostPreviewStory: FC<Props> = ({ post, isInViewport }) => {
  const [activeSlide, setActiveSlide] = useState<number | null>(null)

  const deviceOrientation = useOrientation()
  const { selectedSlide } = usePreviewContext()

  useEffect(() => {
    selectedSlide !== null && setActiveSlide(selectedSlide)
  }, [selectedSlide])

  if (!post.stories.length || !deviceOrientation) return null

  return (
    <div className='preview__file--wrapper'>
      <StoryPreview postData={post} activeStory={activeSlide} isInViewport={isInViewport} />
    </div>
  )
}

export default SinglePostPreviewStory
