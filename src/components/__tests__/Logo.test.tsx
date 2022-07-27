import { render } from '@testing-library/react'

import Logo from 'components/Logo'

describe('Logo.tsx component', () => {
  const { container } = render(<Logo />)

  test('match to snapshot', () => {
    expect(container).toMatchSnapshot()
  })
})
