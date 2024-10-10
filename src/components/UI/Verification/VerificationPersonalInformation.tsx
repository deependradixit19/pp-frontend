import { FC, useState, useRef } from 'react'
import { Formik, Field, Form, ErrorMessage, useFormikContext, useField, FormikProps } from 'formik'
import * as Yup from 'yup'

import dayjs from 'dayjs'

import '../../Form/InputField/_inputField.scss'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { StepWizardChildProps } from 'react-step-wizard'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import VerificationLayout from './VerificationLayout'

import RadioButton from '../../Common/RadioButton/RadioButton'

import idExample from '../../../assets/svg/id-example.svg'
import idHoldingExample from '../../../assets/svg/id-holding-example.svg'
import { IconCircleCheckmark, IconIdCard } from '../../../assets/svg/sprite'
import PhotoUploadCard from '../PhotoUploadCard/PhotoUploadCard'
import { attachPhoto } from '../../../services/endpoints/attachments'
import { postModelVerification } from '../../../services/endpoints/profile'
import { useUserContext } from '../../../context/userContext'
import { ProgressValue } from '../../../types/iTypes'
import { useModalContext } from '../../../context/modalContext'
import DateModal from '../Modal/Date/DateModal'

const DatePickerField = (props: any) => {
  const modalData = useModalContext()
  const { setFieldValue } = useFormikContext()
  const { modalTitle, noMinDate, maxDate, modalClass = 'aeaeaeae', ...moreProps } = props
  const [field] = useField(props)
  const date = new Date(field.value)
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  const dateString = field.value !== '' ? `${year}/${month}/${day}` : ''
  return (
    // <DatePicker
    //   {...field}
    //   {...props}
    //   selected={(field.value && new Date(field.value)) || null}
    //   onChange={(val) => {
    //     setFieldValue(field.name, val);
    //   }}
    // />
    <div
      {...moreProps}
      {...field}
      onClick={() =>
        modalData.addModal(
          modalTitle,
          <DateModal
            maxDate={maxDate}
            noNextStep={true}
            noMinDate={noMinDate}
            confirmFn={val => {
              setFieldValue(field.name, val)
            }}
          />,
          false,
          false,
          'verification-date-picker'
        )
      }
      style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '10px' }}
    >
      {dateString}
    </div>
  )
}

// interface ProgressValue {
//   name: string;
//   percentage: number;
//   size: number;
//   type: string;
//   cancel?: () => void;
// }

