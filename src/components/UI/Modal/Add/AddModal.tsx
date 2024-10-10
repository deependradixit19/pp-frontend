import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InputCard from '../../../Form/InputCard/InputCard'
import Button from '../../Buttons/Button'
import './_addModal.scss'

const AddModal: FC = () => {
  const [inputText, setInputText] = useState<string>('')
  const { t } = useTranslation()
  return (
    <div>
      <InputCard
        type='text'
        maxChars={30}
        label='List Name'
        value={inputText}
        changeFn={(val: any) => setInputText(val)}
      />
      <p className='addModal__numberOfChars'>
        <span className='addModal__numberOfChars--input'>{inputText.length}</span> /{' '}
        <span className='addModal__numberOfChars--max'>30</span> {t('characters')}
      </p>
      <div className='addModal__buttons'>
        <Button
          text={t('back')}
          color='transparent'
          type='transparent--black1px'
          width='10'
          height='3'
          font='mont-14-normal'
          customClass='addModal__buttons__backBtn'
        />
        <Button text={t('create')} color='blue' width='15' height='3' font='mont-14-normal' />
      </div>
    </div>
  )
}

export default AddModal
