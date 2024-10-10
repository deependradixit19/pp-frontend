import { FC } from 'react'
import GoalBox from '../../../pages/newPost/components/GoalPreview/GoalBox'

interface Props {
  goalData: any
  setTip: (value: number) => void
  isMyPost: boolean
  disabled: boolean
}

const PostGoal: FC<Props> = ({ goalData, setTip, isMyPost = false, disabled }) => {
  return (
    <div className='post__goal'>
      <GoalBox
        title={goalData.text}
        tipped={goalData.tipped}
        goal={goalData.goal}
        options={[5, 10, 15]}
        setTip={setTip}
        isMyPost={isMyPost}
        disabled={disabled}
      />
    </div>
  )
}

export default PostGoal
