import { Story } from '../../types/types'

export const integrateStoryAnswer = ({
  story,
  answer,
  answerId
}: {
  story: Story
  answer?: string | number | null
  answerId?: number
}) => {
  const newStory = story
  if (newStory.poll) {
    if (newStory.poll.is_answered) {
      const prevAnswerIndex = newStory.poll.answers_count.findIndex(answer => {
        if (typeof newStory.poll?.is_answered === 'string') {
          return answer.text === newStory.poll?.is_answered
        } else {
          return answer.id === newStory.poll?.is_answered
        }
      })
      newStory.poll.answers_count[prevAnswerIndex].count -= 1
    }

    if (answerId) {
      const answerIndex = newStory.poll.answers_count.findIndex(answerFromCount => answerFromCount.id === answerId)
      newStory.poll.answers_count[answerIndex].count += 1
      newStory.poll.is_answered = answerId
    } else if (answer) {
      newStory.poll.is_answered = answer
    }

    return newStory
  } else {
    return story
  }
}
