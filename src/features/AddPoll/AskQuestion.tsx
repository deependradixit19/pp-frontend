import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import './_addPoll.scss'

interface Props {
  question: string
  handleQuestionChange: (value: string) => void
  validationError?: string
}

const AskQuestion: FC<Props> = ({ question, handleQuestionChange, validationError }) => {
  const { t } = useTranslation()
  return (
    <div className='askQuestion'>
      <div className='askQuestion__header'>
        <input
          type='text'
          value={question}
          name='askQuestionTitle'
          id='askQuestionTitle'
          placeholder={`${t('askMeAQuestion')}...`}
          maxLength={25}
          onChange={e => handleQuestionChange(e.target.value)}
        />
        <div className='askQuestion__header__error'>{validationError}</div>
      </div>
      <div className='askQuestion__content'>
        <div className='askQuestion__option'>
          <div className='askQuestion__option__input'>
            <input type='text' name='questionText' placeholder={t('typeSomething')} maxLength={25} disabled />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AskQuestion
