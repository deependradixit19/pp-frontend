import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CheckboxField from '../../../../components/Form/CheckboxField/CheckboxField'
import Button from '../../../../components/UI/Buttons/Button'
import LiveModal from '../LiveModal'
import './_tipModal.scss'

interface Props {
  onClose: () => void
  data: {
    goal: string
    reward: string
    showGoal: boolean
  }
  setTipModalData: (data: { goal: string; reward: string; showGoal: boolean }) => void
}

const TipModal: FC<Props> = ({ onClose, data, setTipModalData }) => {
  const { goal, reward, showGoal } = data

  const [localGoal, setLocalGoal] = useState(goal)
  const [localReward, setLocalReward] = useState(reward)
  const [localShowGoal, setLocalShowGoal] = useState(showGoal)

  const { t } = useTranslation()

  return (
    <LiveModal title='Tip Goal' onClose={onClose}>
      <div className='tipmodal'>
        <p className='tipmodal__note'>{t('hereYouCanAddTipGoalsForYourStream')}</p>
        <div className='tipmodal__input-group goal'>
          <label htmlFor='goal-input'>{t('goal')}</label>
          <div className='input-wrapper'>
            {localGoal && <span>$</span>}
            <input
              style={{ paddingLeft: localGoal ? '1.5rem' : '0' }}
              value={localGoal}
              type='number'
              id='goal-input'
              placeholder={t('noGoal')}
              onChange={e => setLocalGoal(e.target.value)}
            />
          </div>
        </div>
        <div className='tipmodal__input-group reward'>
          <label htmlFor='reward-input'>{t('reward')}</label>
          <textarea
            value={localReward}
            id='reward-input'
            placeholder={t('rewardOptional')}
            rows={4}
            maxLength={500}
            onChange={e => setLocalReward(e.target.value)}
          />
        </div>
        <div className='char-num'>
          <span>{localReward.length}</span> / 500 {t('characters')}
        </div>
        <div className='tipmodal__consent'>
          <CheckboxField
            id='tipmodalConsent'
            value='show-goal'
            checked={localShowGoal}
            label={t('showTipGoalToVisitors')}
            changeFn={() => setLocalShowGoal(localShowGoal => !localShowGoal)}
            customClass='dark-20'
          />
        </div>
        <div className='tipmodal__buttons'>
          <Button
            text={t('cancel')}
            color='dark-grey'
            font='mont-14-normal'
            type='transparent--borderless'
            width='fit'
            height='3'
            padding='1-15'
            clickFn={onClose}
          />
          <Button
            text={t('save')}
            color='transparent'
            font='mont-14-normal'
            type='transparent--blue'
            width='10'
            height='3'
            clickFn={() => {
              setTipModalData({
                goal: localGoal,
                reward: localReward,
                showGoal: localShowGoal
              })
              onClose()
            }}
          />
        </div>
      </div>
    </LiveModal>
  )
}

export default TipModal
