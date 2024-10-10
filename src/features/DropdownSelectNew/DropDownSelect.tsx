import { FC, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import './_dropdownSelect.scss'

const DropDownSelect: FC<{
  options: { color?: string; label: string; value: string }[]
  placeholder: string
  search: string
  setSearch: (key: string) => void
  selectedOption: string
  setSelectedOption: (key: string) => void
  icon?: string | JSX.Element | JSX.Element[]
  iconWidth?: string | number
  customClass?: string
  notSearchable?: boolean
}> = ({
  options,
  placeholder,
  search,
  setSearch,
  selectedOption,
  setSelectedOption,
  icon,
  iconWidth,
  customClass,
  notSearchable = false
}) => {
  const inputElement = useRef<any>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const { t } = useTranslation()

  return (
    <div
      className={`dropdown-select-container ${customClass ?? ''}`}
      onBlur={() => {
        setDropdownOpen(false)
        setSearch('')
      }}
    >
      {icon && (
        <div
          className='dropdown-select-icon'
          style={{ width: `${iconWidth ? `${iconWidth}px` : '50px'}` }}
          onClick={() => inputElement.current.focus()}
        >
          {typeof icon === 'string' ? <img src={`${icon}`} alt={t('dropdownIcon')} /> : icon}
        </div>
      )}

      <input
        ref={inputElement}
        readOnly={notSearchable}
        type='text'
        placeholder={placeholder}
        onFocus={() => setDropdownOpen(true)}
        value={search}
        onChange={e => setSearch(e.target.value)}
        className={`dropdown-select-input ${dropdownOpen && 'dropdown-select-input-open'}`}
        style={{
          paddingLeft: `${icon ? `${iconWidth ? `${iconWidth}px` : '50px'}` : '15px'}`
        }}
      />

      <div className={`dropdown-select-options ${dropdownOpen && 'dropdown-select-options-open'}`}>
        {search.trim() !== ''
          ? options
              ?.filter(option => option.label.toLowerCase().includes(search.toLowerCase()))
              .map(option => (
                <div
                  key={option.value}
                  className='dropdown-select-option'
                  onClick={() => {
                    setSelectedOption(option.value)
                    setDropdownOpen(false)
                    setSearch('')
                  }}
                >
                  {option.label}
                </div>
              ))
          : options?.map(option => (
              <div
                key={option.value}
                className='dropdown-select-option'
                onClick={() => {
                  setSelectedOption(option.value)
                  setDropdownOpen(false)
                  setSearch('')
                }}
              >
                {option.color && <div className='colorDots' style={{ backgroundColor: option.color }}></div>}
                {option.label}
              </div>
            ))}
      </div>
      <div
        className={`dropdown-select-selected-option ${
          !dropdownOpen && selectedOption !== '' && 'dropdown-select-selected-option-open'
        }`}
        onClick={() => {
          setDropdownOpen(true)
          inputElement.current.focus()
        }}
        style={{
          left: `${icon ? `${iconWidth ? `${iconWidth}px` : '50px'}` : '15px'}`
        }}
      >
        {options?.filter(option => option.value.includes(selectedOption))?.[0]?.label}
      </div>
    </div>
  )
}

export default DropDownSelect
