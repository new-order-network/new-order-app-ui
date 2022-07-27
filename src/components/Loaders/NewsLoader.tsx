import {
  Box,
  Flex,
  Grid,
  GridItem,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react'

const NewsLoader = () => {
  return (
    <Grid
      gridTemplateColumns={[
        '1fr',
        '1fr',
        '180px auto',
        '200px auto',
        '240px auto',
      ]}
      mb="4"
    >
      <GridItem>
        <Skeleton
          borderRadius="sm"
          h={['180px', '180px', 'full']}
          w="full"
          startColor="gray.80"
          endColor="gray.85"
        />
      </GridItem>
      <GridItem>
        <Flex ml={[0, 0, '3', '5']} flexDirection="column">
          <Flex
            mb="2"
            w="full"
            mt={['4', '4', 0]}
            justifyContent="space-between"
            gap="2"
            flexWrap="wrap"
          >
            <Flex alignItems="center" flexWrap="wrap" gap="2">
              <Skeleton
                h="16px"
                w="80px"
                startColor="gray.80"
                endColor="gray.85"
              />
              <Skeleton
                h="16px"
                w="80px"
                startColor="gray.80"
                endColor="gray.85"
              />
            </Flex>
            <Skeleton
              h="15px"
              w="100px"
              startColor="gray.80"
              endColor="gray.85"
            />
          </Flex>
          <Box pr="4">
            <Skeleton
              mt="4"
              h="15px"
              maxW="sm"
              startColor="gray.80"
              endColor="gray.85"
            />
            <SkeletonText
              startColor="gray.80"
              endColor="gray.85"
              mt="4"
              noOfLines={3}
              spacing="3"
            />
          </Box>
        </Flex>
      </GridItem>
    </Grid>
  )
}

export default NewsLoader
