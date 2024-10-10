import { FC, useState } from 'react'
import './_dropdown.scss'
import { IDropdown } from '../../../types/interfaces/IDropdown'
import RadioButton from '../../Common/RadioButton/RadioButton'
import BlackButton from '../../Common/BlackButton/BlackButton'

const Dropdown: FC<IDropdown> = ({ customClass, head, apply, title, elements, type, bottomSection, applyBot }) => {
  const [dropdownActive, setDropdownActive] = useState<boolean>(false)
  const [tempValue, setTempValue] = useState<string>('')
  const [botTempValue, setBotTempValue] = useState<string>()

  const renderDropdownRadioList = () => {
    if (type === 'radio') {
      return (
        <>
          {elements.map((item: { value: string; name: string }, i: number) => (
            <li
              key={i}
              className='dropdown__body__item'
              onClick={() => {
                tempValue !== item.value ? setTempValue(item.value) : setTempValue('')
              }}
            >
              {item.name}
              <RadioButton active={tempValue === item.value} />
            </li>
          ))}
          {bottomSection?.map((item: { value: string; name: string }, i: number) => (
            <li
              key={i}
              className='dropdown__body__item'
              onClick={() => {
                botTempValue !== item.value ? setBotTempValue(item.value) : setBotTempValue('')
              }}
            >
              {item.name}
              <RadioButton active={botTempValue === item.value} />
            </li>
          ))}
        </>
      )
    }
  }

  return (
    <div className={`dropdown ${customClass ? customClass : ''}`}>
      <div className='dropdown__head' onClick={() => setDropdownActive(!dropdownActive)}>
        {head}
      </div>
      <div className={`dropdown__body ${dropdownActive ? 'dropdown__body--visible' : ''}`}>
        <h1>{title}</h1>
        <ul>{type === 'radio' ? renderDropdownRadioList() : ''}</ul>
        <BlackButton
          text='Apply'
          clickFn={() => {
            apply(tempValue)
            applyBot && applyBot(botTempValue)
            setDropdownActive(!dropdownActive)
          }}
          customClass='dropdown__button'
        />
      </div>
    </div>
  )
}

export default Dropdown
