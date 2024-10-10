import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './_goalPreview.scss'

interface Props {
  title: string
  tipped: string
  goal: string
  options: number[]
  isMyPost: boolean
  disabled: boolean
  setTip?: (val: number) => void
}

const calculatePercentage = (total: number, count: number) => {
  return Math.round((100 * count) / total)
}
export const GoalBox: FC<Props> = ({ title, tipped, goal, options, isMyPost, disabled, setTip }) => {
  const { t } = useTranslation()
  return (
    <div className='goalBox'>
      <div className='goalBox__header'>
        <input type='text' name='goalTitle' maxLength={25} disabled value={title} />
      </div>
      <div className='goalBox__content'>
        <div className={`goalBox__top`}>
          <div
            style={{
              width: `${calculatePercentage(parseInt(goal), parseInt(tipped))}%`
            }}
            className='goalBox__percentage'
          ></div>
          <div className='goalBox__amount goalBox__tipped'>
            <div className='goalBox__amount__group'>
              <span>$</span>
              {tipped}
            </div>
            <small>{t('tipped')}</small>
          </div>
          <div className='goalBox__amount goalBox__goal'>
            <div className='goalBox__amount__group'>
              <span>$</span>
              {goal}
            </div>
            <small>{t('goal')}</small>
          </div>
        </div>
        {!isMyPost && (
          <div className='goalBox__options'>
            <div className='goalBox__options__title'>{t('tipOptions')}</div>
            <div className={`goalBox__options__list ${disabled ? 'goalBox__options__list--disabled' : ''}`}>
              {options.map((option, idx) => (
                <button
                  key={idx}
                  className='goalBox__option'
                  onClick={() => {
                    setTip && setTip(option)
                  }}
                >
                  ${option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GoalBox
