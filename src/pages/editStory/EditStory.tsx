import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getSingleStory } from '../../services/endpoints/story'
// Services
import { NewStory as INewStory, Story } from '../../types/types'
// Components
import NewStory from '../story/NewStory'

type StoryParams = {
  id: string
}

export default function EditStory() {
  const [story, setStory] = useState<INewStory>({})

  const { id } = useParams<StoryParams>()

  useEffect(() => {
    setInitialStoryData()
  }, [])

  const setInitialStoryData = async () => {
    const scheduledStory: Story = await getSingleStory(parseInt(id ?? ''))

    let tempStory: INewStory = {}

    if (scheduledStory.sound) {
      tempStory.sound = scheduledStory.sound
    }

    if (scheduledStory.background_color) {
      tempStory.background_color = scheduledStory.background_color
    }

    if (scheduledStory.text) {
      tempStory.text = { ...scheduledStory.text }
    }

    if (scheduledStory.video_src && scheduledStory.video_orientation) {
      tempStory.videos = [
        {
          path: scheduledStory.video_src,
          orientation: scheduledStory.video_orientation
        }
      ]
    }

    if (scheduledStory.image_src && scheduledStory.image_orientation) {
      tempStory.photo = {
        path: scheduledStory.image_src,
        orientation: scheduledStory.image_orientation
      }
    }

    if (scheduledStory.poll) {
      const answers = scheduledStory.poll.answers_count.map(answer => answer.text)
      tempStory.poll = {
        type: scheduledStory.poll.type,
        question: scheduledStory.poll.question,
        answers
      }
    }

    if (scheduledStory.schedule_date) {
      tempStory.schedule_date = scheduledStory.schedule_date
    }

    setStory(tempStory)
  }

  return <>{Object.keys(story).length && <NewStory existingStory={story} />}</>
}
