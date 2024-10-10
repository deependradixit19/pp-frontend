import { FC } from 'react'
import { IconCloseSm } from '../../../../assets/svg/sprite'
import { IGoal } from '../../../../types/interfaces/ITypes'
import GoalBox from './GoalBox'
import './_goalPreview.scss'

interface Props {
  goalData: IGoal
  clearGoalData: () => void
}

const OPTIONS = [5, 10, 15]

export const GoalPreview: FC<Props> = ({ goalData, clearGoalData }) => {
  return (
    <div className='goalPreview'>
      <div
        className='goalPreview__wrapper'
        style={{
          backgroundImage: goalData.goalBgImg ? `url(${goalData.goalBg})` : goalData.goalBg
        }}
      >
        <div className='goalPreview__close' onClick={clearGoalData}>
          <IconCloseSm color='#0D1444' />
        </div>
        <GoalBox title={goalData.title} goal={goalData.amount} tipped='0' options={OPTIONS} disabled isMyPost={true} />
      </div>
    </div>
  )
}

export default GoalPreview
