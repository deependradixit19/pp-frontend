import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import './_addPoll.scss'

interface Props {
  question: string
  handleQuestionChange: (value: string) => void
  validationError?: string
}

const YesNoQuestion: FC<Props> = ({ question, handleQuestionChange, validationError }) => {
  const { t } = useTranslation()
  return (
    <div className='yesNoQuestion'>
      <div className='yesNoQuestion__input'>
        <input
          type='text'
          name='question'
          id='question'
          placeholder={`${t('askAQuestion')}...`}
          maxLength={25}
          value={question}
          onChange={e => handleQuestionChange(e.target.value)}
        />
        <div className='yesNoQuestion__input__error'>{validationError}</div>
      </div>

      <div className='yesNoQuestion__buttons'>
        <div className='yesNoQuestion__button yesNoQuestion__button--yes'>{t('yes')}</div>
        <div className='yesNoQuestion__button yesNoQuestion__button--no'>{t('no')}</div>
      </div>
    </div>
  )
}

export default YesNoQuestion
