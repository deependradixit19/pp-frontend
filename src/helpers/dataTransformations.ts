import dayjs from 'dayjs'
import { t } from 'i18next'

export const toFixedNumber = (number: any, decimals = 2) => {
  return Number(number).toFixed(decimals)
}

export const stringVal = (val: number) => val.toString()
export const valToPercent = (val: number, decimals = 0) => `${toFixedNumber(val, decimals)}%`
export const valToDollar = (val: number, decimals = 0) => `${toFixedNumber(val, decimals)}$`

interface IGetAnalyticsChartData {
  fetchPromise: Promise<any>
}
export const getAnalyticsChartData = async ({ fetchPromise }: IGetAnalyticsChartData) => {
  const data = await fetchPromise

  const graphData = data?.chart?.map?.((salePeriod: any) => {
    let x, date
    if (salePeriod.month) {
      const month = dayjs(salePeriod.month)
      x = month.format('MMM YY')
      date = month.format('MMM YYYY')
    } else if (salePeriod.day) {
      const day = dayjs(salePeriod.day)
      if (data.chart.length > 7) {
        x = day
          .format('L')
          .replace(/\d{4}/, '') // remove year
          .replace(/^\D|\D(?=\D)|\D$/, '') // remove extra separators
      } else {
        x = day.format('ddd')
      }
      date = day.format('MMM D')
    }

    return {
      date,
      x,
      y: salePeriod.sum
    }
  })

  return graphData
}

export const transformEarningsChartData = async ({ fetchPromise }: IGetAnalyticsChartData) => {
  const data = await fetchPromise

  const graphData = data?.chart?.map?.((salePeriod: any) => {
    let x, date
    if (salePeriod.month) {
      const month = dayjs(salePeriod.month)
      x = month.format('MMM YY')
      date = month.format('MMM YYYY')
    } else if (salePeriod.week) {
      x = `${t('week')} ${salePeriod.week}`
      date = salePeriod.week
    } else if (salePeriod.day) {
      const day = dayjs(salePeriod.day)
      if (data.chart.length > 7) {
        x = day
          .format('L')
          .replace(/\d{4}/, '') // remove year
          .replace(/^\D|\D(?=\D)|\D$/, '') // remove extra separators
      } else {
        x = day.format('ddd')
      }
      date = day.format('MMM D')
    }

    return {
      date,
      x,
      y: salePeriod.sum
    }
  })

  return graphData
}
