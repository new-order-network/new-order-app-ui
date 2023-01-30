import { Button, Tooltip } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { useAccount } from 'wagmi'

import { Td, Tr } from 'components/Table'

import useVeToken from 'hooks/useVeToken'

import { useVeNewoContext } from 'store/contexts/veNewoContext'

interface LockedTokenProps {
  veTokenAddress: `0x${string}`
  tokenAddress: `0x${string}`
}

const LockedToken: React.FC<LockedTokenProps> = ({
  veTokenAddress,
  tokenAddress,
}) => {
  const { address } = useAccount()
  const { assetBalance, unlockDate } = useVeNewoContext()
  const veToken = useVeToken(veTokenAddress, tokenAddress)

  return (
    <Tr>
      <Td>NEWO</Td>
      <Td>{Number(assetBalance).toFixed(4)}</Td>
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
              !address ||
              dayjs().isBefore(dayjs.unix(unlockDate)) ||
              Number(assetBalance) <= 0
            }
            onClick={veToken.exit}
            isLoading={veToken.loading}
          >
            Withdraw
          </Button>
        </Tooltip>
      </Td>
    </Tr>
  )
}

export default LockedToken
