import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import './_addPoll.scss'

interface Props {
  title: string
  options: {
    a: string
    b: string
    c: string
    d?: string
  }
  handleOptionChange: (key: string, value: string) => void
  setPollTitle: (value: string) => void
  handleAddOption: () => void
  validationError?: string
}

const Poll: FC<Props> = ({ title, options, handleAddOption, setPollTitle, handleOptionChange, validationError }) => {
  const { t } = useTranslation()
  return (
    <div className='poll'>
      <div className='poll__header'>
        <input
          type='text'
          name='pollTitle'
          id='pollTitle'
          placeholder={`${t('pollName')}...`}
          maxLength={25}
          value={title}
          onChange={e => setPollTitle(e.target.value)}
        />
      </div>
      <div className='poll__content'>
        <div className={`poll__option poll__option--${!options.a.length ? 'empty' : ''}`}>
          <div className='poll__option__icon'>{t('a')}</div>
          <div className='poll__option__input'>
            <input
              type='text'
              name='optionText'
              placeholder={t('option1')}
              maxLength={25}
              value={options.a}
              onChange={e => handleOptionChange('a', e.target.value)}
            />
          </div>
        </div>
        <div className={`poll__option poll__option--${!options.b.length ? 'empty' : ''}`}>
          <div className='poll__option__icon'>{t('b')}</div>
          <div className='poll__option__input'>
            <input
              type='text'
              name='optionText'
              placeholder={t('option2Required')}
              maxLength={25}
              value={options.b}
              onChange={e => handleOptionChange('b', e.target.value)}
            />
          </div>
        </div>
        <div className={`poll__option poll__option--${!options.c.length ? 'empty' : ''}`}>
          <div className='poll__option__icon'>{t('c')}</div>
          <div className='poll__option__input'>
            <input
              type='text'
              name='optionText'
              placeholder={t('option3')}
              maxLength={25}
              value={options.c}
              onChange={e => handleOptionChange('c', e.target.value)}
            />
          </div>
        </div>
        {options.hasOwnProperty('d') ? (
          <div className={`poll__option poll__option--${!options.d?.length ? 'empty' : ''}`}>
            <div className='poll__option__icon'>{t('d')}</div>
            <div className='poll__option__input'>
              <input
                type='text'
                name='optionText'
                placeholder={t('option4')}
                maxLength={25}
                value={options.d}
                onChange={e => handleOptionChange('d', e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className={`poll__option poll__option--add`} onClick={handleAddOption}>
            <div className='poll__option__icon'>+</div>
            <div className='poll__option__text'>{t('add')}</div>
          </div>
        )}
        {validationError && <div className='poll__content__error'>{validationError}</div>}
      </div>
    </div>
  )
}

export default Poll
