import { fireEvent, render, waitFor } from '@testing-library/react'

import DateRangePicker from 'components/Forms/DateRangePicker'

describe('CustomDatePicker.tsx component', () => {
  const { container, getByTestId } = render(
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <DateRangePicker onDateChange={() => {}} placeholder="Vote Launch:" />
  )
  it('Date Range picker', async () => {
    const testDateRangePicker = getByTestId('dateRangePicker')
    fireEvent.click(testDateRangePicker)
    await waitFor(() => {
      return fireEvent.change(testDateRangePicker, {
        target: {
          value: '07/06/2022 - 07/22/2022',
        },
      })
    })
    expect((testDateRangePicker as HTMLInputElement).value).toBe(
      '07/06/2022 - 07/22/2022'
    )
  })
  test('match to snapshot', () => {
    expect(container).toMatchSnapshot()
  })
})
