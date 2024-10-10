import axiosInstance from '../http/axiosInstance'

export const putBasicPayoutSettings = async (payload: { payout_method: string; payout_frequency: string }) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: '/api/user/payout/settings',
    data: payload
  })

  return data
}

export const getBankInformation = async () => {
  const { data } = await axiosInstance({
    method: 'get',
    url: `/api/user/payout/bank-details`
  })

  return data
}

export const deleteBankInformation = async () => {
  const { data } = await axiosInstance({
    method: 'delete',
    url: `/api/user/payout/bank-details`
  })

  return data
}

export const putBankInformation = async (payload: {
  swift_bic: string
  routing_number: string
  account_number: string
  bank_name: string
  bank_country: string
  bank_country_iso: string
  bank_state: string
  bank_city: string
  bank_street: string
  bank_postal_code: string
  beneficiary_first_name: string
  beneficiary_last_name: string
  beneficiary_country: string
  beneficiary_country_iso: string
  beneficiary_city: string
  beneficiary_state: string
  beneficiary_street: string
  beneficiary_postal_code: string
  phone_number: string
}) => {
  const { data } = await axiosInstance({
    method: 'put',
    url: '/api/user/payout/bank-details',
    data: payload
  })

  return data
}

export type PayoutDocumentType = 'w9' | 'w8ben' | 'w8bene'

export const postDocument = ({
  file,
  type,
  setProgress
}: {
  file: File
  type: PayoutDocumentType
  setProgress?: (loaded: number, total: number, cancelCb: () => void) => void
}) => {
  try {
    const data = new FormData()
    const controller = new AbortController()

    data.append('file', file)
    data.append('type', type)

    return axiosInstance.post('/api/user/document/upload-pdf', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      signal: controller.signal,
      onUploadProgress: p => {
        setProgress && setProgress(p.loaded, p.total!, () => controller.abort())
      }
    })
  } catch (err) {
    console.error({ err })
    throw new Error('postDocument error')
  }
}
