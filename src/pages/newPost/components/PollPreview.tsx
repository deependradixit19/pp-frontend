import { t } from 'i18next'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { IconCloseSm } from '../../../assets/svg/sprite'
import { IPoll } from '../../../types/interfaces/ITypes'
import './_pollPreview.scss'

type TypeFrom = 'new' | 'preview'

interface Props {
  pollData: IPoll
  from?: TypeFrom
  clearPollData?: () => void
  onChange?: Function
}

export const Poll: FC<{
  title: string
  options: string[] | null
  from: TypeFrom
  onChange?: Function
}> = ({ title, options, from = 'new', onChange }) => {
  const { t } = useTranslation()
  const keys = [t('a'), t('b'), t('c'), t('d')]
  return (
    <div className='poll'>
      <div className='poll__header'>
        <p>{title}</p>
      </div>
      <div className='poll__content'>
        {options?.map((option, key) => {
          if (option) {
            return (
              <label key={key} htmlFor={option} className={`poll__option`}>
                <input
                  id={option}
                  type='radio'
                  name='poll_answers'
                  value={option}
                  disabled={from === 'new'}
                  onChange={event => !!onChange && onChange(event.target.value)}
                />
                <span className='poll__option__icon'>{keys[key]}</span>
                <span className='poll__option__input'>{option}</span>
              </label>
            )
          }
        })}
      </div>
    </div>
  )
}

export const AskQuestion: FC<{
  title: String
  from: TypeFrom
  onChange?: Function
}> = ({ title, from = 'new', onChange }) => {
  return (
    <div className='askQuestion'>
      <div className='askQuestion__header'>
        <p>{title}</p>
      </div>
      <div className='askQuestion__content'>
        <div className='askQuestion__option'>
          <div className='askQuestion__option__input'>
            <input
              type='text'
              name='questionText'
              placeholder={t('typeSomething')}
              maxLength={25}
              disabled={from === 'new'}
              onChange={event => !!onChange && onChange(event.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export const YesNoQuestion: FC<{
  title: string
  from: TypeFrom
  onChange?: Function
}> = ({ title, from = 'new', onChange }) => {
  return (
    <div className='yesNoQuestion'>
      <div className='yesNoQuestion__input'>{title}</div>
      <div className='yesNoQuestion__buttons'>
        <button
          className='yesNoQuestion__button yesNoQuestion__button--yes'
          disabled={from === 'new'}
          onClick={() => !!onChange && onChange('yes')}
        >
          {t('yes')}
        </button>
        <button
          className='yesNoQuestion__button yesNoQuestion__button--no'
          disabled={from === 'new'}
          onClick={() => !!onChange && onChange('no')}
        >
          {t('no')}
        </button>
      </div>
    </div>
  )
}

const PollPreview: FC<Props> = ({ pollData, from = 'new', clearPollData, onChange }) => {
  return (
    <div className='pollPreview'>
      <div
        className='pollPreview__wrapper'
        style={{
          backgroundImage: pollData.pollBgImg ? `url(${pollData.pollBg})` : pollData.pollBg
        }}
      >
        {from === 'new' && (
          <div className='pollPreview__close' onClick={clearPollData}>
            <IconCloseSm color='#0D1444' />
          </div>
        )}
        {pollData?.type === 'poll' && (
          <Poll title={pollData.question} options={pollData.answers} from={from} onChange={onChange} />
        )}
        {pollData?.type === 'ask' && <AskQuestion title={pollData.question} from={from} onChange={onChange} />}
        {pollData?.type === 'yes/no' && <YesNoQuestion title={pollData.question} from={from} onChange={onChange} />}
      </div>
    </div>
  )
}

export default PollPreview
