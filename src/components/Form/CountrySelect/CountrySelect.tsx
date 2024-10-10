import React, { useEffect, useState } from 'react'
import { t } from 'i18next'
import { getCountries, ICountry, IState } from '../../../services/endpoints/countries'

// Components
import { IconDownChevron, IconDiscovery } from '../../../assets/svg/sprite'

// Styling
import styles from './CountrySelect.module.scss'

const CountrySelect = ({
  selectedCountry,
  selectedState,
  onCountryChange,
  onStateChange
}: {
  selectedCountry: string
  selectedState: string
  onCountryChange: Function
  onStateChange: Function
}) => {
  const [countries, setCoutries] = useState<ICountry[]>([])

  const [country, setCountry] = useState<ICountry | null>(null)
  const [state, setState] = useState<IState | null>(null)

  useEffect(() => {
    const fetchCountries = async () => {
      const tmpCountries = await getCountries()
      setCoutries(tmpCountries)
      setCountry(tmpCountries[0])
      onCountryChange(tmpCountries[0].name)
      if (tmpCountries[0].regions.length > 0) {
        setState(tmpCountries[0].regions[0])
        onStateChange(tmpCountries[0].regions[0].name)
      }
    }

    fetchCountries()
  }, [])

  useEffect(() => {
    if (selectedCountry) {
      const newCountry = countries.find(element => element.name === selectedCountry)
      typeof newCountry !== 'undefined' && setCountry(newCountry)

      if (selectedState && newCountry?.regions) {
        const newState = newCountry.regions.find(region => region.name === selectedState)
        typeof newState !== 'undefined' && setState(newState)
      }
    } else {
      setCountry(countries[0])
    }
  }, [selectedCountry])

  const changeCountry = (value: ICountry) => {
    onCountryChange(value.name)
    setCountry(value)

    if (value?.regions) {
      changeState(value?.regions[0])
    }
  }

  const changeState = (value: IState) => {
    onStateChange(value.name)
    setState(value)
  }

  return (
    <div className={styles.container}>
      <CountryDropdown
        label={t('coutryField')}
        countries={countries}
        selectedCountry={country}
        onChange={changeCountry}
      />
      {Boolean(country?.regions && country.regions.length > 0) && (
        <>
          <div className={styles.separator}></div>
          <CountryDropdown
            label={t('stateProvinceField')}
            countries={country?.regions}
            selectedCountry={state}
            onChange={changeState}
          />
        </>
      )}
    </div>
  )
}

export function CountryDropdown({
  label = 'Country *',
  countries,
  selectedCountry,
  onChange
}: {
  label?: string
  countries: ICountry[] | IState[] | undefined
  selectedCountry: ICountry | IState | null
  onChange: Function
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)

  return (
    <>
      <div className={styles.selectContainer} onClick={() => setIsDropdownOpen(prevValue => !prevValue)}>
        <div className={styles.leftContainer}>
          <div className={styles.flag}>
            {label === t('coutryField') && selectedCountry ? (
              <img
                src={`https://flagsapi.com/${selectedCountry?.code}/flat/64`}
                alt={`${selectedCountry?.name} flag`}
              />
            ) : (
              <IconDiscovery />
            )}
          </div>
          <div className={styles.textContainer}>
            <p className={styles.label}>{label}</p>
            <p className={styles.countryName}>{selectedCountry?.name}</p>
          </div>
        </div>
        <div className={styles.arrow}>
          <IconDownChevron />
        </div>
        {isDropdownOpen && (
          <div className={styles.dropdown}>
            {countries &&
              countries.map(country => (
                <div key={country.id} onClick={() => onChange(country)}>
                  {country.name}
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  )
}

export default CountrySelect
