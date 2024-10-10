import { FC, useState, useEffect } from 'react'
import { useMutation, useQuery, UseQueryResult, useQueryClient } from 'react-query'
import { t } from 'i18next'
import { IPaymentPlan } from '../../../../types/iTypes'

import { useUserContext } from '../../../../context/userContext'
import { useModalContext } from '../../../../context/modalContext'

import RadioButton from '../../../../components/Common/RadioButton/RadioButton'
import InputCard from '../../../../components/Form/InputCard/InputCard'
import IconButton from '../../../../components/UI/Buttons/IconButton'
import Button from '../../../../components/UI/Buttons/Button'
import { AllIcons } from '../../../../helpers/allIcons'
import PriceCard from './components/PriceCard'

import {
  createSubscriptionPlan,
  getSubscriptionPlans,
  updateSubscriptionPlans
} from '../../../../services/endpoints/api_subscription'

interface Props {
  id?: number
  price?: number
}

const NewPlan: FC<Props> = ({ id, price }) => {
  const userData = useUserContext()
  const [bundle, setBundle] = useState<{
    option: string
    length: number
    price: number
    discount: number
  }>({
    option: '',
    length: 0,
    price: price || 0,
    discount: 0
  })
  const [customBundlePrice, setCustomBundlePrice] = useState<boolean>(false)
  const [bundlePlansActive, setBundlePlansActive] = useState<boolean>(false)
  const [bundleDropdownActive, setBundleDropdownActive] = useState<boolean>(false)
  const [priceValid, setPriceValid] = useState<boolean>(true)
  const [nameValid, setNameValid] = useState<boolean>(true)
  const [bundleValid, setBundleValid] = useState<boolean>(false)

  const [tmpPaymentPlan, setTmpPaymentPlan] = useState<IPaymentPlan | null>(null)

  const queryClient = useQueryClient()
  const modalData = useModalContext()

  const {
    data,
    error
  }: UseQueryResult<{
    [key: string]: Array<IPaymentPlan>
  }> = useQuery(['allSubsPlans', userData.id], () => getSubscriptionPlans(userData.id), {
    refetchOnWindowFocus: false
  })

  useEffect(() => {
    if (id && data) {
      const planToEdit = data.subscriptions.filter(plan => plan.id === id)
      setTmpPaymentPlan(planToEdit[0])
      setBundle({
        ...bundle,
        option: planToEdit[0].name,
        length: planToEdit[0].month_count,
        discount: planToEdit[0].discount ? planToEdit[0].discount : 0
      })
    }
  }, [id, data])

  useEffect(() => {
    isBundleValid(bundle)
  }, [bundle])

  const addPricePlan = useMutation(
    (newPlan: { price: number; name: string; length?: any; discount?: number }) => {
      const { price, name, length, discount } = newPlan
      return createSubscriptionPlan({ plan: name, price, length, discount })
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(['allSubsPlans', userData.id])
        setBundle({
          option: '',
          length: 0,
          price: 0,
          discount: 0
        })
        setPriceValid(true)
        modalData.clearModal()
      }
    }
  )

  const updatePricePlan = useMutation(
    (updatedPlan: IPaymentPlan) => {
      const { id, price, name, month_count, discount } = updatedPlan
      return updateSubscriptionPlans({
        ...tmpPaymentPlan,
        id,
        name,
        price,
        month_count,
        discount
      })
    },
    {
      onMutate: resData => {
        const previousValue = queryClient.getQueryData<{
          subscriptions: IPaymentPlan[]
        }>(['allSubsPlans', userData.id])

        const newValue = previousValue?.subscriptions.map(plan => {
          if (resData.id === plan.id) {
            return { ...tmpPaymentPlan, ...resData }
          } else {
            return plan
          }
        })

        queryClient.setQueryData(['allSubsPlans', userData.id], {
          subscriptions: newValue
        })

        return previousValue
      },
      onError: (err, variables, previousValue) => {
        queryClient.setQueryData('allSubsPlans', {
          subscriptions: previousValue
        })
      },
      onSettled: () => {
        setBundle({
          option: '',
          length: 0,
          price: 0,
          discount: 0
        })
        setPriceValid(true)
        modalData.clearModal()
      }
    }
  )

  const handleAddPricePlan = () => {
    addPricePlan.mutate({
      price: bundle.price,
      name: bundle.option,
      length: bundle.length,
      discount: bundle.discount
    })
  }

  const handleUpdatePricePlan = (id: number) => {
    updatePricePlan.mutate({
      id,
      price: bundle.price,
      name: bundle.option,
      month_count: bundle.length,
      discount: bundle.discount
    })
  }

  // const isPriceValid = (price: number) => {
  //   if (price >= 4.99) {
  //     setPriceValid(true);
  //     return true;
  //   } else {
  //     setPriceValid(false);
  //     return false;
  //   }
  // };

  // const isNameValid = (name: string) => {
  //   if (name.length > 30) {
  //     setNameValid(false);
  //     return false;
  //   } else {
  //     setNameValid(true);
  //     return true;
  //   }
  // };

  const isBundleValid = (bundle: { option: string; length: number; price: number; discount: number }) => {
    if (bundle.length && bundle.price && bundle.discount) {
      setBundleValid(true)
    } else {
      setBundleValid(false)
    }
  }

  const bundleFields = () => {
    const priceDiscount = bundle.discount ? (bundle.price * bundle.discount) / 100 : null
    const bundlePrice = priceDiscount ? bundle.price - priceDiscount : bundle.price
    return (
      <>
        <div className='subsOptions__fields__plan'>
          <div className='subsOptions__fields__plan__head' onClick={() => setBundlePlansActive(!bundlePlansActive)}>
            <div className='subsOptions__fields__plan__img'>
              <img src={AllIcons.payment_sub_white} alt={t('pricingPlan')} />
            </div>

            <p className='subsOptions__fields__plan__placeholder'>${price || 0}</p>
          </div>
        </div>
        <div className='subsOptions__fields__inputs'>
          <div className={`subsOptions__dropdown${bundleDropdownActive ? ' subsOptions__dropdown--active' : ''}`}>
            <div className='subsOptions__dropdown__head' onClick={() => setBundleDropdownActive(!bundleDropdownActive)}>
              <p className='subsOptions__dropdown__head--title'>{t('length')}</p>
              <p className='subsOptions__dropdown__head--length'>
                {bundle.length > 0 ? `${bundle.length} Months` : 'Select'}
                {/* {bundle.length} Months */}
              </p>
            </div>
            {bundleDropdownActive ? (
              <div className='subsOptions__dropdown__body'>
                <div
                  className='subsOptions__dropdown__item'
                  onClick={() => {
                    setBundleDropdownActive(false)
                    setBundle({ ...bundle, length: 3, option: '3 Month' })
                    // isBundleValid({ ...bundle, length: 3 });
                  }}
                >
                  3 {t('Months')}
                </div>
                <div
                  className='subsOptions__dropdown__item'
                  onClick={() => {
                    setBundleDropdownActive(false)
                    setBundle({ ...bundle, length: 6, option: '6 Month' })
                    // isBundleValid({ ...bundle, length: 6 });
                  }}
                >
                  6 {t('Months')}
                </div>
                <div
                  className='subsOptions__dropdown__item'
                  onClick={() => {
                    setBundleDropdownActive(false)
                    setBundle({ ...bundle, length: 12, option: '12 Month' })
                    // isBundleValid({ ...bundle, length: 12 });
                  }}
                >
                  12 {t('Months')}
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
          <PriceCard
            //@ts-ignore
            price={Math.round(bundlePrice * 100) / 100}
            updatePrice={() => null}
            disabled={true}
            isValid={priceValid}
            priceNotInput={true}
          />
        </div>
        <div className='subsOptions__fields__discount'>
          <p>{t('selectDiscount')}</p>
          <div className='subsOptions__fields__discount__buttons'>
            <Button
              text={t('custom')}
              color={customBundlePrice ? 'black' : 'transparent'}
              type={!customBundlePrice ? 'transparent--black1px' : undefined}
              font='mont-14-normal'
              height='3'
              width='fit'
              padding='2'
              clickFn={() => {
                setCustomBundlePrice(!customBundlePrice)
                setBundle({
                  ...bundle,
                  discount: 5
                })
                // isBundleValid({
                //   ...bundle,
                //   discount: 5,
                // });
              }}
            />
            <Button
              text='5%'
              color={!customBundlePrice && bundle.discount === 5 ? 'black' : 'transparent'}
              type={!customBundlePrice && bundle.discount !== 5 ? 'transparent--black1px' : undefined}
              font='mont-14-normal'
              height='3'
              width='6'
              padding='2'
              clickFn={() => {
                setCustomBundlePrice(false)
                setBundle({ ...bundle, discount: 5 })
                // isBundleValid({ ...bundle, discount: 5 });
              }}
            />
            <Button
              text='15%'
              color={!customBundlePrice && bundle.discount === 15 ? 'black' : 'transparent'}
              type={!customBundlePrice && bundle.discount !== 15 ? 'transparent--black1px' : undefined}
              font='mont-14-normal'
              height='3'
              width='6'
              padding='2'
              clickFn={() => {
                setCustomBundlePrice(false)
                setBundle({ ...bundle, discount: 15 })
                // isBundleValid({ ...bundle, discount: 15 });
              }}
            />
            <Button
              text='30%'
              color={!customBundlePrice && bundle.discount === 30 ? 'black' : 'transparent'}
              type={!customBundlePrice && bundle.discount !== 30 ? 'transparent--black1px' : undefined}
              font='mont-14-normal'
              height='3'
              width='6'
              padding='2'
              clickFn={() => {
                setCustomBundlePrice(false)
                setBundle({ ...bundle, discount: 30 })
                // isBundleValid({ ...bundle, discount: 30 });
              }}
            />
          </div>
          {customBundlePrice ? (
            <div className='subsOptions__fields__discount__custom'>
              <p>{t('discount')}</p>
              <div className='subsOptions__fields__discount__custom__price'>
                <IconButton
                  type='white'
                  icon={AllIcons.square_minus}
                  disabled={bundle.discount === 5}
                  clickFn={() => {
                    bundle.discount > 5 &&
                      setBundle({
                        ...bundle,
                        discount: bundle.discount - 5
                      })
                  }}
                />
                <p>{bundle.discount}%</p>
                <IconButton
                  icon={AllIcons.square_plus}
                  type='white'
                  disabled={bundle.discount === 50}
                  clickFn={() => {
                    bundle.discount < 50 &&
                      setBundle({
                        ...bundle,
                        discount: bundle.discount + 5
                      })
                  }}
                />
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      </>
    )
  }

  return (
    <>
      <div className='subsOptions__fields'>{bundleFields()}</div>

      <div className='subsOptions__buttons'>
        <Button
          text={t('cancel')}
          color='grey'
          font='mont-14-normal'
          height='3'
          width='fit'
          padding='3'
          clickFn={() => modalData.clearModal()}
        />

        <Button
          text={id ? t('update') : t('add')}
          color='black'
          font='mont-14-normal'
          height='3'
          width='13'
          padding='3'
          disabled={!bundleValid}
          clickFn={() => {
            id ? handleUpdatePricePlan(id) : handleAddPricePlan()
          }}
        />
      </div>
    </>
  )
}

export default NewPlan
