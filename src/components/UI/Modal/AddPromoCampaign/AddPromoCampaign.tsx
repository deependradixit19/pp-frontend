import { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from 'react-query'
import { IconMinus, IconPlus, IconThreePeople } from '../../../../assets/svg/sprite'
import { useModalContext } from '../../../../context/modalContext'
import ModalWrapper from '../../../../features/ModalWrapper/ModalWrapper'
import { createPromoCampaign, updatePromoCampaign } from '../../../../services/endpoints/api_subscription'
import { addToast } from '../../../Common/Toast/Toast'
import InputCard from '../../../Form/InputCard/InputCard'
import IconButton from '../../Buttons/IconButton'
import Dropdown from '../../Dropdown/Dropdown'
import style from './_add-promo-campaign.module.scss'

const AddPromoCampaign: FC<{ campaign?: any; isEdit?: boolean }> = ({ campaign, isEdit }) => {
  const { t } = useTranslation()
  const [selectOpen, setSelectOpen] = useState(false)
  const [type, setType] = useState(campaign?.type || 'trial')
  const [activeCategory, setActiveCategory] = useState<any>(campaign?.audience || 'new')

  const [duration, setDuration] = useState(campaign?.duration || '')
  const [length, setLength] = useState(campaign?.length || '')
  const [limit, setLimit] = useState(campaign?.limit || '')
  const [discount, setDiscount] = useState(campaign?.discount || 5)
  const modalData = useModalContext()
  const queryClient = useQueryClient()

  const options = [
    {
      value: 'new',
      label: 'New Subscribers'
    },
    {
      value: 'expired',
      label: 'Returning Subscribers'
    },
    {
      value: 'all',
      label: 'New & Expired'
    }
  ]

  const addMutation = useMutation((data: {}) => createPromoCampaign(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('freeTrials')
      queryClient.invalidateQueries('promoCampaigns')
      toast.dismiss()
      addToast('success', 'Successfully created')
      modalData.clearModal()
    },
    onError: () => {
      toast.dismiss()
      addToast('error', 'An error occured, please try again')
      modalData.clearModal()
    }
  })

  const editMutation = useMutation((data: {}) => updatePromoCampaign(campaign.id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries('freeTrials')
      queryClient.invalidateQueries('promoCampaigns')
      toast.dismiss()
      addToast('success', 'Successfully updated')
      modalData.clearModal()
    },
    onError: () => {
      toast.dismiss()
      addToast('error', 'An error occured, please try again')
      modalData.clearModal()
    }
  })

  const isValid = () => {
    if (type === 'trial') {
      if (activeCategory === 'new' && parseFloat(limit) > 0 && parseFloat(duration) > 0 && parseFloat(length) > 0)
        return true

      return false
    }

    if (type === 'promo') {
      if (
        (activeCategory === 'new' || activeCategory === 'expired' || activeCategory === 'all') &&
        parseFloat(limit) > 0 &&
        parseFloat(length) > 0 &&
        discount >= 5 &&
        discount <= 50
      )
        return true

      return false
    }

    return false
  }

  const addFunction = () => {
    if (type === 'trial') {
      if (isValid()) {
        addToast('loading', 'Creating...')
        addMutation.mutate({ type, length, duration, limit })
      } else {
        addToast('error', 'Please fill all fields.')
      }
    }

    if (type === 'promo') {
      if (isValid()) {
        addToast('loading', 'Creating...')
        addMutation.mutate({ audience: activeCategory, type, length, limit, discount })
      } else {
        addToast('error', 'Please fill all fields.')
      }
    }
  }

  const editFunction = () => {
    if (type === 'trial') {
      if (isValid()) {
        addToast('loading', 'Updating...')
        editMutation.mutate({ type, length, duration, limit })
      } else {
        addToast('error', 'Please fill all fields.')
      }
    }

    if (type === 'promo') {
      if (isValid()) {
        addToast('loading', 'Updating...')
        editMutation.mutate({ audience: activeCategory, type, length, limit, discount })
      } else {
        addToast('error', 'Please fill all fields.')
      }
    }
  }

  useEffect(() => {
    if (type === 'trial') setActiveCategory('new')
  }, [type])

  return (
    <div className={style.container}>
      <div className={`${style.select_container} ${selectOpen ? style.select_container_open : ''}`}>
        <div
          className={`${style.select_selected} ${type === 'trial' ? style.select_selected_disabled : ''}`}
          onClick={() => setSelectOpen(!selectOpen)}
        >
          <div className={style.select_icon}>
            <IconThreePeople />
          </div>
          {options.filter((item: any) => item.value === activeCategory)[0].label}
        </div>

        <div className={`${style.select_options} ${selectOpen ? style.select_options_open : ''}`}>
          {options.map((option: { value: string; label: string }) => (
            <div
              onClick={() => {
                setActiveCategory(option.value)
                setSelectOpen(false)
              }}
              key={option.value}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>

      <div className={`${style.type_buttons_container} ${isEdit ? style.type_buttons_container_disabled : ''}`}>
        <div
          className={`${style.type_button} ${type === 'trial' ? style.type_button_selected : ''}`}
          onClick={() => setType('trial')}
        >
          Free Trial
        </div>
        <div
          className={`${style.type_button} ${type === 'promo' ? style.type_button_selected : ''}`}
          onClick={() => setType('promo')}
        >
          First Month Discount
        </div>
      </div>

      {type === 'trial' && (
        <>
          <InputCard
            mask={`${duration} Days`}
            type='number'
            label='Free Trial Duration'
            value={duration}
            changeFn={(val: any) => setDuration(val)}
            customClass={`${style.input} ${style.two_inputs_input}`}
          />
          <div className={style.two_inputs_container}>
            <InputCard
              customClass={`${style.two_inputs_input} ${style.two_inputs_input_margin}`}
              type='number'
              label='Campaign Length'
              value={length}
              changeFn={(val: any) => setLength(val)}
              mask={`${length} Days`}
            />
            <InputCard
              customClass={`${style.two_inputs_input}`}
              type='number'
              label='Offer Limit'
              value={limit}
              changeFn={(val: any) => setLimit(val)}
              mask={`${limit} Subscribers`}
            />
          </div>
        </>
      )}

      {type === 'promo' && (
        <>
          <div className={style.discount_container}>
            <p>{t('discount')}</p>
            <div className={style.discount_price}>
              <IconButton
                type='white'
                icon={<IconMinus />}
                disabled={discount === 5}
                clickFn={() => setDiscount((prevState: number) => prevState - 5)}
              />
              <p>{discount}%</p>
              <IconButton
                type='white'
                icon={<IconPlus />}
                disabled={discount === 50}
                clickFn={() => setDiscount((prevState: number) => prevState + 5)}
              />
            </div>
          </div>
          <div className={style.two_inputs_container}>
            <InputCard
              customClass={`${style.two_inputs_input} ${style.two_inputs_input_margin}`}
              type='number'
              label='Campaign Length'
              value={length}
              changeFn={(val: any) => setLength(val)}
              mask={`${length} Days`}
            />
            <InputCard
              customClass={`${style.two_inputs_input}`}
              type='number'
              label='Offer Limit'
              value={limit}
              changeFn={(val: any) => setLimit(val)}
              mask={`${limit} Subscribers`}
            />
          </div>
        </>
      )}

      <div className={style.submit_buttons_container}>
        <div className={`${style.cancel_button}`} onClick={() => modalData.clearModal()}>
          Cancel
        </div>
        <div
          className={`${style.submit_button} ${
            addMutation.isLoading || editMutation.isLoading ? style.submit_button_loading : ''
          }`}
          onClick={!isEdit ? addFunction : editFunction}
        >
          Create
        </div>
      </div>
    </div>
  )
}

export default AddPromoCampaign
