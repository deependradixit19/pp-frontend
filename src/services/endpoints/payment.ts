import axiosInstance from '../http/axiosInstance'
import { IAutoRecharge } from '../../types/interfaces/ITypes'

interface IAddDeposit {
  amount: number
  card_id: number
}

export interface IAddCard {
  street: string
  city: string
  country: string
  state: string
  post_code: number
  email: string
  card_holder: string
  card_number: number
  expiration_year: string
  expiration_month: string
  cvc: number
}

export interface ICard {
  id: number
  street: string
  city: string
  state: string | boolean
  country: string | boolean
  post_code: string
  email: string
  card_holder: string
  card_number: string
  expiration_year: string
  expiration_month: string
  cvc: string
  is_default: boolean
  is_verified: boolean
  user_id: number
  created_at: string
  updated_at: string
}

export const postDeposit = async (deposit: IAddDeposit) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: '/api/user/add-deposit',
    data: deposit
  })
  return data
}

export const postCard = async (card: IAddCard) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: '/api/user/add-card',
    data: card
  })

  return data
}

export const editCard = async ({ card, cardId }: { card: IAddCard; cardId: number }) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: `/api/user/update-card/${cardId}`,
    data: card
  })
  return data
}

export const listCards = async () => {
  const { data } = await axiosInstance({
    method: 'get',
    url: '/api/user/list-card'
  })

  return data
}

export const getSingleCard = async (id: number) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/user/single-card/${id}`
  })

  return data
}

export const deleteCard = async (id: number) => {
  const { data } = await axiosInstance({
    method: 'delete',
    url: `/api/user/delete-card/${id}`
  })

  return data
}

export const putDefaultCard = async (id: number) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: `/api/user/set-active-card/${id}`
  })

  return data
}

export const putDefaultPaymetMethod = async (payload: { default_payment_method: 'wallet' | 'card' }) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: '/api/user/payment-settings',
    data: payload
  })

  return data
}

export const putAutoRecharge = async (payload: IAutoRecharge) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: '/api/user/auto-recharge',
    data: payload
  })

  return data
}
