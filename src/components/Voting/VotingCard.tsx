import { Button, Flex, Link, Text } from '@chakra-ui/react'
import RemoveMarkdown from 'remove-markdown'

import Card from 'components/Card'
import FormattedDate from 'components/Voting/FormattedDate'

import { VotingProposalProps } from 'models/voting'

interface VotingCardProps {
  proposal: VotingProposalProps
}

const VotingCard: React.FC<VotingCardProps> = ({
  proposal: { state, title, body, start, id },
}) => {
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
              {state}
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
