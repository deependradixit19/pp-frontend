import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// Components
import { IconCreditCardOutline, IconMasterCard } from '../../../../assets/svg/sprite'
import InputCard from '../../../Form/InputCard/InputCard'
import MonthYearInput from '../../../Form/MonthYearInput/MonthYearInput'
import CheckboxField from '../../../Form/CheckboxField/CheckboxField'
import CountrySelect from '../../../Form/CountrySelect/CountrySelect'
// Styling
import './_add-credit-card.scss'
import { useUserContext } from '../../../../context/userContext'
import { addToast } from '../../../Common/Toast/Toast'

const aesEcb = require('aes-ecb')

const AddCreditCard: FC<{
  editFn: (e: any, b: any) => void
  addNewFn: (e: any) => void
  open?: boolean
  prefillData?: any
}> = ({ editFn, addNewFn, open, prefillData = null }) => {
  const [name, setName] = useState<string>('')
  const [nameError, setNameError] = useState<boolean>(true)
  const [cardNumber, setCardNumber] = useState<string>('')
  const [cardNumberError, setCardNumberError] = useState<boolean>(true)
  const [expirationMonth, setExpirationMonth] = useState<string>('')
  const [expirationMonthError, setExpirationMonthError] = useState<boolean>(true)
  const [expirationYear, setExpirationYear] = useState<string>('')
  const [expirationYearError, setExpirationYearError] = useState<boolean>(true)
  const [expirationError, setExpirationError] = useState<boolean>(false)

  const [cvc, setCvc] = useState<string>('')
  const [cvcError, setCvcError] = useState<boolean>(true)
  const [country, setCountry] = useState<string>('')
  const [countryError, setCountryError] = useState<boolean>(true)
  const [state, setState] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [cityError, setCityError] = useState<boolean>(true)
  const [address, setAddress] = useState<string>('')
  const [addressError, setAddressError] = useState<boolean>(true)
  const [zip, setZip] = useState<string>('')
  const [zipError, setZipError] = useState<boolean>(true)
  const [confirmation, setConfirmation] = useState<boolean>(false)
  const [canSubmmit, setCanSubmmit] = useState<boolean>(false)

  const { t } = useTranslation()

  const userData = useUserContext()

  const todayDate = new Date()

  useEffect(() => {
    if (prefillData) {
      if (prefillData.name) {
        setName(prefillData.name)
        setNameError(false)
      }
      if (prefillData.cardNumber) {
        setCardNumber(prefillData.cardNumber)
        setCardNumberError(false)
      }
      if (prefillData.expiration) {
        setExpirationMonth(prefillData.expiration.split('/')[0])
        setExpirationMonthError(false)
        setExpirationYear(prefillData.expiration.split('/')[1])
        setExpirationMonthError(false)
      }
      if (prefillData.cvc) {
        setCvc(aesEcb.decrypt('ShVmYq3t6w9z$C&F)J@McQfTjWnZr4u7', prefillData.cvc))
        setCvcError(false)
      }
      if (prefillData.city) {
        setCity(prefillData.city)
        setCityError(false)
      }
      if (prefillData.address) {
        setAddress(prefillData.address)
        setAddressError(false)
      }
      if (prefillData.zip) {
        setZip(prefillData.zip)
        setZipError(false)
      }
      if (prefillData.country) {
        setCountry(prefillData.country)
        setZipError(false)
      }
      if (prefillData.state) {
        setState(prefillData.state)
      }
    } else {
      resetModalData()
    }
  }, [prefillData])

  useEffect(() => {
    if (country.length > 0) {
      setCountryError(false)
    } else {
      setCountryError(true)
    }
  }, [country])

  useEffect(() => {
    if (expirationMonth.length > 0) {
      setExpirationMonthError(false)
    } else {
      setExpirationMonthError(true)
    }
  }, [expirationMonth])

  useEffect(() => {
    if (expirationYear.length > 1) {
      setExpirationYearError(false)
    } else {
      setExpirationYearError(true)
    }
  }, [expirationYear])

  useEffect(() => {
    if (
      !nameError &&
      !cardNumberError &&
      !expirationMonthError &&
      !expirationYearError &&
      !cvcError &&
      !countryError &&
      !cityError &&
      !addressError &&
      !zipError &&
      !expirationError
    ) {
      setCanSubmmit(true)
    } else {
      setCanSubmmit(false)
    }
  }, [
    nameError,
    cardNumberError,
    expirationMonthError,
    expirationYearError,
    cvcError,
    countryError,
    cityError,
    addressError,
    zipError,
    expirationError
  ])

  const resetModalData = () => {
    setName('')
    setCardNumber('')
    setExpirationMonth('')
    setExpirationYear('')
    setCvc('')
    setCountry('')
    setState('')
    setCity('')
    setAddress('')
    setZip('')
  }

  const submitFn = () => {
    const key = process.env.REACT_APP_ENCRYPT_KEY
    if (!confirmation) {
      addToast('error', t('error:pleaseConfirmYourAge'))
      return
    }

    if (canSubmmit) {
      if (prefillData && prefillData.isEdit) {
        editFn(
          {
            street: address,
            city,
            country,
            state,
            post_code: zip,
            card_holder: name,
            card_number: cardNumber,
            expiration_year: expirationYear,
            expiration_month: expirationMonth,
            cvc: cvc
          },
          prefillData.id
        )
      } else {
        addNewFn({
          email: userData.email,
          street: address,
          city,
          country,
          state,
          post_code: zip,
          card_holder: name,
          card_number: cardNumber,
          expiration_year: expirationYear,
          expiration_month: expirationMonth,
          cvc: cvc
        })
      }
      // resetModalData();
    } else {
      addToast('error', t('error:errorAddCardValidation'))
    }
  }

  return (
    <div className={`add-credit-card-modal-wrapper ${open ? 'add-credit-card-modal-wrapper-open' : ''}`}>
      <div className='add-credit-card-modal-title'>
        <IconCreditCardOutline />
        {prefillData && prefillData.isEdit ? t('editCard') : t('addNewCard')}
      </div>
      <form
        onSubmit={e => {
          e.preventDefault()
          submitFn()
        }}
        className='add-credit-card-form'
      >
        <div className='add-credit-card-info'>
          <InputCard
            type='string'
            validate='letters&required'
            value={name}
            label={t('cardholderName')}
            changeFn={(val: any) => setName(val)}
            hasError={(val: boolean) => setNameError(val)}
          />
          <InputCard
            type='string'
            value={cardNumber}
            validate='cardNo'
            maxChars={16}
            label={t('cardNumber')}
            hasIcon={true}
            icon={<IconMasterCard width='30' />}
            iconRight={true}
            iconSmaller={true}
            changeFn={(val: string) => setCardNumber(val.replace(/[^0-9]+/g, ''))}
            hasError={(val: boolean) => setCardNumberError(val)}
          />
          <div className='add-credit-card-form-group'>
            <MonthYearInput
              month={expirationMonth}
              year={expirationYear}
              monthChangeFn={(val: any) => setExpirationMonth(val)}
              yearChangeFn={(val: any) => setExpirationYear(val)}
              minYear={todayDate.getFullYear() % 2000}
              maxYear={(todayDate.getFullYear() + 10) % 2000}
              placeholder='MM / YY'
              label={t('expiration')}
              handleError={(value: boolean) => setExpirationError(value)}
              hasError={expirationError}
            />
            <InputCard
              maxChars={3}
              type='string'
              validate='cvc'
              value={cvc}
              label={t('cvc')}
              changeFn={(val: string) => setCvc(val.replace(/[^0-9]+/g, ''))}
              hasError={(val: boolean) => setCvcError(val)}
            />
          </div>
        </div>
        <div className='add-credit-card-modal-title'>{t('billingAddress')}</div>

        <div className='add-credit-card-modal-section'>
          <CountrySelect
            selectedCountry={country}
            selectedState={state}
            onCountryChange={setCountry}
            onStateChange={setState}
          />
          <InputCard
            type='string'
            validate='letters&required'
            value={city}
            label={t('city')}
            changeFn={(val: any) => setCity(val)}
            hasError={(val: boolean) => setCityError(val)}
          />
          <InputCard
            type='string'
            validate='required'
            value={address}
            label={t('address')}
            changeFn={(val: any) => setAddress(val)}
            hasError={(val: boolean) => setAddressError(val)}
          />
          <InputCard
            type='string'
            validate='required'
            value={zip}
            label={t('zipPostal')}
            changeFn={(val: string) => setZip(val)}
            hasError={(val: boolean) => setZipError(val)}
          />
        </div>
        <div className='add-credit-card-checkbox-container'>
          <CheckboxField
            id='18-check'
            label={''}
            value={'confirmation'}
            checked={confirmation}
            changeFn={() => setConfirmation(!confirmation)}
          />
          <div className='add-credit-card-checkbox-text'>{t('confirmThatYouAreAtLeast18')}</div>
        </div>
        <input type='submit' value={t('saveCard')} className='add-credit-card-submit-button' />
      </form>
    </div>
  )
}

export default AddCreditCard
