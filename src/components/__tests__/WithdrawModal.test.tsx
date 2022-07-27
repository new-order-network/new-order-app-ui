/* eslint-disable @typescript-eslint/no-empty-function */
import { render } from '@testing-library/react'

import ModalOverlay from 'components/ModalOverlay'
import WithdrawModal from 'components/Vault/WithdrawModal'

describe('WithdrawModal.tsx component', () => {
  const { container } = render(
    <WithdrawModal
      isOpen={true}
      onClose={() => {}}
      overlay={<ModalOverlay />}
      currentDeposit={'0'}
      tokenSymbol={'testSLP'}
      withdrawAmount={'1'}
      setWithdrawAmount={() => {}}
      withdrawTokens={() => {}}
      loading={false}
    />
  )

  test('match to snapshot', () => {
    expect(container).toMatchSnapshot()
  })
})
