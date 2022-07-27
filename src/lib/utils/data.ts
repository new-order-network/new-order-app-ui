import dayjs from 'dayjs'

import { ChartData, VeNewoChartData } from 'models/chart'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getKeyByValue = (object: any, value: any) => {
  return Object.keys(object).find((key) => {
    return object[key] === value
  })
}

export const convertToChartData = (data: VeNewoChartData[]) => {
  const newChartData: ChartData[] = []
  data.forEach((supply: VeNewoChartData) => {
    newChartData.push({
      x: dayjs(supply.date)?.format('YYYY-MM-DD'),
      y: parseFloat(supply.value),
    })
  })

  return newChartData
}
