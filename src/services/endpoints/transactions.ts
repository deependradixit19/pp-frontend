import axiosInstance from '../http/axiosInstance'

export type TransactionFilter = 'wallet' | 'card' | 'error' | undefined

interface ITransactions {
  filter?: TransactionFilter
  searchTerm?: string
  currentPage?: number
  perPage?: number
}

export const getTransactions = async ({ filter, searchTerm, currentPage = 1, perPage = 15 }: ITransactions) => {
  //   URL: {{host}}/api/transactions/history
  // QUERY PARAMS:
  // perPage: 1 (default) - optional
  // page: 1 (default) - optional
  // type: OneOf ['wallet', 'card', 'error'] - optional
  // *** By default it will return all transactions unless you use the filters

  // METHOD: GET
  // URL: {{host}}/api/transactions/search/{keyword}
  // QUERY PARAMS:
  // perPage: 1 (default) - optional
  // page: 1 (default) - optional
  if (searchTerm) {
    const { data: searchData } = await axiosInstance({
      method: 'get',
      url: `/api/transactions/search/${searchTerm}`,
      params: {
        perPage,
        page: currentPage
      }
    })

    return searchData
  }
  const { data } = await axiosInstance({
    method: 'get',
    url: '/api/transactions/history',
    params: {
      perPage,
      page: currentPage,
      type: filter
    }
  })

  return data
}
