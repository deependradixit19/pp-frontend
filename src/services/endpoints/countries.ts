import axiosInstance from '../http/axiosInstance'

export interface IState {
  id: number
  name: string
  code: string
  blocked: number
}

export interface ICountry {
  id: number
  name: string
  code: string
  blocked: number
  regions: IState[]
}

export const getCountries = async (): Promise<ICountry[]> => {
  const { data } = await axiosInstance({
    method: 'get',
    url: '/api/user/geo-block'
  })
  return data.data
}