const VerificationPersonalInformation: FC<Partial<StepWizardChildProps>> = ({
  currentStep,
  nextStep,
  previousStep,
  hashKey
}) => {
  const [dataReady, setDataReady] = useState<boolean>(false)

  const [idProgressValues, setIdProgressValues] = useState<ProgressValue[]>([])
  const [idPhotoUrls, setIdPhotoUrls] = useState<string[]>([])
  // const [progressInfos, setProgressInfos] = useState<any>({ val: [] });

  const [idHoldProgressValues, setIdHoldProgressValues] = useState<ProgressValue[]>([])
  const [idHoldPhotoUrls, setIdHoldPhotoUrls] = useState<string[]>([])
  // const [progressHoldInfos, setProgressHoldInfos] = useState<any>({ val: [] });

  const [idPhotoError, setIdPhotoError] = useState<string>('')
  const [idHoldingPhotoError, setIdHoldingPhotoError] = useState<string>('')

  const progressInfosRef = useRef<any>(null)
  const progressHoldInfosRef = useRef<any>(null)

  const userData = useUserContext()

  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const validFileTypes = ['jpg', 'jpeg', 'png']

  type FormValues = {
    firstName: string
    lastName: string
    country: string
    address: string
    city: string
    stateProvince: string
    postal: string
    social: { twitter: string; instagram: string; other: string }
    dateOfBirth: string
    documentType: string
    idExpiration: string
    noExpiration: boolean
  }
  const formRef = useRef<FormikProps<FormValues>>(null)

  const PersonalInformationSchema = Yup.object({
    firstName: Yup.string().max(15, t('validation:mustBe15CharactersOrLess')).required(t('validation:required')),
    lastName: Yup.string().max(20, t('validation:mustBe20CharactersOrLess')).required(t('validation:required')),
    country: Yup.string().max(50, t('validation:mustBe50CharactersOrLess')).required(t('validation:required')),
    address: Yup.string().max(100, t('validation:mustBe100CharactersOrLess')).required(t('validation:required')),
    city: Yup.string().max(50, t('validation:mustBe50CharactersOrLess')).required(t('validation:required')),
    stateProvince: Yup.string().max(50, t('validation:mustBe50CharactersOrLess')).required(t('validation:required')),
    postal: Yup.string().max(10, t('validation:mustBe10CharactersOrLess')).required(t('validation:required')),
    social: Yup.object()
      .shape({
        twitter: Yup.string().max(50, t('validation:mustBe50CharactersOrLess')),
        instagram: Yup.string().max(50, t('validation:mustBe50CharactersOrLess')),
        other: Yup.string().max(50, t('validation:mustBe50CharactersOrLess'))
      })
      .required(t('validation:required')),
    dateOfBirth: Yup.date().required(t('validation:required')),
    documentType: Yup.string().max(20, t('validation:mustBe20CharactersOrLess')).required(t('validation:required')),
    idExpiration: Yup.date().required(t('validation:required')),
    noExpiration: Yup.boolean()
  })

  const verifyUser = useMutation(
    (userData: any) => {
      return postModelVerification(userData)
    },
    {
      onSettled: () => queryClient.invalidateQueries('loggedProfile')
    }
  )

  const uploadFiles = (files: File[]) => {
    let _progressInfos = [...progressInfosRef?.current.val]
    if (files.length > 1) {
      return files.map((tmpFile: File, idx) => {
        const data = new FormData()
        data.append('photo', tmpFile)
        let tmpIdx = idProgressValues.length ? idx + idProgressValues.length : idx

        return attachPhoto(data, (loaded: number, total: number, cancelCb: () => void) => {
          const perc = Math.round((100 * loaded) / total)
          _progressInfos[tmpIdx].percentage = perc
          _progressInfos[tmpIdx].cancel = cancelCb

          setIdProgressValues(_progressInfos)
          // setProgressInfos({ val: _progressInfos });
        })
          .then(resp => {
            return resp
          })
          .catch(err => {
            const tmp = _progressInfos.filter((element, index) => index !== idx)

            progressInfosRef.current = {
              val: tmp
            }
            _progressInfos = tmp
            setIdProgressValues(tmp)
          })
      })
    } else {
      const data = new FormData()
      data.append('photo', files[0])
      const idx = _progressInfos.length - 1
      const singleUpload = attachPhoto(data, (loaded: number, total: number, cancelCb: () => void) => {
        const perc = Math.round((100 * loaded) / total)
        _progressInfos[idx].percentage = perc
        _progressInfos[idx].cancel = cancelCb

        setIdProgressValues(_progressInfos)
        // setProgressInfos({ val: _progressInfos });
      })
        .then(resp => {
          return resp
        })
        .catch(err => {
          const tmp = _progressInfos.filter((element, index) => index !== idx)

          progressInfosRef.current = {
            val: tmp
          }
          _progressInfos = tmp
          setIdProgressValues(tmp)
        })

      return [singleUpload]
    }
  }
  const uploadHoldFiles = (files: File[]) => {
    let _progressHoldInfos = [...progressHoldInfosRef?.current.val]
    if (files.length > 1) {
      return files.map((tmpFile: File, idx) => {
        const data = new FormData()
        data.append('photo', tmpFile)
        let tmpIdx = idHoldProgressValues.length ? idx + idHoldProgressValues.length : idx

        return attachPhoto(data, (loaded: number, total: number, cancelCb: () => void) => {
          const perc = Math.round((100 * loaded) / total)
          _progressHoldInfos[tmpIdx].percentage = perc
          _progressHoldInfos[tmpIdx].cancel = cancelCb

          setIdHoldProgressValues(_progressHoldInfos)
          // setProgressHoldInfos({ val: _progressHoldInfos });
        })
          .then(resp => {
            return resp
          })
          .catch(err => {
            const tmp = _progressHoldInfos.filter((element, index) => index !== idx)

            progressHoldInfosRef.current = {
              val: tmp
            }
            _progressHoldInfos = tmp
            setIdHoldProgressValues(tmp)
          })
      })
    } else {
      const data = new FormData()
      data.append('photo', files[0])
      const idx = _progressHoldInfos.length - 1
      const singleUpload = attachPhoto(data, (loaded: number, total: number, cancelCb: () => void) => {
        const perc = Math.round((100 * loaded) / total)
        _progressHoldInfos[idx].percentage = perc
        _progressHoldInfos[idx].cancel = cancelCb

        setIdHoldProgressValues(_progressHoldInfos)
        // setProgressHoldInfos({ val: _progressHoldInfos });
      })
        .then(resp => {
          return resp
        })
        .catch(err => {
          const tmp = _progressHoldInfos.filter((element, index) => index !== idx)

          progressHoldInfosRef.current = {
            val: tmp
          }
          _progressHoldInfos = tmp
          setIdHoldProgressValues(tmp)
        })

      return [singleUpload]
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    let tmpFiles: File[] = []
    let _progressInfos: ProgressValue[] = []
    try {
      if (files && files.length > 3) {
        throw new Error('files_length_error')
      }
      idPhotoError && setIdPhotoError('')
      files &&
        Array.from(files).forEach(file => {
          if (file.size > 7340032 || !validFileTypes.includes(file.type.split('/')[1])) {
            throw new Error('id_error')
          }

          tmpFiles.push(file)
          _progressInfos.push({
            name: file.name,
            percentage: 0,
            size: file.size,
            type: file.type.split('/')[1]
          })
        })
      progressInfosRef.current = {
        val: [...idProgressValues, ..._progressInfos]
      }

      Promise.all(uploadFiles(tmpFiles))
        .then(response => {
          const tmp: string[] = []
          response.forEach(res => {
            res && tmp.push(res.data.path)
          })
          setIdPhotoUrls(tmp)
        })
        .catch(err => console.log({ err }))
    } catch (err: any) {
      if (err.message === 'id_error') {
        setIdPhotoError(t('error:invalidFileTypeOrSize'))
      }
      if (err.message === 'files_length_error') {
        setIdPhotoError(t('error:uploadMax3Photos'))
      }
    }
  }

  const handleHoldImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    let tmpFiles: File[] = []
    let _progressHoldInfos: ProgressValue[] = []
    try {
      if (files && files.length > 3) {
        throw new Error('holding_files_length_error')
      }
      idHoldingPhotoError && setIdHoldingPhotoError('')
      files &&
        Array.from(files).forEach(file => {
          if (file.size > 7340032 || !validFileTypes.includes(file.type.split('/')[1])) {
            throw new Error('holding_id_error')
          }
          tmpFiles.push(file)
          _progressHoldInfos.push({
            name: file.name,
            percentage: 0,
            size: file.size,
            type: file.type.split('/')[1]
          })
        })

      progressHoldInfosRef.current = {
        val: [...idHoldProgressValues, ..._progressHoldInfos]
      }

      Promise.all(uploadHoldFiles(tmpFiles))
        .then(response => {
          const tmp: string[] = []
          response.forEach(res => {
            res && tmp.push(res.data.path)
          })
          setIdHoldPhotoUrls(tmp)
        })
        .catch(err => console.log({ err }))
    } catch (err: any) {
      if (err.message === 'holding_id_error') {
        setIdHoldingPhotoError(t('error:invalidFileTypeOrSize'))
      }
      if (err.message === 'holding_files_length_error') {
        setIdHoldingPhotoError(t('error:uploadMax3Photos'))
      }
    }
  }

  const handleFormSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit()
    }
  }

  return (
    <VerificationLayout
      currentStep={currentStep}
      nextStep={() => handleFormSubmit()}
      previousStep={previousStep}
      nextDisabled={!dataReady}
    >
      <div className='verificationStep'>
        <h3 className='verificationStep__title'>{t('personalInformation')}</h3>
        {userData.model_verification_status === 'pending' ? (
          <div className='personalInformation__pending'>
            <div className='personalInformation__pending--image'>
              <IconIdCard />
            </div>
            <div className='personalInformation__pending--title'>
              {t('yourAccount')} <br /> {t('isPendingReview')}
            </div>
          </div>
        ) : (
          <div className='personalInformation__form'>
            <Formik
              innerRef={formRef}
              enableReinitialize={true}
              initialValues={{
                firstName: '',
                lastName: '',
                country: userData?.country?.name || '',
                address: '',
                city: '',
                stateProvince: '',
                postal: '',
                social: { twitter: '', instagram: '', other: '' },
                dateOfBirth: '',
                documentType: 'Passport',
                idExpiration: '',
                noExpiration: false
              }}
              validationSchema={PersonalInformationSchema}
              onSubmit={(values, { setSubmitting }) => {
                const data = {
                  first_name: values.firstName,
                  last_name: values.lastName,
                  country_name: values.country,
                  address: values.address,
                  city_name: values.city,
                  state: values.stateProvince,
                  postal_code: values.postal,
                  twitter: values.social.twitter,
                  instagram: values.social.instagram,
                  other: values.social.other,
                  date_of_birth: values.dateOfBirth,
                  id_expiration_date: values.idExpiration,
                  verification_document_type: values.documentType,
                  no_expired_date: values.noExpiration,
                  id_photo: idPhotoUrls[0],
                  holding_id_photo: idHoldPhotoUrls[0]
                }
                verifyUser.mutate(data)
              }}
            >
              {({ setFieldValue, setFieldTouched, values, errors, touched }) => {
                if (
                  !Object.keys(errors).length &&
                  !Object.keys(touched).length &&
                  !idPhotoUrls.length &&
                  !idHoldPhotoUrls
                ) {
                  setTimeout(() => setDataReady(false), 0)
                }
                if (
                  !Object.keys(errors).length &&
                  Object.keys(touched).length &&
                  idPhotoUrls.length &&
                  idHoldPhotoUrls.length
                ) {
                  setTimeout(() => setDataReady(true), 0)
                }
                return (
                  <Form>
                    <div className='formDivider'></div>
                    <p className='formParagraph'>{t('fillInnYourLegalName')}</p>
                    <div className='formikInput'>
                      <label className={`formikInput__label ${values.firstName ? 'filled' : ''}`} htmlFor='firstName'>
                        {t('firstName')}
                      </label>
                      <Field
                        name='firstName'
                        type='text'
                        className={`formikInput__field formikInput__field--${values.firstName ? 'filled' : ''}`}
                      />
                      <ErrorMessage component='div' className='formikInput__error' name='firstName' />
                    </div>

                    <div className='formikInput'>
                      <label className={`formikInput__label ${values.lastName ? 'filled' : ''}`} htmlFor='lastName'>
                        {t('lastName')}
                      </label>
                      <Field
                        name='lastName'
                        type='text'
                        className={`formikInput__field formikInput__field--${values.lastName ? 'filled' : ''}`}
                      />
                      <ErrorMessage component='div' className='formikInput__error' name='lastName' />
                    </div>
                    <div className='formikInput'>
                      <label className={`formikInput__label ${values.country ? 'filled' : ''}`} htmlFor='country'>
                        {t('country')}
                      </label>
                      <Field
                        name='country'
                        type='text'
                        className={`formikInput__field formikInput__field--${values.country ? 'filled' : ''}`}
                      />
                      <ErrorMessage component='div' className='formikInput__error' name='country' />
                    </div>
                    <p className='formSmallText mb-17'>
                      {t('ifYouWouldLikeToChangeYourCountry')}
                      <Link className='formLink' to='#'>
                        {t('customerSupport')}
                      </Link>
                    </p>

                    <div className='formikInput'>
                      <label className={`formikInput__label ${values.address ? 'filled' : ''}`} htmlFor='address'>
                        {t('address')}
                      </label>
                      <Field
                        name='address'
                        type='text'
                        className={`formikInput__field formikInput__field--${values.address ? 'filled' : ''}`}
                      />
                      <ErrorMessage component='div' className='formikInput__error' name='address' />
                    </div>
                    <div className='formikInput'>
                      <label className={`formikInput__label ${values.city ? 'filled' : ''}`} htmlFor='city'>
                        {t('city')}
                      </label>
                      <Field
                        name='city'
                        type='text'
                        className={`formikInput__field formikInput__field--${values.city ? 'filled' : ''}`}
                      />
                      <ErrorMessage component='div' className='formikInput__error' name='city' />
                    </div>

                    <div className='formikInput'>
                      <label
                        className={`formikInput__label ${values.stateProvince ? 'filled' : ''}`}
                        htmlFor='stateProvince'
                      >
                        {t('stateProvince')}
                      </label>
                      <Field
                        name='stateProvince'
                        type='text'
                        className={`formikInput__field formikInput__field--${values.stateProvince ? 'filled' : ''}`}
                      />
                      <ErrorMessage component='div' className='formikInput__error' name='stateProvince' />
                    </div>

                    <div className='formikInput'>
                      <label className={`formikInput__label ${values.postal ? 'filled' : ''}`} htmlFor='postal'>
                        {t('postalZip')}
                      </label>
                      <Field
                        name='postal'
                        type='text'
                        className={`formikInput__field formikInput__field--${values.postal ? 'filled' : ''}`}
                      />
                      <ErrorMessage component='div' className='formikInput__error' name='postal' />
                    </div>

                    <div className='withBorder'>
                      <p className='formSmallText mb-13'>{t('thisInformationWillNotBeShown')}</p>
                      <div className='formikInput'>
                        <label
                          className={`formikInput__label ${values.social.twitter ? 'filled' : ''}`}
                          htmlFor='social.twitter'
                        >
                          Twitter{t('(optional)')}
                        </label>
                        <Field
                          name='social.twitter'
                          type='text'
                          className={`formikInput__field formikInput__field--${values.social.twitter ? 'filled' : ''}`}
                          validate={(value: string) => {
                            let error
                            if (!value && !values.social.instagram && !values.social.other) {
                              error = t('validation:required')
                            }
                            return error
                          }}
                        />
                        {/* <ErrorMessage
                      component="div"
                      className="formikInput__error"
                      name="twitter"
                    /> */}
                      </div>

                      <div className='formikInput'>
                        <label
                          className={`formikInput__label ${values.social.instagram ? 'filled' : ''}`}
                          htmlFor='social.instagram'
                        >
                          Instagram{t('(optional)')}
                        </label>
                        <Field
                          name='social.instagram'
                          type='text'
                          className={`formikInput__field formikInput__field--${
                            values.social.instagram ? 'filled' : ''
                          }`}
                        />
                        {/* <ErrorMessage
                      component="div"
                      className="formikInput__error"
                      name="instagram"
                    /> */}
                      </div>
                      <div className='formikInput'>
                        <label
                          className={`formikInput__label ${values.social.other ? 'filled' : ''}`}
                          htmlFor='social.other'
                        >
                          {t('other')}
                          {t('(optional)')}
                        </label>
                        <Field
                          name='social.other'
                          type='text'
                          className={`formikInput__field formikInput__field--${values.social.other ? 'filled' : ''}`}
                        />
                        {/* <ErrorMessage
                      component="div"
                      className="formikInput__error"
                      name="other"
                    /> */}
                      </div>
                      <div className='bottomMessage'>
                        <p className='formSmallText error'>{errors.social && touched.social ? 'Required' : ''}</p>
                        <p className='formSmallText right'>{t('mustChooseOne')}</p>
                      </div>
                    </div>

                    <div className='formikInput'>
                      <label
                        className={`formikInput__label ${values.dateOfBirth ? 'filled' : ''}`}
                        htmlFor='dateOfBirth'
                      >
                        {t('dateOfBirth')}
                      </label>
                      <DatePickerField
                        noMinDate={true}
                        maxDate={new Date()}
                        modalTitle={t('dateOfBirth')}
                        name='dateOfBirth'
                        className={`formikInput__field formikInput__field--${values.dateOfBirth ? 'filled' : ''}`}
                      />
                      <ErrorMessage component='div' className='formikInput__error' name='dateOfBirth' />
                    </div>

                    <div className='formikInput'>
                      <label
                        className={`formikInput__label ${values.documentType ? 'filled' : ''}`}
                        htmlFor='dateOfBirth'
                      >
                        {t('documentType')}
                      </label>
                      <Field
                        as='select'
                        name='documentType'
                        className={`formikInput__field formikInput__field--${values.documentType ? 'filled' : ''}`}
                      >
                        <option value='passport'>{t('passport')}</option>
                        <option value='personalId'>{t('personalId')}</option>
                        <option value='driversLicense'>{t('driversLicense')}</option>
                      </Field>
                      <ErrorMessage component='div' className='formikInput__error' name='documentType' />
                    </div>

                    <div className='photoSection'>
                      <div className='photoSection__title'>
                        <h3>{t('photoOfYourId')}</h3>
                        <span className='circle'>?</span>
                      </div>
                      <p className='formSmallText mb-18'>{t('pleaseUploadAPhotoOfYourId')}</p>

                      <div className='file-input'>
                        <input onChange={handleImageChange} type='file' id='idFile' className='file' hidden multiple />
                        <label htmlFor='idFile'>{t('selectFile')}</label>

                        <p className='formSmallText error'>{idPhotoError}</p>
                      </div>
                      {!!idProgressValues.length && (
                        <div className='photoUploadList'>
                          {idProgressValues.map((file, index) => {
                            return (
                              <PhotoUploadCard
                                key={index}
                                name={file.name}
                                progressValue={file.percentage}
                                type={file.type}
                                size={file.size}
                                abortFn={() => {
                                  if (file.percentage !== 100) {
                                    file.cancel && file.cancel()
                                  }
                                }}
                              />
                            )
                          })}
                        </div>
                      )}

                      <div className='example'>
                        <div className='example__wrapper'>
                          <div className='example__image'>
                            <img src={idExample} alt='id example' />
                          </div>
                          <div className='example__text'>
                            <div className='example__text--title'>
                              <IconCircleCheckmark />
                              <p>{t('goodExample')}</p>
                            </div>
                            <div className='example__text--content'>
                              <p className='formSmallText'>{t('clearlyShowsIdDocumentFully')}</p>
                            </div>
                          </div>
                        </div>
                        <p className='formSmallText lightGray'>{t('theImageShouldNotBeEdited')}</p>
                      </div>
                    </div>
                    <div className='photoSection'>
                      <div className='photoSection__title'>
                        <h3>{t('photoOfHoldingYourId')}</h3>
                        <span className='circle'>?</span>
                      </div>
                      <p className='formSmallText mb-18'>{t('pleaseUploadAPhotoHoldingYourId')}</p>
                      <div className='file-input'>
                        <input
                          onChange={handleHoldImageChange}
                          type='file'
                          id='idHoldingFile'
                          className='file'
                          hidden
                          multiple
                        />
                        <label htmlFor='idHoldingFile'>{t('selectFile')}</label>
                        <p className='formSmallText error'>{idHoldingPhotoError}</p>
                      </div>
                      {!!idHoldProgressValues.length && (
                        <div className='photoUploadList'>
                          {idHoldProgressValues.map((file, index) => {
                            return (
                              <PhotoUploadCard
                                key={index}
                                name={file.name}
                                progressValue={file.percentage}
                                type={file.type}
                                size={file.size}
                                abortFn={() => {
                                  file.cancel && file.cancel()
                                }}
                              />
                            )
                          })}
                        </div>
                      )}
                      <div className='example'>
                        <div className='example__wrapper'>
                          <div className='example__image'>
                            <img src={idHoldingExample} alt={t('idExample')} />
                          </div>
                          <div className='example__text'>
                            <div className='example__text--title'>
                              <IconCircleCheckmark />
                              <p>{t('goodExample')}</p>
                            </div>
                            <div className='example__text--content'>
                              <p className='formSmallText'>{t('asWellAsClearImageOfTheUploadedId')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='formikInput mb-20'>
                      <label
                        className={`formikInput__label ${values.idExpiration ? 'filled' : ''}`}
                        htmlFor='idExpiration'
                      >
                        {t('iDExpirationDate')}
                      </label>
                      <DatePickerField
                        modalTitle={t('idExpiration')}
                        name='idExpiration'
                        className={`formikInput__field formikInput__field--${values.idExpiration ? 'filled' : ''}`}
                      />
                      <ErrorMessage component='div' className='formikInput__error' name='idExpiration' />
                    </div>
                    <div className='inputGroup'>
                      <RadioButton
                        active={values.noExpiration}
                        clickFn={() => setFieldValue('noExpiration', !values.noExpiration)}
                      />
                      <p>{t('noExpirationDate')}</p>
                    </div>

                    {/* <button type="submit">Submit</button> */}
                  </Form>
                )
              }}
            </Formik>
          </div>
        )}
      </div>
    </VerificationLayout>
  )
}

export default VerificationPersonalInformation
