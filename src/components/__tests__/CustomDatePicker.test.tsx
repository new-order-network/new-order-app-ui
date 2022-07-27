import { fireEvent, render, waitFor } from '@testing-library/react'

import CustomDatePicker from 'components/Forms/DatePicker'

describe('CustomDatePicker.tsx component', () => {
  const { container, getByTestId } = render(
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <CustomDatePicker placeholder="" onChange={() => {}} />
  )
  it('Date picker', async () => {
    const testDatePicker = getByTestId('datePicker')
    fireEvent.click(testDatePicker)
    await waitFor(() => {
      return fireEvent.change(testDatePicker, {
        target: { value: '29 Oct, 2020' },
      })
    })
    expect((testDatePicker as HTMLInputElement).value).toBe('29 Oct, 2020')
  })
  test('match to snapshot', () => {
    expect(container).toMatchSnapshot()
  })
})
