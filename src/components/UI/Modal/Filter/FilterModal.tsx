import { FC, useEffect, useState } from 'react'
import './_filterModal.scss'
import { useTranslation } from 'react-i18next'
import { useModalContext } from '../../../../context/modalContext'
import RadioButton from '../../../Common/RadioButton/RadioButton'
import Button from '../../Buttons/Button'

const FilterModal: FC<{
  elements: any
  applyFn: any
  selectedFilters?: string[]
}> = ({ elements, applyFn, selectedFilters }) => {
  const [tempVal, setTempVal] = useState<string[]>([])

  const modalData = useModalContext()
  const { t } = useTranslation()

  useEffect(() => {
    if (selectedFilters) {
      setTempVal(selectedFilters)
    }
  }, [selectedFilters])

  return (
    <div className='filterModal__sort__wrapper'>
      {elements?.filters ? (
        <ul className='filterModal__sort'>
          {elements?.filters?.map((item: { value: string; name: string }, key: number) => (
            <li
              className='filterModal__sort__item'
              key={key}
              onClick={() => {
                // if (tempVal !== item.value) {
                //   setTempVal(item.value);
                // } else {
                //   setTempVal('');
                // }
              }}
            >
              {item.name}
              <RadioButton active={false} />
            </li>
          ))}
        </ul>
      ) : (
        ''
      )}

      <Button text={t('reset')} color='grey' font='mont-14-normal' width='13' height='3' />
      <Button
        text={t('apply')}
        color='black'
        font='mont-14-normal'
        width='13'
        height='3'
        clickFn={() => {
          applyFn(tempVal)
          modalData.clearModal()
        }}
      />
    </div>
  )
}

export default FilterModal
