import { Button, Text } from '@chakra-ui/react'

import {
  VotingProposalProps,
  VotingStatus,
  VotingStatusChoices,
} from 'models/voting'

interface VotingStatusFilterProps {
  votingProposals: VotingProposalProps[]
  status: VotingStatusChoices
  setStatus: (status: VotingStatusChoices) => void
}

const VotingStatusFilter: React.FC<VotingStatusFilterProps> = ({
  votingProposals,
  status,
  setStatus,
}) => {
  const countProposalsByStatus = (status: VotingStatusChoices) => {
    return (
      votingProposals &&
      votingProposals.filter((proposal: VotingProposalProps) => {
        if (status === VotingStatus.ALL) {
          return proposal
        } else {
          return proposal.state === status
        }
      })?.length
    )
  }

  return (
    <>
      <Text>Status</Text>
      <Button
        fontSize="0.75rem"
        h="6"
        fontWeight="bold"
        variant={
          status === VotingStatus.ALL ? 'greenSmallButton' : 'outlineGreen'
        }
        onClick={() => {
          return setStatus(VotingStatus.ALL)
        }}
      >
        All <Text ml="2">{countProposalsByStatus(VotingStatus.ALL)}</Text>
      </Button>
      <Button
        fontSize="0.75rem"
        h="6"
        fontWeight="bold"
        variant={
          status === VotingStatus.ACTIVE ? 'greenSmallButton' : 'outlineGreen'
        }
        onClick={() => {
          return setStatus(VotingStatus.ACTIVE)
        }}
      >
        Active <Text ml="2">{countProposalsByStatus(VotingStatus.ACTIVE)}</Text>
      </Button>
      <Button
        fontSize="0.75rem"
        h="6"
        fontWeight="bold"
        variant={
          status === VotingStatus.PENDING ? 'greenSmallButton' : 'outlineGreen'
        }
        onClick={() => {
          return setStatus(VotingStatus.PENDING)
        }}
      >
        Pending{' '}
        <Text ml="2">{countProposalsByStatus(VotingStatus.PENDING)}</Text>
      </Button>
      <Button
        fontSize="0.75rem"
        h="6"
        fontWeight="bold"
        variant={
          status === VotingStatus.CLOSED ? 'greenSmallButton' : 'outlineGreen'
        }
        onClick={() => {
          return setStatus(VotingStatus.CLOSED)
        }}
      >
        Closed <Text ml="2">{countProposalsByStatus(VotingStatus.CLOSED)}</Text>
      </Button>
    </>
  )
}

export default VotingStatusFilter
