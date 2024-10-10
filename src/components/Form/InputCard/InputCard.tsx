import { FC, useRef, useState, useEffect } from 'react'
import './_inputCard.scss'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { useTranslation } from 'react-i18next'
import { Icons } from '../../../helpers/icons'
import { AllIcons } from '../../../helpers/allIcons'
import { useUserContext } from '../../../context/userContext'
import { IInputCard } from '../../../types/interfaces/IInputCard'

import ImgInCircle from '../../UI/ImgInCircle/ImgInCircle'
import IconButton from '../../UI/Buttons/IconButton'

import placeholderAvatar from '../../../assets/images/user_placeholder.png'

const InputCard: FC<IInputCard> = ({
  hasAvatar = false,
  hasIcon = false,
  icon,
  type,
  label,
  value,
  changeFn,
  keyDownFn,
  errorActive,
  errorMessage,
  hasTypeChanger,
  validate,
  customClass,
  isTextArea,
  hasDesc,
  desc,
  info,
  disabled = false,
  maxChars,
  iconRight,
  iconSmaller,
  placeholder,
  validateFn,
  hasError,
  isValid,
  blurFn,
  focusFn,
  mask
}) => {
  const [inputType, setInputType] = useState<string>('text')
  const [inputError, setInputError] = useState<boolean>(false)
  const [inputErrorMsg, setInputErrorMsg] = useState<string>('')
  const [inputFocused, setInputFocused] = useState(false)

  const userData = useUserContext()
  const { t } = useTranslation()

  const inputRef = useRef<any>(null)
  const labelRef = useRef<any>(null)

  useEffect(() => {
    setInputType(type)
  }, [type])

  useEffect(() => {
    if (`${value}`.length > 0) {
      labelRef.current.classList.add('inputcard__label--filled')
    } else {
      labelRef.current.classList.remove('inputcard__label--filled')
    }
  }, [value])

  const validateInput = (text: string): void => {
    switch (validate) {
      case 'required':
        if (text.length > 0) {
          setInputError(false)
        } else {
          setInputErrorMsg(t('error:errorRequiredField'))
          setInputError(true)
        }
        break

      case 'letters':
        if (/^[a-zA-Z\s]*$/.test(text)) {
          setInputError(false)
        } else {
          setInputErrorMsg(t('error:errorLettersValidation'))
          setInputError(true)
        }
        break

      case 'letters&required':
        if (/^[a-zA-Z\s]*$/.test(text) && text.length > 0) {
          setInputError(false)
        } else {
          setInputErrorMsg(t('error:errorLettersRequiredValidation'))
          setInputError(true)
        }
        break

      case 'number':
        if (/[0-9]/.test(text)) {
          setInputError(false)
        } else {
          setInputErrorMsg(t('error:errorNumbersValidation'))
          setInputError(true)
        }
        break

      case 'numbers&required':
        if (/[0-9]/.test(text) && text.length > 0) {
          setInputError(false)
        } else {
          setInputErrorMsg(t('error:errorNumbersRequiredValidation'))
          setInputError(true)
        }
        break

      case 'letters/numbers':
        if (`${value}`.length < 8) {
          inputRef.current.classList.add('inputcard__input--error')
          setInputError(true)
          setInputErrorMsg(t('error:errorUserNameMinChar'))
        } else {
          if (/^[a-zA-Z0-9._]*$/.test(text)) {
            setInputError(false)
          } else {
            setInputErrorMsg(t('error:errorUserNameInputType'))
            setInputError(true)
          }
        }
        break

      case 'password':
        if (/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(text) && text.length > 0) {
          setInputError(false)
        } else {
          setInputErrorMsg(t('error:errorPasswordVaidation'))
          setInputError(true)
        }
        break

      case 'email':
        if (/\S+@\S+\.\S+/.test(text) && text.length > 0) {
          setInputError(false)
        } else {
          setInputErrorMsg(t('error:errorEmail'))
          setInputError(true)
        }
        break

      case 'cvc':
        if (/[0-9]/.test(text) && text.length === 3) {
          setInputError(false)
        } else {
          setInputError(true)
        }
        break

      case 'cardNo':
        if (/[0-9]/.test(text) && text.length < 17) {
          setInputError(false)
        } else {
          setInputError(true)
        }
        break
    }
  }

  return (
    <div
      className={`inputcard ${hasAvatar || hasIcon ? 'inputcard--withavatar' : ''}
      ${iconRight ? 'inputcard--withavatar--right' : ''}
      ${customClass ? customClass : ''}`}
    >
      {hasAvatar ? (
        <ImgInCircle type='profile--small' customClass='inputcard__avatar'>
          <img
            src={userData.cropped_avatar?.url || userData.avatar.url || placeholderAvatar}
            alt={t('profileAvatar')}
          />
        </ImgInCircle>
      ) : (
        ''
      )}
      {hasIcon ? (
        <IconButton
          icon={icon}
          customClass={`inputcard__icon ${iconRight ? 'inputcard__icon--right' : ''} ${
            iconSmaller ? 'inputcard__icon--smaller' : ''
          }`}
        />
      ) : (
        ''
      )}
      {!isTextArea ? (
        <>
          <input
            disabled={disabled}
            ref={inputRef}
            type={inputType}
            placeholder={placeholder || ''}
            className={`inputcard__input ${disabled ? 'disabled' : ''} ${value ? 'inputcard__input--filled' : ''} ${
              inputType === 'password' ? 'inputcard__input--pass' : ''
            } ${inputError ? 'inputcard__input--error' : ''}
             ${!inputFocused && value && mask ? 'inputcard-input-masked' : ''}`}
            value={value}
            maxLength={maxChars && maxChars}
            onFocus={() => {
              labelRef.current.classList.add('inputcard__label--hide')
              setInputFocused(true)
              focusFn && focusFn()
            }}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
              labelRef.current.classList.remove('inputcard__label--hide')
              inputType === 'string' && validateInput(`${value}`)
              setInputFocused(false)
              !isValid && validateFn && validateFn(e.target.value)
              hasError && hasError(inputError)
              blurFn && blurFn()
            }}
            onKeyDown={keyDownFn}
            onChange={(e: any) => {
              setInputError(false)
              if (e.currentTarget.value) {
                labelRef.current.classList.add('inputcard__label--hide')
              }
              validateFn && validateFn(e.target.value)
              changeFn(e.currentTarget.value)
            }}
          />
          {mask && (
            <div className={`inputcard-mask ${!inputFocused && value ? 'inputcard-mask-visible' : ''}`}>{mask}</div>
          )}
        </>
      ) : (
        <textarea
          disabled={disabled}
          ref={inputRef}
          maxLength={maxChars && maxChars}
          placeholder={placeholder || ''}
          className={`inputcard__input inputcard__input--textarea ${disabled ? 'disabled' : ''} ${
            value ? 'inputcard__input--filled' : ''
          } ${inputType === 'password' ? 'inputcard__input--pass' : ''} ${inputError ? 'inputcard__input--error' : ''}`}
          value={value}
          onFocus={() => {
            labelRef.current.classList.add('inputcard__label--hide')
            focusFn && focusFn()
          }}
          onBlur={() => {
            labelRef.current.classList.remove('inputcard__label--hide')
            // blurValidation();
            inputType === 'string' && validateInput(`${value}`)
            hasError && hasError(inputError)
            blurFn && blurFn()
          }}
          onChange={(e: any) => {
            setInputError(false)
            if (e.currentTarget.value) {
              labelRef.current.classList.add('inputcard__label--hide')
            }
            changeFn(e.currentTarget.value)
          }}
        />
      )}
      <span ref={labelRef} className={`inputcard__label`}>
        {label}
      </span>
      {hasTypeChanger ? (
        <img
          className='inputcard__eye'
          src={Icons.eye}
          onClick={() => {
            inputType === 'password' ? setInputType('text') : setInputType('password')
            inputRef.current.focus()
          }}
          alt={t('togglePasswordVisibility')}
        />
      ) : (
        ''
      )}
      {info ? (
        <div className='inputcard__info'>
          <img src={AllIcons.info_circle} alt={t('info')} data-tip={info} />
          <ReactTooltip variant='dark' float={false} />
        </div>
      ) : (
        ''
      )}
      {errorActive ? (
        <div className='inputcard__error'>
          <p>{errorMessage}</p>
        </div>
      ) : (
        ''
      )}
      {inputError && inputErrorMsg ? (
        <div className='inputcard__error'>
          <p>{inputErrorMsg}</p>
        </div>
      ) : (
        ''
      )}
      {hasDesc ? <div className='inputcard__desc'>{desc}</div> : ''}
    </div>
  )
}

export default InputCard
