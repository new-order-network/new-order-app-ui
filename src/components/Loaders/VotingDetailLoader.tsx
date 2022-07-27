import { SimpleGrid, Skeleton } from '@chakra-ui/react'

const VotingDetailLoader = () => {
  return (
    <SimpleGrid mt="3" spacing="5">
      <Skeleton
        borderRadius="sm"
        h="full"
        minH="40"
        w={['full', 'xs']}
        startColor="gray.80"
        endColor="gray.85"
      />
      <Skeleton
        borderRadius="sm"
        h="full"
        minH="96"
        w="full"
        startColor="gray.80"
        endColor="gray.85"
      />
    </SimpleGrid>
  )
}

export default VotingDetailLoader
