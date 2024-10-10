import axiosInstance from '../http/axiosInstance'
import { CHART_TYPES } from '../../pages/analytics/views/Sales'

export type IChartType = (typeof CHART_TYPES)[keyof typeof CHART_TYPES]

interface ISalesAnalytics {
  dateFrom?: string
  dateTo?: string
  categoryId?: number
  chart?: IChartType
}

export const getSalesAnalytics = async ({ dateFrom, dateTo, categoryId, chart }: ISalesAnalytics) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: '/api/user/analytic/sales',
    params: {
      date_from: dateFrom,
      date_to: dateTo,
      category: categoryId,
      chart: chart
    }
  })

  return data
}

export type ReportFilter = 'all' | 'premium' | 'videos' | 'photos'
export type ReportTab = 'content' | 'subscriptions' | 'messages' | 'streams'
interface IReportsAnalytics<TChart = IChartType> {
  tab: ReportTab
  filter?: ReportFilter
  chart?: TChart
  dateFrom?: string
  dateTo?: string
  categoryId?: number
}

export const getReportsAnalytics = async <TChart>({
  tab,
  filter,
  dateFrom,
  dateTo,
  categoryId,
  chart
}: IReportsAnalytics<TChart>) => {
  const { data } = await axiosInstance({
    method: 'get',
    url: '/api/user/analytic/reports',
    params: {
      tab,
      filter,
      date_from: dateFrom,
      date_to: dateTo,
      category: categoryId,
      chart: chart
    }
  })

  return data
}
