import { ErrorMessage, Field } from 'formik'
import { FC } from 'react'

export const FormikInputField: FC<{
  type?: string
  label: string
  name: string
  value: string | number
}> = ({ type = 'text', label, name, value }) => {
  return (
    <div className='formikInput'>
      <label className={`formikInput__label ${value ? 'filled' : ''}`} htmlFor={name}>
        {label}
      </label>
      <Field
        // disabled={value}
        name={name}
        type={type}
        className={`formikInput__field formikInput__field--${value ? 'filled' : ''}`}
      />
      <ErrorMessage component='div' className='formikInput__error' name={name} />
    </div>
  )
}
