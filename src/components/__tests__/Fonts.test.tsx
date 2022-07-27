import { render } from '@testing-library/react'

import Fonts from 'components/Fonts'

describe('Fonts.tsx component', () => {
  const { container } = render(<Fonts />)

  test('match to snapshot', () => {
    expect(container).toMatchSnapshot()
  })
})
