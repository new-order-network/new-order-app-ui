import { SimpleGrid, Skeleton } from '@chakra-ui/react'

const VotingLoader = () => {
  return (
    <SimpleGrid
      mr={[0, 0, 0, 0, '16']}
      mt="3"
      minChildWidth={['200px', '300px']}
      spacing="5"
    >
      {Array.from(Array(12).keys()).map((i: number) => {
        return (
          <Skeleton
            key={i}
            borderRadius="sm"
            h="full"
            minH="16"
            w="full"
            startColor="gray.80"
            endColor="gray.85"
          />
        )
      })}
    </SimpleGrid>
  )
}

export default VotingLoader
