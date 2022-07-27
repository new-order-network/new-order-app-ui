import { Button, Tooltip } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { useAccount } from 'wagmi'

import { Td, Tr } from 'components/Table'

import { useVeNewoContext } from 'store/contexts/veNewoContext'

const LockedToken = () => {
  const { data: accountData } = useAccount()
  const { assetBalance, unlockDate } = useVeNewoContext()

  return (
    <Tr>
      <Td>NEWO</Td>
      <Td>{assetBalance}</Td>
      <Td>{dayjs.unix(unlockDate).format('MMM DD YYYY')}</Td>
      <Td>
        <Tooltip
          hasArrow
          label="You can't withdraw your funds before the unlock date"
          isDisabled={dayjs().isAfter(dayjs.unix(unlockDate))}
        >
          <Button
            variant="greenButton"
            isDisabled={
              !accountData?.address || dayjs().isBefore(dayjs.unix(unlockDate))
            }
          >
            Withdraw
          </Button>
        </Tooltip>
      </Td>
    </Tr>
  )
}

export default LockedToken
