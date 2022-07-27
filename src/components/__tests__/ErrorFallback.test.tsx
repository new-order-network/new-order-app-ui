import React from 'react'
import { render } from '@testing-library/react'

import { ErrorFallback } from 'components/ErrorFallback'

describe('ErrorFallback.tsx component', () => {
  const { container } = render(
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <ErrorFallback error={new Error('test')} resetErrorBoundary={() => {}} />
  )

  test('match to snapshot', () => {
    expect(container).toMatchSnapshot()
  })
})
