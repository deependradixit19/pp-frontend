import { FC } from 'react'
import './_checkboxField.scss'
import { ICheckboxField } from '../../../types/interfaces/ICheckboxField'

const CheckboxField: FC<ICheckboxField> = ({ id, value, label, checked, changeFn, customClass }) => {
  return (
    <div className={`checkboxField ${customClass ? customClass : ''}`}>
      <input hidden id={id} type='checkbox' checked={checked} value={value} onChange={changeFn} />
      <div onClick={() => changeFn()} className={`checkboxField__box ${checked ? 'checkboxField__box--selected' : ''}`}>
        <div className='checkboxField__box__check' />
      </div>
      <label htmlFor={id}>{label}</label>
    </div>
  )
}

export default CheckboxField
