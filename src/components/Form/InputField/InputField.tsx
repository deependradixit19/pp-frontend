import React, { FC, useState, useRef, useCallback, useMemo } from 'react'
import './_inputField.scss'
import { useTranslation } from 'react-i18next'
import { IInputField } from '../../../types/interfaces/IInputField'

/* ----------------------------------------------------------
validation process:
(set validation type, add function to lock the button and error message popup
  to the component where you're using InputField)
validate="letters/numbers"
validationCheck=(invalid: boolean, inputValue: string, originalValidationMessage: string | null) => {
  // 1: new, optional override of original validation:
  if (newPass !== confirmPass) {
    setRegistrationLocked(true)
    // message is optional, validationErrorMessage will be used if not passed
    return { isValid: false, message: "Passwords don't match" }
  }
  // or 2: run your code, no validation override, return type: void
  setRegistrationLocked(val)
}
validationErrorMessage="Username can contain only letters and numbers."

update: Added functionality to validationCheck function to use it to override validation if needed.
it should be still compatible with the old way.

todo: extract common validation functions to another file for common use
---------------------------------------------------------*/

const InputField: FC<IInputField> = ({
  id,
  type,
  value,
  label,
  changeFn,
  validate,
  validationCheck,
  validationErrorMessage,
  validationCharactersNumber,
  inputvisible,
  swaptypeicon,
  swaptype,
  additionalProps,
  customClass,
  loginAttempted
}) => {
  const [invalidInput, setInvalidInput] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { t } = useTranslation()

  const inputRef = useRef<HTMLInputElement>(null)
  const validationRules = useMemo(() => validate?.split('|'), [validate])

  const validateInput = useCallback(
    (text: string): void => {
      const validationToggle = (isValid: boolean, message: string | null) => {
        const validationOverride = validationCheck?.(!isValid, text, message)

        if (validationOverride) {
          isValid = validationOverride.isValid
          message = validationOverride.isValid ? null : validationOverride.message ?? validationErrorMessage ?? null
        }

        if (isValid) {
          setInvalidInput(false)
          setErrorMessage(null)
        } else {
          setInvalidInput(true)
          setErrorMessage(message)
        }
      }

      let isValid: [boolean, string | null] = [true, null]

      validationRules?.every(rule => {
        switch (rule) {
          case 'required':
            if (text.length > 0) {
              isValid = [true, null]
              return true
            } else {
              isValid = [false, t('fieldIsRequired')]
              return false
            }

          case 'only_letters':
            if (!/^[a-zA-Z\s]*$/.test(text)) {
              isValid = [false, `${validationErrorMessage}`]
              return false
            } else {
              isValid = [true, null]
              return true
            }

          case 'letters/numbers':
            if (!/^[a-zA-Z0-9._]*$/.test(text)) {
              isValid = [false, `${validationErrorMessage}`]
              return false
            } else {
              if (validationCharactersNumber) {
                if (text.length >= validationCharactersNumber) {
                  isValid = [true, null]
                  return true
                } else {
                  isValid = [false, `${t('mustHaveAtLeast')} ${validationCharactersNumber} ${t('characters')}`]
                  return false
                }
              } else {
                isValid = [true, null]
                return true
              }
            }

          case 'letters/numbers/spaces':
            if (!/^[a-zA-Z0-9._'\s]*$/.test(text)) {
              isValid = [false, `${validationErrorMessage}`]
              return false
            } else {
              if (validationCharactersNumber) {
                if (text.length >= validationCharactersNumber) {
                  isValid = [true, null]
                  return true
                } else {
                  isValid = [false, `${t('mustHaveAtLeast')} ${validationCharactersNumber} ${t('characters')}`]
                  return false
                }
              } else {
                isValid = [true, null]
                return true
              }
            }

          case 'email':
            if (!/\S+@\S+\.\S+/.test(text) && text.length > 0) {
              isValid = [false, t('error:errorEmail')]
              return false
            } else {
              isValid = [true, null]
              return true
            }

          case 'password':
            if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(text) && text.length > 0) {
              isValid = [false, validationErrorMessage || '']
              return false
            } else {
              isValid = [true, null]
              return true
            }

          default:
            return true
        }
      })

      validationToggle(isValid[0], isValid[1])
    },
    [t, validationCheck, validationRules, validationErrorMessage, validationCharactersNumber]
  )

  return (
    <div className={`inputfield ${customClass ? customClass : ''}`}>
      <label className={`inputfield__label ${`${value}`.length > 0 ? 'inputfield__label--active' : ''}`} htmlFor={id}>
        {label}
      </label>
      <input
        ref={inputRef}
        className={`${invalidInput ? 'inputfield--invalid' : ''} ${loginAttempted ? 'inputfield--loginattempted' : ''}`}
        onClick={(e: React.MouseEvent<HTMLElement>) => e.preventDefault()}
        id={id}
        type={type}
        value={value}
        onChange={(e: React.FormEvent<HTMLInputElement>): void => {
          if (errorMessage) {
            validateInput(e.currentTarget.value)
          }

          changeFn(e.currentTarget.value)
        }}
        onBlur={(e: any) => {
          validateInput(e.currentTarget.value)
          if (value.toString().length === 0 && validationCharactersNumber) {
            setInvalidInput(true)
            setErrorMessage(`${t('mustHaveAtLeast')} ${validationCharactersNumber} ${t('characters')}`)
          }
          if (validationRules?.includes('email') && value.toString().length === 0) {
            setInvalidInput(true)
            setErrorMessage(t('error:errorEmailBlank'))
          }
        }}
        onKeyDownCapture={e => {
          if (type === 'number' && validationRules?.includes('only_positive')) {
            if ((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode === 8) {
              return
            } else {
              e.preventDefault()
            }
          }
        }}
        {...additionalProps}
      />
      {swaptypeicon && (
        <div
          className='inputfield__eye__wrapper'
          onClick={() => {
            inputRef.current!.focus()
            swaptype!()
          }}
        >
          <div className={`inputfield__eye ${inputvisible ? 'inputfield__eye--visible' : ''}`} />
        </div>
      )}
      {invalidInput && (
        <div
          className={`inputfield__error${validationErrorMessage ? ' inputfield__error--active' : ''}${
            validate?.includes('password') && value.toString().length > 0 ? ' inputfield__error--pass' : ''
          }`}
        >
          {errorMessage}
        </div>
      )}
    </div>
  )
}

export default InputField
