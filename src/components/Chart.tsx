import {
  AnimatedGrid,
  Tooltip,
  XYChart,
  AreaSeries,
  buildChartTheme,
  AnimatedAxis,
} from '@visx/xychart'
import { LinearGradient } from '@visx/gradient'
import { Stack, Text, useTheme } from '@chakra-ui/react'
import dayjs from 'dayjs'

import { numberFormatter } from 'lib/utils/format'

import { ChartData, ChartTooltipData } from 'models/chart'

const accessors = {
  xAccessor: (d: ChartData) => {
    // return dayjs(d?.x)?.startOf('day')
    return new Date(`${d?.x}T00:00:00`)
  },
  yAccessor: (d: ChartData) => {
    return d?.y
  },
}

interface LineChartProps {
  data: ChartData[]
}

export const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const theme = useTheme()
  const customTheme = buildChartTheme({
    colors: [theme.colors.brand.pink],
    gridColor: theme.colors.gray[80],
    gridColorDark: theme.colors.gray[80],
    backgroundColor: theme.colors.gray[20],
    tickLength: 1,
  })

  return (
    <XYChart
      key="chart"
      margin={{ left: 40, top: 10, bottom: 20, right: 0 }}
      theme={customTheme}
      height={250}
      xScale={{ type: 'time' }}
      yScale={{ type: 'linear' }}
    >
      <AnimatedGrid
        columns
        numTicks={8}
        lineStyle={{
          stroke: theme.colors.gray[85],
          strokeLinecap: 'round',
          strokeWidth: 1,
        }}
        stroke={theme.colors.gray[85]}
        strokeWidth="1px"
        strokeDasharray="0, 1"
      />
      <LinearGradient
        id="area-gradient"
        from={theme.colors.pink[80]}
        to={theme.colors.pink[90]}
        fromOpacity={0.5}
        toOpacity={0}
      />
      <AreaSeries
        fill="url(#area-gradient)"
        dataKey="supply"
        data={data}
        {...accessors}
      />

      <AnimatedAxis
        orientation="left"
        numTicks={6}
        tickFormat={(value) => {
          return numberFormatter(value)
        }}
        tickLabelProps={() => {
          return { dx: -10 }
        }}
      />

      <AnimatedAxis
        orientation="bottom"
        numTicks={4}
        tickLabelProps={() => {
          return { dx: -10 }
        }}
      />

      <Tooltip<ChartTooltipData>
        key="tooltip"
        showHorizontalCrosshair
        showVerticalCrosshair
        verticalCrosshairStyle={{
          strokeDasharray: '3,5',
          strokeLinecap: 'round',
          stroke: theme.colors.gray[60],
        }}
        horizontalCrosshairStyle={{
          strokeDasharray: '3,5',
          strokeLinecap: 'round',
          stroke: theme.colors.gray[60],
        }}
        renderTooltip={({ tooltipData }) => {
          return (
            <Stack p="1" spacing="2" color="gray.75">
              <Text fontFamily="america" fontWeight="normal" fontSize="0.7rem">
                {dayjs(tooltipData?.nearestDatum?.datum?.x)?.format(
                  'MMM DD, YYYY'
                )}
              </Text>
              <Text fontFamily="america" fontWeight="normal" fontSize="0.7rem">
                {numberFormatter(tooltipData?.nearestDatum?.datum?.y || '')}
              </Text>
            </Stack>
          )
        }}
      />
    </XYChart>
  )
}
