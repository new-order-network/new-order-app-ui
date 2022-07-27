import { render } from '@testing-library/react'
import dayjs from 'dayjs'

import FormattedDate from 'components/Voting/FormattedDate'

describe('FormattedDate.tsx component', () => {
  const { container } = render(
    <FormattedDate date={dayjs(new Date('2022-01-01')).startOf('day').unix()} />
  )

  test('match to snapshot', () => {
    expect(container).toMatchSnapshot()
  })
})
