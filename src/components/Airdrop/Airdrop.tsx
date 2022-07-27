import {
  Box,
  Button,
  Flex,
  GridItem,
  Icon,
  Stack,
  Text,
} from '@chakra-ui/react'
import { HiCheckCircle } from 'react-icons/hi'

import useAirdrop from 'hooks/useAirdrop'
import useToken from 'hooks/useToken'

import { AirdropProps } from 'constants/airdrop/airdrops'

const Airdrop: React.FC<AirdropProps> = ({
  distributorAddress,
  tokenAddress,
  merkleRoot,
}) => {
  const airdrop = useAirdrop(merkleRoot, tokenAddress, distributorAddress)
  const token = useToken(tokenAddress)

  return (
    <GridItem mb="4">
      <Text fontSize="lg">
        As a member of the New Order DAO you may claim your airdrops here.
      </Text>
      <Box bg="gray.85" p="7" borderRadius="md" mt="8">
        <Flex
          flexWrap="wrap"
          gap="4"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack>
            <Text fontSize="xs" color="gray.50">
              Available Airdrops
            </Text>

            <Text fontSize="2xl" fontWeight="extrabold" color="white">
              {Number(airdrop?.airdropAmount).toFixed(2)} {token.tokenSymbol}
            </Text>
          </Stack>
          <Flex flexWrap="wrap" gap="4" alignItems="center">
            {/* TODO Insert View on Explorer button here */}
            <Button
              fontWeight="extrabold"
              px="12"
              leftIcon={
                airdrop.isClaimed ? (
                  <Icon as={HiCheckCircle} fontSize="20px" />
                ) : undefined
              }
              variant="greenButton"
              isLoading={airdrop.loading}
              loadingText="Claiming"
              disabled={
                !airdrop.isEligible || airdrop.isClaimed || airdrop.loading
              }
              onClick={airdrop.claim}
            >
              {airdrop.isClaimed ? 'Claimed' : 'Claim'}
            </Button>
          </Flex>
        </Flex>
      </Box>
    </GridItem>
  )
}

export default Airdrop
