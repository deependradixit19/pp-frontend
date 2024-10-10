import { FC, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Form, Formik, FormikProps } from 'formik'
import * as Yup from 'yup'
import { useMutation, useQuery, useQueryClient, UseQueryResult } from 'react-query'
import toast from 'react-hot-toast'
import { Icons } from '../../../../helpers/icons'
import WithHeaderSection from '../../../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../../../features/LayoutHeader/LayoutHeader'
import Button from '../../../../components/UI/Buttons/Button'
import SuccessfulChange from '../../features/SuccessfulChange'
import { getBankInformation, putBankInformation } from '../../../../services/endpoints/payout'
import { getGeoCountries } from '../../../../services/endpoints/settings'
import { ICountry } from '../../../../services/endpoints/countries'
import { FormikSelect } from '../../../../components/Form/FormikSelect/FormikSelect'
import { FormikInputField } from '../../../../components/Form/FormikInputField/FormikInputField'

const bankCountries = [
  {
    label: 'United States of America',
    value: 'US'
  },
  {
    label: 'Canada',
    value: 'CA'
  }
]

type BankFormValues = {
  swift_bic: string
  routing_number: string
  account_number: string
  bank_name: string
  bank_street: string
  bank_city: string
  bank_postal_code: string
  bank_country: string
  bank_country_iso: string
  bank_state: string
}

type UserFormValues = {
  beneficiary_first_name: string
  beneficiary_last_name: string
  beneficiary_country: string
  beneficiary_country_iso: string
  beneficiary_city: string
  beneficiary_state: string
  beneficiary_street: string
  beneficiary_postal_code: string
  phone_number: string
}

