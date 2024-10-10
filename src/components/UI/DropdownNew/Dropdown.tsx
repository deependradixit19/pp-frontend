import { FC, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import IconButton from '../../../components/UI/Buttons/IconButton'
import ActionCard from '../../../features/ActionCard/ActionCard'
import { AllIcons } from '../../../helpers/allIcons'
import { IDropdownOption } from '../../../types/interfaces/IDropdownOption'
import Button from '../Buttons/Button'

interface Props {
  title: string
  options: IDropdownOption[]
  activeCategory: string
  defaultCategory: string
  setActiveCategory(category: string | null): void
}

const Dropdown: FC<Props> = ({ title, options, activeCategory, defaultCategory, setActiveCategory }) => {
  const [dropdownActive, setDropdownActive] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<string>(activeCategory)
  const [selectedText, setSelectedText] = useState<string>(defaultCategory)

  const { t } = useTranslation()

  useEffect(() => {
    options.forEach(option => {
      if (option.value === activeCategory) {
        setSelectedText(option.label)
      }
    })
    setSelectedOption(activeCategory)
  }, [activeCategory])

  const handleSubmit = () => {
    setActiveCategory(selectedOption)
    setDropdownActive(false)
  }

  return (
    <>
      <div className='dropdown' onClick={() => setDropdownActive(!dropdownActive)}>
        <IconButton icon={AllIcons.button_list} type={'black'} size={'dropdown'} />
        <div className='dropdown__placeholder'>{selectedText}</div>
      </div>
      <div className={`dropdown__body ${dropdownActive ? 'dropdown__body--visible' : ''}`}>
        <div className='dropdown__body--header'>
          <h3 className='dropdown__body--title'>{title}</h3>
          <img src={AllIcons.close} alt={t('close')} onClick={() => setDropdownActive(false)} />
        </div>
        <ul>
          {options.map(option => {
            return (
              <ActionCard
                key={option.value}
                icon={option.icon}
                text={option.label}
                hasRadio={true}
                toggleActive={option.value === selectedOption}
                toggleFn={() => {
                  setSelectedOption(option.value)
                  setSelectedText(option.label)
                }}
              />
            )
          })}
          <ActionCard customClass='text__light' icon={AllIcons.square_plus} text={t('addNew')} />
        </ul>
        <div className='button__wrapper'>
          <Button text={t('apply')} color='black' width='14' height='3' font='mont-14-normal' clickFn={handleSubmit} />
        </div>
      </div>
    </>
  )
}

export default Dropdown
