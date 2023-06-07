import { Button, Flex, Link, Text } from '@chakra-ui/react'
import RemoveMarkdown from 'remove-markdown'
import { useEffect, useState } from 'react'

import Card from 'components/Card'
import FormattedDate from 'components/Voting/FormattedDate'

import {
  VotingChoices,
  VotingProposalProps,
  VotingOutcomes,
  VotingStatus,
} from 'models/voting'

interface VotingCardProps {
  proposal: VotingProposalProps
}

const VotingCard: React.FC<VotingCardProps> = ({
  proposal: { state, title, body, start, id, choices, scores },
}) => {
  const [stateText, setStateText] = useState(state)

  useEffect(() => {
    if (state === VotingStatus.CLOSED) {
      const highestVotedIndex = scores?.indexOf(Math.max(...scores))
      if (choices[highestVotedIndex] === VotingChoices.FOR) {
        setStateText(VotingOutcomes.PASSED)
      } else if (choices[highestVotedIndex] === VotingChoices.AGAINST) {
        setStateText(VotingOutcomes.FAILED)
      } else {
        setStateText(choices[highestVotedIndex])
      }
    }
  }, [choices, scores, state])

  return (
    <Card variant="simple">
      <Link href={`/voting/${id}`}>
        <>
          <Flex alignItems="center" justifyContent="space-between">
            <Text color="gray.50" fontSize="xs">
              Status
            </Text>
            <Button
              fontSize="0.75rem"
              h="6"
              fontWeight="bold"
              variant={state === 'active' ? 'greenSmallButton' : 'outlineGreen'}
              textTransform="uppercase"
            >
              {stateText}
            </Button>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" mt="2">
            <Text color="gray.50" fontSize="xs">
              Vote Launch
            </Text>
            <FormattedDate date={start} />
          </Flex>
          <Text fontSize="lg" fontWeight="extrabold" my="4">
            {title}
          </Text>
          <Text color="gray.50" fontSize="xs">
            Description
          </Text>
          <Text color="gray.10" fontSize="sm" noOfLines={[5, 5]}>
            {RemoveMarkdown(body).replace('\n', ' ')}
          </Text>
        </>
      </Link>
    </Card>
  )
}

export default VotingCard
