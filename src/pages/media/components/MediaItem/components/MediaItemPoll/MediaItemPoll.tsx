import { FC } from 'react'
import { useQueryClient } from 'react-query'
import { IPollResponse } from '../../../../../../types/interfaces/ITypes'
import PostPoll from '../../../../../../features/Post/components/PostPoll'

import styles from './mediaItemPoll.module.scss'
import { useAnswerPoll } from '../../../../../../helpers/hooks'

interface Props {
  poll: IPollResponse
}

const MediaItemPoll: FC<Props> = ({ poll }) => {
  const { background_color, background_src } = poll

  const queryClient = useQueryClient()
  const { setPollAnswer } = useAnswerPoll({})
  return (
    <div
      style={{
        backgroundImage: background_color ?? `url(${background_src})`
      }}
      className={styles.wrapper}
    >
      <PostPoll
        pollData={poll}
        setAnswer={ans =>
          setPollAnswer.mutate(ans, {
            onSettled: () => queryClient.invalidateQueries(['getMediaData'])
          })
        }
        isMyPost={true}
      />
    </div>
  )
}

export default MediaItemPoll