const BankInformation: FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [dataReady, setDataReady] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<boolean>()
  const [search, setSearch] = useState<string>('')
  const [bankInfo, setBankInfo] = useState<BankFormValues>()
  // const [userInfo, setUserInfo] = useState<UserFormValues>({
  //   beneficiary_first_name: '',
  //   beneficiary_last_name: '',
  //   beneficiary_country: '',
  //   beneficiary_country_iso: '',
  //   beneficiary_city: '',
  //   beneficiary_state: '',
  //   beneficiary_street: '',
  //   beneficiary_postal_code: '',
  //   phone_number: ''
  // });

  const navigate = useNavigate()
  const { t } = useTranslation()

  const queryClient = useQueryClient()

  const bankFormRef = useRef<FormikProps<BankFormValues>>(null)
  const userFormRef = useRef<FormikProps<UserFormValues>>(null)

  const {
    data: bankData,
    error,
    isLoading: loadingBankData
  }: UseQueryResult<{ [key: string]: any }> = useQuery('bankInfortmation', getBankInformation, {
    select(data) {
      return data?.data
    },
    refetchOnWindowFocus: false,
    keepPreviousData: true
  })

  const { data: beneficiaryCountries } = useQuery('allCountries', getGeoCountries, {
    refetchOnWindowFocus: false,
    select(data) {
      return data.data.map((country: ICountry) => ({
        value: country.code,
        label: country.name
      }))
    }
  })

  const sendPayoutInfo = useMutation(
    (payoutInfo: any) => {
      return putBankInformation(payoutInfo)
    },
    {
      onMutate: () => {
        setDataReady(false)
      },
      onSettled: () => queryClient.invalidateQueries('bankInfortmation')
    }
  )

  const handleBankFormSubmit = (newInfo: BankFormValues) => {
    setDataReady(false)
    setBankInfo({ ...newInfo })
  }

  const handleUserFormSubmit = (values: UserFormValues) => {
    setDataReady(false)
    toast.promise(
      sendPayoutInfo.mutateAsync({ ...bankInfo, ...values }),
      {
        loading: t('sending'),
        success: () => {
          setSubmitError(false)
          setCurrentPage(3)
          return t('success')
        },
        error: () => {
          setSubmitError(true)
          setCurrentPage(3)
          return t('error:anErrorOccuredPleaseTryAgain')
        }
      },
      {
        style: {
          fontFamily: `Montserrat, sans-serif`,
          fontSize: '1.4rem',
          color: '#757576',
          background: '#F5F5F6',
          borderRadius: '20px'
        }
      }
    )
  }

  const renderInputCards = () => {
    const bankInfoFields = [
      {
        type: 'text',
        label: t('bankSwift'),
        valueKey: 'swift_bic'
      },
      {
        type: 'text',
        label: t('accountNumber'),
        valueKey: 'account_number'
      },
      {
        type: 'text',
        label: t('bankName'),
        valueKey: 'bank_name'
      },
      {
        type: 'text',
        label: t('bankState'),
        valueKey: 'bank_state'
      },
      {
        type: 'text',
        label: t('bankCity'),
        valueKey: 'bank_city'
      },
      {
        type: 'text',
        label: t('bankStreetAddress'),
        valueKey: 'bank_street'
      },
      {
        type: 'text',
        label: t('bankPostalCodeZipCode'),
        valueKey: 'bank_postal_code'
      }
    ]

    const userInfoFields = [
      {
        type: 'text',
        label: t('firstName'),
        valueKey: 'beneficiary_first_name'
      },
      {
        type: 'text',
        label: t('lastName'),
        valueKey: 'beneficiary_last_name'
      },
      {
        type: 'text',
        label: t('beneficiaryCity'),
        valueKey: 'beneficiary_city'
      },
      {
        type: 'text',
        label: t('beneficiaryState'),
        valueKey: 'beneficiary_state'
      },
      {
        type: 'text',
        label: t('beneficiaryStreetAddress'),
        valueKey: 'beneficiary_street'
      },
      {
        type: 'text',
        label: t('postalCodeZipCode'),
        valueKey: 'beneficiary_postal_code'
      },
      {
        type: 'text',
        label: t('phoneNumber'),
        valueKey: 'phone_number'
      }
    ]

    switch (currentPage) {
      // case 1:
      //   const BankInfoSchema = Yup.object({
      //     bank_country_iso: Yup.string().required(t('validation:required')),
      //     swift_bic: Yup.string()
      //       .max(255, t('validation:mustBe255CharactersOrLess'))
      //       .required(t('validation:required')),
      //     routing_number: Yup.string().when('bank_country_iso', {
      //       is: 'CA',
      //       then: Yup.string()
      //         .matches(/^\d+$/, t('validation:onlyDigits'))
      //         .max(255, t('validation:mustBe255CharactersOrLess'))
      //         .required(t('validation:required'))
      //     }),
      //     account_number: Yup.string()
      //       .max(255, t('validation:mustBe255CharactersOrLess'))
      //       .required(t('validation:required')),
      //     bank_name: Yup.string()
      //       .max(255, t('validation:mustBe255CharactersOrLess'))
      //       .required(t('validation:required')),
      //     bank_state: Yup.string()
      //       .max(255, t('validation:mustBe255CharactersOrLess'))
      //       .required(t('validation:required')),
      //     bank_street: Yup.string()
      //       .max(255, t('validation:mustBe255CharactersOrLess'))
      //       .required(t('validation:required')),
      //     bank_city: Yup.string()
      //       .max(255, t('validation:mustBe255CharactersOrLess'))
      //       .required(t('validation:required')),
      //     bank_postal_code: Yup.string()
      //       .max(255, t('validation:mustBe255CharactersOrLess'))
      //       .required(t('validation:required'))
      //   })
      //   return (
      //     <>
      //       <div className='bankInformation__form'>
      //         <Formik
      //           enableReinitialize={true}
      //           innerRef={bankFormRef}
      //           initialValues={
      //             bankData
      //               ? {
      //                   swift_bic: bankData.swift_bic,
      //                   routing_number: bankData.routing_number ?? '',
      //                   account_number: bankData.account_number,
      //                   bank_name: bankData.bank_name,
      //                   bank_street: bankData.bank_street,
      //                   bank_city: bankData.bank_city,
      //                   bank_postal_code: bankData.bank_postal_code,
      //                   bank_country: bankData.bank_country,
      //                   bank_country_iso: bankData.bank_country_iso,
      //                   bank_state: bankData.bank_state
      //                 }
      //               : {
      //                   swift_bic: '',
      //                   routing_number: '',
      //                   account_number: '',
      //                   bank_name: '',
      //                   bank_street: '',
      //                   bank_city: '',
      //                   bank_postal_code: '',
      //                   bank_country: '',
      //                   bank_country_iso: '',
      //                   bank_state: ''
      //                 }
      //           }
      //           validationSchema={BankInfoSchema}
      //           validateOnMount={true}
      //           onSubmit={(values, { setSubmitting }) => {
      //             handleBankFormSubmit(values)
      //           }}
      //         >
      //           {({ setFieldValue, setFieldTouched, validateForm, values, errors, touched, isValid }) => {
      //             if (isValid && !dataReady) {
      //               setDataReady(true)
      //             } else if (!isValid && dataReady) {
      //               setDataReady(false)
      //             }
      //             return (
      //               <Form>
      //                 <FormikSelect
      //                   fieldName='bank_country_iso'
      //                   label={t('bankCountry')}
      //                   options={bankCountries}
      //                   selectedValue={values.bank_country_iso}
      //                   onChange={selected => {
      //                     setFieldValue('bank_country_iso', selected.value)
      //                     setFieldValue('bank_country', selected.label)
      //                     validateForm({
      //                       ...values,
      //                       bank_country_iso: selected.value,
      //                       bank_country: selected.label
      //                     })
      //                   }}
      //                   onTouched={() => {
      //                     setFieldTouched('bank_country_iso', true, true)
      //                   }}
      //                 />
      //                 {values.bank_country_iso === 'CA' ? (
      //                   <FormikInputField
      //                     key={'routing_number'}
      //                     type={'text'}
      //                     label={t('bankRoutingNumber')}
      //                     name={'routing_number'}
      //                     value={values.routing_number}
      //                   />
      //                 ) : (
      //                   values.routing_number && setFieldValue('routing_number', '')
      //                 )}
      //                 {bankInfoFields.map((field, key: number) => (
      //                   <FormikInputField
      //                     key={field.valueKey}
      //                     type={field.type}
      //                     label={field.label}
      //                     name={field.valueKey}
      //                     value={values[field.valueKey as keyof BankFormValues]}
      //                   />
      //                 ))}
      //               </Form>
      //             )
      //           }}
      //         </Formik>
      //       </div>
      //       {/* <DropDownSelect
      //       customClass={styles.bankCountryInput}
      //       // notSearchable // so it doesn't open keyboard and reduce viewport
      //       // icon={
      //       //   <div className="analytics-dropdown-icon">
      //       //     <spriteIcons.IconCalendarLinesWhite />
      //       //   </div>
      //       // }
      //       search={search}
      //       setSearch={setSearch}
      //       options={bankCountries}
      //       placeholder={t('bankCountry')}
      //       selectedOption={bankInfo?.bank_country_iso ?? ''}
      //       setSelectedOption={(val: string) => {
      //         setBankInfo((bi) => ({
      //           ...bi,
      //           bank_country_iso: val,
      //           bank_country: bankCountries.find(b => b.value === val)?.label ?? '',
      //         }));
      //       }}
      //     /> */}
      //     </>
      //   )

      case 2:
        const UserInfoSchema = Yup.object({
          beneficiary_first_name: Yup.string()
            .max(255, t('validation:mustBe255CharactersOrLess'))
            .required(t('validation:required')),
          beneficiary_last_name: Yup.string()
            .max(255, t('validation:mustBe255CharactersOrLess'))
            .required(t('validation:required')),
          beneficiary_country_iso: Yup.string().required(t('validation:required')),
          beneficiary_street: Yup.string()
            .max(255, t('validation:mustBe255CharactersOrLess'))
            .required(t('validation:required')),
          beneficiary_city: Yup.string()
            .max(255, t('validation:mustBe255CharactersOrLess'))
            .required(t('validation:required')),
          beneficiary_state: Yup.string()
            .max(255, t('validation:mustBe255CharactersOrLess'))
            .required(t('validation:required')),
          beneficiary_postal_code: Yup.string()
            .max(255, t('validation:mustBe255CharactersOrLess'))
            .required(t('validation:required')),
          phone_number: Yup.string()
            .matches(/^\d+$/, t('validation:onlyDigits'))
            .max(50, t('validation:mustBe50CharactersOrLess'))
            .required(t('validation:required'))
        })

        return (
          <div className='personalInformation__form'>
            <Formik
              innerRef={userFormRef}
              initialValues={
                bankData
                  ? {
                      beneficiary_first_name: bankData.beneficiary_first_name,
                      beneficiary_last_name: bankData.beneficiary_last_name,
                      beneficiary_country: bankData.beneficiary_country,
                      beneficiary_country_iso: bankData.beneficiary_country_iso,
                      beneficiary_city: bankData.beneficiary_city,
                      beneficiary_state: bankData.beneficiary_state,
                      beneficiary_street: bankData.beneficiary_street,
                      beneficiary_postal_code: bankData.beneficiary_postal_code,
                      phone_number: bankData.phone_number
                    }
                  : {
                      beneficiary_first_name: '',
                      beneficiary_last_name: '',
                      beneficiary_country: '',
                      beneficiary_country_iso: '',
                      beneficiary_city: '',
                      beneficiary_state: '',
                      beneficiary_street: '',
                      beneficiary_postal_code: '',
                      phone_number: ''
                    }
              }
              validationSchema={UserInfoSchema}
              validateOnMount={true}
              onSubmit={(values, { setSubmitting }) => {
                handleUserFormSubmit(values)
              }}
            >
              {({ setFieldValue, setFieldTouched, validateForm, values, errors, touched, isValid }) => {
                if (isValid && !dataReady) {
                  setDataReady(true)
                } else if (!isValid && dataReady) {
                  setDataReady(false)
                }
                return (
                  <Form>
                    <FormikSelect
                      fieldName='beneficiary_country_iso'
                      label={t('country')}
                      options={beneficiaryCountries}
                      selectedValue={values.beneficiary_country_iso}
                      onChange={selected => {
                        setFieldValue('beneficiary_country_iso', selected.value)
                        setFieldValue('beneficiary_country', selected.label)
                        validateForm({
                          ...values,
                          beneficiary_country_iso: selected.value,
                          beneficiary_country: selected.label
                        })
                      }}
                      onTouched={() => {
                        setFieldTouched('beneficiary_country_iso', true, true)
                      }}
                    />
                    {userInfoFields.map((field, key: number) => (
                      <FormikInputField
                        key={field.valueKey}
                        type={field.type}
                        label={field.label}
                        name={field.valueKey}
                        value={values[field.valueKey as keyof UserFormValues]}
                      />
                    ))}
                  </Form>
                )
              }}
            </Formik>
          </div>
        )

      case 3:
        return (
          <SuccessfulChange
            img={Icons.payout_bank_big}
            header={submitError ? t('error:error') : t('success')}
            text={
              submitError ? t('error:anErrorOccuredPleaseTryAgain') : t('yourBankInformationHasSuccessfullyChanged')
            }
          />
        )
    }
  }

  const renderBottomButton = () => {
    switch (currentPage) {
      case 1:
        return (
          <Button
            text={<img src={Icons.arrows_next} alt={t('next')} />}
            color='blue'
            width='20'
            height='5'
            customClass='bankinfo__bottomBtn'
            clickFn={() => {
              bankFormRef.current?.submitForm()
              setCurrentPage(2)
            }}
            disabled={
              !dataReady
              // !(bankInfo.swift_bic &&
              // (bankInfo.bank_country_iso !== 'CA' || bankInfo.routing_number) && // if Canada routing number is mandatory
              // bankInfo.account_number &&
              // bankInfo.bank_name &&
              // bankInfo.bank_street &&
              // bankInfo.bank_city &&
              // bankInfo.bank_postal_code &&
              // bankInfo.bank_country &&
              // bankInfo.bank_country_iso)
            }
          />
        )

      case 2:
        return (
          <Button
            text={t('save')}
            font='mont-16-bold'
            color='black'
            width='20'
            height='5'
            customClass='bankinfo__bottomBtn'
            clickFn={() => {
              userFormRef.current?.submitForm()
            }}
            disabled={!dataReady}
          />
        )

      case 3:
        return (
          <Button
            text={t('close')}
            font='mont-16-bold'
            color='black'
            width='20'
            height='5'
            customClass='bankinfo__bottomBtn'
            clickFn={() => navigate('/settings/general/payout-settings')}
          />
        )
    }
  }

  return (
    <WithHeaderSection
      headerSection={
        <LayoutHeader
          type='dots'
          section='Wire'
          title={currentPage === 3 ? t('completed') : t('bankInformation')}
          dots={
            currentPage === 3
              ? []
              : [
                  {
                    active: `${currentPage === 1 ? 'active' : 'filled'}`,
                    clickFn: () => {
                      if (currentPage === 2) setCurrentPage(1)
                    }
                  },
                  {
                    active: `${currentPage === 2 ? 'active' : currentPage === 3 ? 'filled' : ''}`
                  }
                  // {
                  //   active: `${currentPage === 3 ? 'active' : ''}`,
                  // },
                ]
          }
        />
      }
      withoutBorder={true}
    >
      <div className='bankinfo'>
        {renderInputCards()}
        {renderBottomButton()}
      </div>
    </WithHeaderSection>
  )
}

export default BankInformation
