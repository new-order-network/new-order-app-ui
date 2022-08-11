import { Button, Text } from '@chakra-ui/react'

import {
  VotingProposalProps,
  VotingStatusOrOutcome,
  VotingChoices,
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
        if (
          status === VotingStatusOrOutcome.CLOSED ||
          status === VotingStatusOrOutcome.ACTIVE
        ) {
          return proposal.state === status
        } else if (status !== VotingStatusOrOutcome.ALL && proposal.scores) {
          const highestVotedIndex = proposal.scores.indexOf(
            Math.max(...proposal.scores)
          )
          if (status === VotingStatusOrOutcome.PASSED) {
            return (
              proposal.state === VotingStatus.CLOSED &&
              proposal.choices[highestVotedIndex] === VotingChoices.FOR
            )
          } else if (status === VotingStatusOrOutcome.FAILED) {
            return (
              proposal.state === VotingStatus.CLOSED &&
              proposal.choices[highestVotedIndex] === VotingChoices.AGAINST
            )
          } else {
            return (
              proposal.state === VotingStatus.CLOSED &&
              proposal.choices[highestVotedIndex] === VotingChoices.ABSTAIN
            )
          }
        } else {
          return proposal
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
          status === VotingStatusOrOutcome.ALL
            ? 'greenSmallButton'
            : 'outlineGreen'
        }
        onClick={() => {
          return setStatus(VotingStatusOrOutcome.ALL)
        }}
      >
        All{' '}
        <Text ml="2">{countProposalsByStatus(VotingStatusOrOutcome.ALL)}</Text>
      </Button>
      <Button
        fontSize="0.75rem"
        h="6"
        fontWeight="bold"
        variant={
          status === VotingStatusOrOutcome.ACTIVE
            ? 'greenSmallButton'
            : 'outlineGreen'
        }
        onClick={() => {
          return setStatus(VotingStatusOrOutcome.ACTIVE)
        }}
      >
        Active{' '}
        <Text ml="2">
          {countProposalsByStatus(VotingStatusOrOutcome.ACTIVE)}
        </Text>
      </Button>
      <Button
        fontSize="0.75rem"
        h="6"
        fontWeight="bold"
        variant={
          status === VotingStatusOrOutcome.CLOSED
            ? 'greenSmallButton'
            : 'outlineGreen'
        }
        onClick={() => {
          return setStatus(VotingStatusOrOutcome.CLOSED)
        }}
      >
        Closed{' '}
        <Text ml="2">
          {countProposalsByStatus(VotingStatusOrOutcome.CLOSED)}
        </Text>
      </Button>
      <Button
        fontSize="0.75rem"
        h="6"
        fontWeight="bold"
        variant={
          status === VotingStatusOrOutcome.PASSED
            ? 'greenSmallButton'
            : 'outlineGreen'
        }
        onClick={() => {
          return setStatus(VotingStatusOrOutcome.PASSED)
        }}
      >
        Passed{' '}
        <Text ml="2">
          {countProposalsByStatus(VotingStatusOrOutcome.PASSED)}
        </Text>
      </Button>
      <Button
        fontSize="0.75rem"
        h="6"
        fontWeight="bold"
        variant={
          status === VotingStatusOrOutcome.FAILED
            ? 'greenSmallButton'
            : 'outlineGreen'
        }
        onClick={() => {
          return setStatus(VotingStatusOrOutcome.FAILED)
        }}
      >
        Failed{' '}
        <Text ml="2">
          {countProposalsByStatus(VotingStatusOrOutcome.FAILED)}
        </Text>
      </Button>
      <Button
        fontSize="0.75rem"
        h="6"
        fontWeight="bold"
        variant={
          status === VotingStatusOrOutcome.ABSTAINED
            ? 'greenSmallButton'
            : 'outlineGreen'
        }
        onClick={() => {
          return setStatus(VotingStatusOrOutcome.ABSTAINED)
        }}
      >
        Abstained{' '}
        <Text ml="2">
          {countProposalsByStatus(VotingStatusOrOutcome.ABSTAINED)}
        </Text>
      </Button>
    </>
  )
}

export default VotingStatusFilter
