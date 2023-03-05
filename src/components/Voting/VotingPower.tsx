import { Button, Tooltip } from '@chakra-ui/react'

import { useVotingContext } from 'store/contexts/votingContext'

const VotingPower = () => {
  const { totalVotingPower, votingPowerDenomination } = useVotingContext()

  return (
    <Tooltip
      hasArrow
      label={`${votingPowerDenomination?.sNEWO.toFixed(
        2
      )} sNEWO + ${votingPowerDenomination?.veNEWO.toFixed(
        2
      )} veNEWO + ${votingPowerDenomination?.veNEWOa.toFixed(2)} veNEWOa`}
    >
      <Button
        fontSize="0.8rem"
        fontWeight="bold"
        variant="outlineGreenRounded"
        cursor="default"
      >
        Voting Power: {totalVotingPower.toFixed(2)}
      </Button>
    </Tooltip>
  )
}

export default VotingPower
