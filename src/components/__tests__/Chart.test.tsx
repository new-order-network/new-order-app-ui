import { ChakraProvider } from '@chakra-ui/react'
import { render } from '@testing-library/react'

import { LineChart } from 'components/Chart'

import theme from 'theme'

describe('Logo.tsx component', () => {
  const testChartData = [
    { x: '2022-01-01', y: 1000000 },
    { x: '2022-01-02', y: 200000 },
    { x: '2022-01-03', y: 500000 },
  ]
  const { container } = render(
    <ChakraProvider theme={theme}>
      <LineChart data={testChartData} />
    </ChakraProvider>
  )

  test('match to snapshot', () => {
    expect(container).toMatchSnapshot()
  })
})
