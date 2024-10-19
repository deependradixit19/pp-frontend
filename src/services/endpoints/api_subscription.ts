import { IPaymentPlan } from '../../types/iTypes'
import axiosInstance from '../http/axiosInstance'

export const createSubscriptionPlan = async (newPlan: {
  plan: string
  price: number
  length: number
  discount?: number
}) => {
  const { data } = await axiosInstance({
    method: 'post',
    url: `api/subscription/create/plan`,
    data: {
      price: newPlan.price,
      name: newPlan.plan,
      month_count: newPlan.length,
      discount: newPlan.discount,
      active: 1
    }
  })
  return data
}

export const getSubscriptionPlans = async (id: number) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `api/subscription/prices/${id}`
  })
  return data?.data
}

export const updateSubscriptionPlans = async (newPlan: IPaymentPlan) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: `api/subscription/plan/${newPlan.id}`,
    data: newPlan
  })
  return data
}
export const deleteSubscriptionPlan = async (planId: number) => {
  const { data } = await axiosInstance({
    method: 'delete',
    url: `api/subscription/plan/${planId}`
  })
  return data
}

export const getPromoCampaigns = async (type?: string) => {
  const { data } = await axiosInstance({
    method: 'GET',
    url: '/api/subscription/campaigns'
  })
  if (type) return data.data.filter((item: any) => item.type === type)
  return data.data
}

export const createPromoCampaign = async (camapaignData: any) => {
  const { data } = await axiosInstance({
    method: 'POST',
    url: '/api/subscription/create/campaign',
    data: camapaignData
  })

  return data
}

export const updatePromoCampaign = async (id: number, campaignData: any) => {
  const { data } = await axiosInstance({
    method: 'PUT',
    url: `/api/subscription/campaign/${id}`,
    data: campaignData
  })

  return data
}

export const deletePromoCampaign = async (id: number) => {
  const { data } = await axiosInstance({
    method: 'DELETE',
    url: `/api/subscription/campaign/${id}`
  })

  return data
}

export const getFreeTrialLink = async (id: number) => {
  const { data } = await axiosInstance({
    method: 'GET',
    url: `/api/subscription/campaign/trial-link?campaign_id=${id}`
  })

  return data
}

export const postTrialLink = async (code: string, answer?: boolean) => {
  const { data } = await axiosInstance({
    method: 'POST',
    url: '/api/subscription/campaign/trial-link',
    data: {
      trial_code: code,
      answer
    }
  })

  return data
}

export const setSubscriptionPrice = async (id: number, price: string) => {
  const { data } = await axiosInstance({
    method: 'PUT',
    url: `/api/performer/${id}/subscription-price`,
    data: { subscription_price: price }
  })

  return data
}

export const getCalimedTrialUsers = async (id: number) => {
  const { data } = await axiosInstance({
    method: 'GET',
    url: `/api/subscription/campaign/${id}/get-users`
  })

  return data
}

export const setSubscriptionRenewal = async (id: number, enableRenewal: boolean = true) => {
  const { data } = await axiosInstance({
    method: 'PUT',
    url: `/api/subscription/renewal/${id}`,
    data: { renewal: enableRenewal }
  })

  return data
}

export const getSubscriptions = async (
  filter: number,
  type: 'active' | 'expired' = 'active',
  sort: number = 1, // 1 = ASC, 2 = DSC
  currentPage: number = 1
) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/user/subscriptions/${type}?filter=${filter}&sort=${sort}&page=${currentPage}`
  })
  return {
    nextCursor: currentPage < data?.meta?.['last_page'] ? currentPage + 1 : undefined,
    prevCursor: currentPage > 1 ? currentPage - 1 : undefined,
    page: {
      data
    }
  }
}

export const getSubscriptionModels = async () => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/user/subscription-models`
  })
  return data
}
