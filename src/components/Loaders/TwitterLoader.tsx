import {
  Flex,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
} from '@chakra-ui/react'

const TwitterLoader = () => {
  return (
    <Stack mb="5">
      <Flex gap="3">
        <SkeletonCircle
          startColor="gray.80"
          endColor="gray.85"
          size="10"
          mb="1"
        />
        <Stack>
          <Skeleton startColor="gray.80" endColor="gray.85" height="4" w="16" />
          <Skeleton startColor="gray.80" endColor="gray.85" height="3" w="10" />
        </Stack>
      </Flex>
      <SkeletonText
        startColor="gray.80"
        endColor="gray.85"
        mt="4"
        noOfLines={4}
        spacing="4"
      />
    </Stack>
  )
}

export default TwitterLoader
