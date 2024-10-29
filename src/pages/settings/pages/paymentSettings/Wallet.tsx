import React, { ChangeEvent, FC, useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'

import { IAutoRecharge } from '../../../../types/interfaces/ITypes'
import {
  ICard,
  IAddCard,
  listCards,
  deleteCard,
  putDefaultCard,
  postCard,
  editCard,
  putDefaultPaymetMethod,
  putAutoRecharge,
  getSingleCard
} from '../../../../services/endpoints/payment'
import { minimumAmountOptions, rechargeAmountOptions } from '../../../../constants/walletConsts'

// Context
import { useModalContext } from '../../../../context/modalContext'
import { useUserContext } from '../../../../context/userContext'

// Components
import ActionCard from '../../../../features/ActionCard/ActionCard'
import LayoutHeader from '../../../../features/LayoutHeader/LayoutHeader'
import WithHeaderSection from '../../../../layouts/WithHeaderSection/WithHeaderSection'
import AddFunds from '../../../../components/UI/Modal/AddFunds/AddFunds'
import SwitchButton from '../../../../components/Common/SwitchButton/SwitchButton'
import AddCreditCard from '../../../../components/UI/Modal/AddCreditCard/AddCreditCard'
import * as spriteIcons from '../../../../assets/svg/sprite'

// Styling
import './_wallet.scss'

const Wallet: FC = () => {
  const [addCreditCardOpen, setAddCreditCardOpen] = useState<boolean>(false)

  const [prefillData, setPrefillData] = useState<any>(null)

  const queryClient = useQueryClient()

  const modalData = useModalContext()
  const userData = useUserContext()
  const { t } = useTranslation()

  const { data: cardsList, error } = useQuery(['allCards'], listCards, {
    refetchOnWindowFocus: false,
    staleTime: 10000
  })

  const removeCard = useMutation(
    (cardId: number) => {
      return deleteCard(cardId)
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries('allCards')
      }
    }
  )

  const setDefaultCard = useMutation(
    (cardId: number) => {
      return putDefaultCard(cardId)
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries('allCards')
        queryClient.invalidateQueries('loggedProfile')
      }
    }
  )

  const addCard = useMutation(
    (data: IAddCard) => {
      return postCard(data)
    },
    {
      onSuccess: () => {
        setAddCreditCardOpen(false)
        setPrefillData(null)
      },
      onError: () => {},
      onSettled: () => {
        queryClient.invalidateQueries('allCards')
      }
    }
  )

  const changeDefaultPaymentMethod = useMutation(
    (data: { default_payment_method: 'wallet' | 'card' }) => {
      return putDefaultPaymetMethod(data)
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries('loggedProfile')
      }
    }
  )

  const changeAutoRechargeOption = useMutation(
    (data: IAutoRecharge) => {
      return putAutoRecharge(data)
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries('loggedProfile')
      }
    }
  )

  const updateCard = useMutation(
    ({ data, cardId }: { data: IAddCard; cardId: number }) => {
      return editCard({ card: { ...data, email: userData.email }, cardId })
    },
    {
      onSuccess: () => {
        setAddCreditCardOpen(false)
        setPrefillData(null)
      },
      onError: () => {},
      onSettled: () => {
        queryClient.invalidateQueries('allCards')
      }
    }
  )

  useEffect(() => {
    if (
      cardsList &&
      cardsList.data.cards &&
      cardsList.data.cards.length === 1 &&
      cardsList.data.cards[0].id !== userData.default_card &&
      !cardsList.data.cards[0].is_default
    ) {
      setDefaultCard.mutate(cardsList.data.cards[0].id)
    }
  }, [cardsList])

  const addCreditCard = (data: IAddCard) => {
    addCard.mutate(data)
  }

  const editCreditCard = (data: IAddCard, cardId: number) => {
    updateCard.mutate({ data, cardId })
  }

  const openEditCreditCard = async (id: number) => {
    const data = await getSingleCard(id)
    if (data.data) {
      const payload = {
        isEdit: true,
        id: data.data.id,
        name: data.data.card_holder,
        cardNumber: data.data.card_number,
        expiration: `${data.data.expiration_month}/${data.data.expiration_year}`,
        cvc: data.data.cvc,
        city: data.data.city,
        address: data.data.street,
        zip: data.data.post_code,
        country: data.data.country,
        state: data.data.state
      }
      setPrefillData(payload)
      setAddCreditCardOpen(true)
    }
  }

  const toggleAddFundsModal = () => {
    modalData.addModal(t('settings:addFundsModalTitle'), <AddFunds defaultCard={userData.default_card} />)
  }

  const mutateAutoRechargeOption = () => {
    changeAutoRechargeOption.mutate({
      is_active: !userData.auto_recharge.enabled,
      recharge_amount:
        userData.auto_recharge.recharge_amount > 0
          ? userData.auto_recharge.recharge_amount
          : rechargeAmountOptions[3].value,
      minimum_amount:
        userData.auto_recharge.minimum_amount > 0
          ? userData.auto_recharge.minimum_amount
          : minimumAmountOptions[3].value
    })
  }
  return (
    <>
      <div className='wallet-top-section'>
        <div className='wallet-top-section-title'>{t('wallet')}</div>
        <div className='wallet-top-section-number-container'>
          <div className='wallet-top-section-number'>
            <spriteIcons.IconDollar width='40' height='40' />
            <div>{userData.wallet_deposit}</div>
            <span className='wallet-top-section-number-currency-text'>
              <div>(USD)</div>
            </span>
          </div>
          <button className='wallet-top-section-button' onClick={toggleAddFundsModal}>
            {t('addFunds')}
          </button>
        </div>
        <div className='wallet-top-section-options'>
          <div className='wallet-top-section-option'>
            <div className='wallet-top-section-option-txt'>{t('makeWalletPrimaryMethodForRebills')}</div>
            <SwitchButton
              active={userData.default_payment_method === 'wallet'}
              toggle={() =>
                changeDefaultPaymentMethod.mutate({
                  default_payment_method: userData.default_payment_method === 'wallet' ? 'card' : 'wallet'
                })
              }
            />
          </div>
          <div className='wallet-top-section-option'>
            <div className='wallet-top-section-option-txt'>{t('autoRecharge')}</div>
            <SwitchButton active={userData.auto_recharge.enabled} toggle={() => mutateAutoRechargeOption()} />
          </div>
          {userData.auto_recharge.enabled && (
            <div className='wallet-top-section-option' style={{ paddingTop: 0 }}>
              <div className='wallet-top-dropdown-container'>
                <label htmlFor='minimum-amount'>{t('settings:walletMinimumAmount')}</label>
                <select
                  name='minimum-amount'
                  id='minimum-amount'
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    changeAutoRechargeOption.mutate({
                      is_active: true,
                      recharge_amount: userData.auto_recharge.recharge_amount,
                      minimum_amount: parseInt(e.target.value)
                    })
                  }
                >
                  {minimumAmountOptions.map(option => (
                    <option
                      key={option.text}
                      value={option.value}
                      selected={userData.auto_recharge.minimum_amount === option.value}
                    >
                      {option.text}
                    </option>
                  ))}
                </select>
              </div>
              <div className='wallet-top-dropdown-container'>
                <label htmlFor='recharge-amount'>{t('settings:walletRechargeAmount')}</label>
                <select
                  name='recharge-amount'
                  id='recharge-amount'
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    changeAutoRechargeOption.mutate({
                      is_active: true,
                      minimum_amount: userData.auto_recharge.minimum_amount,
                      recharge_amount: parseInt(e.target.value)
                    })
                  }
                >
                  {rechargeAmountOptions.map(option => (
                    <option
                      key={option.text}
                      value={option.value}
                      selected={userData.auto_recharge.recharge_amount === option.value}
                    >
                      {option.text}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
      <WithHeaderSection withoutBorder={true} headerSection={<LayoutHeader type='basic' title={t('yourCards')} />}>
        {cardsList &&
          cardsList?.data.cards.map((card: ICard) => (
            <ActionCard
              key={card.id}
              icon={card.card_number.charAt(0) === '3' ? <spriteIcons.IconVisa /> : <spriteIcons.IconMasterCard />}
              text={
                <>
                  {card.card_number.charAt(0) === '3' ? 'Visa' : 'Mastercard'}{' '}
                  {card.is_verified && <span className='wallet-card-verified'>Verified</span>}
                </>
              }
              subtext={<span className='wallet-card-number'>{card.card_number}</span>}
              description={
                <span className='wallet-card-expires'>{`Exp ${card.expiration_month}/${card.expiration_year}`}</span>
              }
              hasTrash={true}
              hasEdit={true}
              mediumIcon={true}
              selected={card.is_default}
              clickFn={() => setDefaultCard.mutate(card.id)}
              trashFn={() => removeCard.mutate(card.id)}
              editFn={() => openEditCreditCard(card.id)}
              bottomArea={
                <>
                  {!card.is_verified && (
                    <div className='wallet-card-verify-area'>
                      <button className='wallet-card-verify-btn'>Verify</button>
                      <div className='wallet-card-verify-txt'>
                        Verify your card in order to increase spending limits
                      </div>
                    </div>
                  )}
                </>
              }
            />
          ))}

        <ActionCard
          icon={<spriteIcons.IconPlusInBox width='28' height='28' />}
          text={<span className='wallet-card-add-txt'>Add another card</span>}
          clickFn={() => {
            setAddCreditCardOpen(true)
            setPrefillData({})
          }}
          mediumIcon={true}
        />

        <AddCreditCard
          addNewFn={(data: IAddCard) => {
            addCreditCard(data)
            // setPrefillData({});
          }}
          editFn={(data: IAddCard, cardId: number) => {
            editCreditCard(data, cardId)
            // setPrefillData({});
          }}
          open={addCreditCardOpen}
          prefillData={prefillData}
        />
      </WithHeaderSection>
    </>
  )
}

export default Wallet
