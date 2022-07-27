import { render } from '@testing-library/react'

import StatusAmount from 'components/Vault/StatusAmount'

describe('StatusAmount.tsx component', () => {
  const { container } = render(
    <StatusAmount label="Test Label" data="Test Amount " />
  )

  test('match to snapshot', () => {
    expect(container).toMatchSnapshot()
  })
})
