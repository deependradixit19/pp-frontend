import { FC, useEffect, useState } from 'react'
import ReactCountryFlag from 'react-country-flag'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import { AllIcons } from '../../../../helpers/allIcons'
import { Icons } from '../../../../helpers/icons'

import WithHeaderSection from '../../../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../../../features/LayoutHeader/LayoutHeader'
import DropdownSelect from '../../../../features/DropdownSelect/DropdownSelect'
import Button from '../../../../components/UI/Buttons/Button'

import { getGeoCountries, setGeoCountries } from '../../../../services/endpoints/settings'
import { ICountry, IRegion } from '../../../../types/interfaces/IGeoBlock'
import ConfirmationDialog from '../../../../components/UI/ConfirmationDialog/ConfirmationDialog'

const GeoBlocking: FC = () => {
  const [blockActive, setBlockActive] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [botSearchTerm, setBotSearchTerm] = useState<string>('')
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<IRegion | null>(null)
  const [countryRegions, setCountryRegions] = useState<IRegion[]>([])

  const [showSuccess, setShowSuccess] = useState<boolean>(false)

  const [allCountries, setAllCountries] = useState<ICountry[]>([])

  const [blockedCountriesIds, setBlockedCountriesIds] = useState<number[]>([])
  const [blockedRegionsIds, setBlockedRegionsIds] = useState<number[]>([])

  const [shouldRemove, setShouldRemove] = useState<boolean>(false)

  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { data } = useQuery('allCountries', getGeoCountries, {
    refetchOnWindowFocus: false
  })

  const addGeoBlock = useMutation(
    (geoData: { countries: number[]; regions: number[] }) => {
      return setGeoCountries(geoData)
    },
    {
      onMutate: async resData => {
        const { countries, regions } = resData
        const previousValue = queryClient.getQueryData<{ data: ICountry[] }>('allCountries')

        const newValue = previousValue?.data.map(country => {
          if (country.blocked === 0 && countries.includes(country.id)) {
            const tmp = country.regions.map(region => {
              return { ...region, blocked: 0 }
            })
            return { ...country, blocked: 1, regions: tmp }
          }

          if (country.blocked === 1) {
            const shouldUnblockCountry = country.regions.some(region => {
              return regions.includes(region.id)
            })
            if (shouldUnblockCountry) {
              const tmpRegions = blockRegion(country.regions, regions)
              return { ...country, blocked: 0, regions: tmpRegions }
            }

            return country
          }
          const tmpRegions = blockRegion(country.regions, regions)
          return { ...country, regions: tmpRegions }
        })

        queryClient.setQueryData('allCountries', { data: newValue })
        !showSuccess && setShowSuccess(true)
        selectedCountry && setSelectedCountry(null)
        selectedRegion && setSelectedRegion(null)
        searchTerm && setSearchTerm('')
        botSearchTerm && setBotSearchTerm('')

        return previousValue
      },
      onError: (err, variables, previousValue) => {
        queryClient.setQueryData('allCountries', { data: previousValue })
      },
      onSettled: () => {}
    }
  )

  const deleteGeoBlock = useMutation(
    (geoData: { countries: number[]; regions: number[] }) => {
      return setGeoCountries(geoData)
    },
    {
      onMutate: async geoData => {
        const { countries, regions } = geoData
        const previousValue = queryClient.getQueryData<{ data: ICountry[] }>('allCountries')
        const newValue = previousValue?.data.map(el => {
          if (el.blocked === 1 && !countries.includes(el.id)) {
            return { ...el, blocked: 0 }
          }

          const tmpRegions = el.regions.map(region => {
            if (region.blocked === 1 && !regions.includes(region.id)) {
              return { ...region, blocked: 0 }
            }
            return region
          })

          return { ...el, regions: tmpRegions }
        })

        queryClient.setQueryData('allCountries', { data: newValue })
      },
      onSettled: () => {
        shouldRemove && setShouldRemove(false)
      }
    }
  )

  const blockRegion = (countryRegions: IRegion[], blockedIndexes: number[]) => {
    return countryRegions.map(region => {
      if (region.blocked === 0 && blockedIndexes.includes(region.id)) {
        return { ...region, blocked: 1 }
      }
      return region
    })
  }
  // BE response changed. Need refactoring.
  const configData = () => {
    if (data) {
      const countryArray = data.data.map((country: any) => {
        return {
          name: country.name,
          code: country.code,
          regions: country.regions
        }
      })

      if (searchTerm.length === 0) {
        return countryArray
      } else {
        return countryArray.filter((item: any) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      }
    } else {
      return []
    }
  }

  useEffect(() => {
    if (data) {
      // const blocked = data.data.filter((item: ICountry) => item.blocked === 1);
      const countries = data.data
      !!countries.length && setBlockActive(true)
      const tmpCountries: number[] = []
      const tmpRegions: number[] = []
      countries.forEach((country: ICountry) => {
        country.blocked === 1 && tmpCountries.push(country.id)
        country.regions.forEach((region: IRegion) => {
          region.blocked === 1 && tmpRegions.push(region.id)
        })
      })
      setAllCountries(countries)
      setBlockedCountriesIds(tmpCountries)
      setBlockedRegionsIds(tmpRegions)
    }
  }, [data])

  useEffect(() => {
    setSelectedRegion(null)
    if (selectedCountry) {
      const tmpRegions = selectedCountry.regions.filter(region => {
        return !blockedRegionsIds.includes(region.id)
      })
      setCountryRegions(tmpRegions)
    }
  }, [selectedCountry])

  useEffect(() => {
    shouldRemove &&
      deleteGeoBlock.mutate({
        countries: blockedCountriesIds,
        regions: blockedRegionsIds
      })
  }, [shouldRemove])

  useEffect(() => {
    if (selectedCountry) {
      if (selectedRegion) {
        if (blockedCountriesIds.includes(selectedCountry.id)) {
          const tmpCountries = blockedCountriesIds.filter(bc => {
            return bc !== selectedCountry.id
          })
          setBlockedCountriesIds(tmpCountries)
        }
      } else {
        let tmp: number[] = []
        selectedCountry.regions.forEach(region => {
          if (blockedRegionsIds.includes(region.id)) {
            tmp = blockedRegionsIds.filter(br => br !== region.id)
            setBlockedRegionsIds(tmp)
          }
        })
      }
    }
  }, [selectedCountry, selectedRegion, blockedRegionsIds, blockedCountriesIds])

  const handleCountryDelete = (countryId: number) => {
    const tmpCountries = blockedCountriesIds.filter(id => id !== countryId)
    setBlockedCountriesIds(tmpCountries)
    setShouldRemove(true)
  }
  const handleRegionDelete = (regionId: number) => {
    const tmpRegions = blockedRegionsIds.filter(id => id !== regionId)
    setBlockedRegionsIds(tmpRegions)
    setShouldRemove(true)
  }

  const handleAddBlock = () => {
    addGeoBlock.mutate({
      countries:
        selectedCountry && !selectedRegion ? [...blockedCountriesIds, selectedCountry.id] : blockedCountriesIds,
      regions: selectedRegion ? [...blockedRegionsIds, selectedRegion.id] : blockedRegionsIds
    })
  }

  return (
    <WithHeaderSection
      headerSection={
        <LayoutHeader
          type='switch'
          section={t('privacySecurity')}
          title={t('geoBlocking')}
          switchActive={blockActive}
          switchFn={() => {
            showSuccess && setShowSuccess(false)
            setBlockActive(!blockActive)
          }}
        />
      }
    >
      {blockActive ? (
        <>
          {showSuccess ? (
            <ConfirmationDialog
              icon={AllIcons.geoblock_success}
              title={`${t('success')}!`}
              text={`${t('youHaveBlockedTheLocation')} ${selectedRegion && selectedRegion.name} ${
                selectedCountry && selectedCountry.name
              }`}
              onClose={() => setShowSuccess(false)}
            />
          ) : (
            <>
              <DropdownSelect
                icon={AllIcons.globe_black}
                placeHolder={t('selectCountry')}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                elementsArr={configData()}
                topSectionSelected={selectedCountry}
                topSectionSelect={setSelectedCountry}
                hasBottomSection={!!selectedCountry}
                botIcon={AllIcons.discovery_black}
                botSearchTerm={botSearchTerm}
                setBotSearchTerm={setBotSearchTerm}
                botElementsArr={countryRegions}
                botSectionSelected={selectedRegion}
                botSectionSelect={setSelectedRegion}
              />

              <div className='blocked__list'>
                {allCountries.map(country => {
                  const blockedRegions = country.regions.filter(region => region.blocked === 1)

                  return country.blocked === 1 ? (
                    <div key={country.code} className='dropdownSelect'>
                      <div className='dropdownSelect__element'>
                        <div className='dropdownSelect__element__icon'>
                          <div className='flag__wrapper'>
                            <ReactCountryFlag
                              countryCode={country.code}
                              svg
                              cdnUrl='https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/'
                              cdnSuffix='svg'
                              title={country.code}
                              style={{
                                width: '4em',
                                height: '3em'
                              }}
                            />
                          </div>
                        </div>
                        <div className='dropdownSelect__element__name'>{country.name}</div>
                        <div
                          className='dropdownSelect__head__icon light small'
                          onClick={() => handleCountryDelete(country.id)}
                        >
                          <img src={Icons.trashbin} alt={t('delete')} />
                        </div>
                      </div>
                    </div>
                  ) : !!blockedRegions.length ? (
                    blockedRegions.map(region => (
                      <div key={region.code} className='dropdownSelect'>
                        <div className='dropdownSelect__element'>
                          <div className='dropdownSelect__element__icon'>
                            <div className='flag__wrapper'>
                              <ReactCountryFlag
                                countryCode={country.code}
                                svg
                                cdnUrl='https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/'
                                cdnSuffix='svg'
                                title={country.code}
                                style={{
                                  width: '4em',
                                  height: '3em'
                                }}
                              />
                            </div>
                          </div>
                          <div className='dropdownSelect__element__name'>
                            {region.name}, {country.name}
                          </div>
                          <div
                            className='dropdownSelect__head__icon light small'
                            onClick={() => handleRegionDelete(region.id)}
                          >
                            <img src={Icons.trashbin} alt={t('delete')} />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : null
                })}
              </div>

              {selectedCountry && (
                <Button
                  text={t('block')}
                  color='black'
                  font='mont-16-bold'
                  height='5'
                  width='20'
                  customClass='settings__addlanguage'
                  clickFn={handleAddBlock}
                />
              )}
            </>
          )}
        </>
      ) : (
        ''
      )}
    </WithHeaderSection>
  )
}

export default GeoBlocking
