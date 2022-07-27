import { Circle, Flex, Link, Text } from '@chakra-ui/react'

import { env } from 'lib/environment'

interface MemberHashProps {
  id: string
  hashSum: string
}

const MemberHash: React.FC<MemberHashProps> = ({ id, hashSum }) => {
  const voteHref = `https://snapshot.org/#/${env.NEXT_PUBLIC_SNAPSHOT_SPACE}/proposal/${id}`
  const shortHash = hashSum && `${hashSum.slice(0, 6)}...${hashSum.slice(-4)}`

  return (
    <Link isExternal href={voteHref}>
      <Flex
        alignItems="center"
        flexWrap="wrap"
        gap="2"
        bg="gray.85"
        pr="3"
        borderRadius="full"
        display="inline-flex"
        transition="all 0.3s ease"
        _hover={{
          bg: 'white',
          color: 'gray.100',
        }}
      >
        <Circle
          size="20px"
          bgGradient="linear(to-r, brand.blue,brand.purple)"
          color="white"
        ></Circle>
        <Text fontSize="x-small" fontWeight="extrabold">
          {shortHash}
        </Text>
      </Flex>
    </Link>
  )
}

export default MemberHash
