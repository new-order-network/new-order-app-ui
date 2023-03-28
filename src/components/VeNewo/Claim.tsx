import {
  Box,
  Button,
  Flex,
  Grid,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import { useAccount, useNetwork } from 'wagmi'

import Card from 'components/Card'
import ConnectOverlay from 'components/ConnectOverlay'
import LockedToken from 'components/VeNewo/LockedToken'
import RegisteredReward from 'components/VeNewo/RegisteredReward'
import DeclarationModal from 'components/VeNewo/DeclarationModal'

import { useVeNewoContext } from 'store/contexts/veNewoContext'
import { useContractContext } from 'store/contexts/contractContext'

import { veVaults } from 'constants/vaults'

const Claim = () => {
  const {
    isOpen: declarationModalIsOpen,
    onOpen: declarationModalOnOpen,
    onClose: declarationModalOnClose,
  } = useDisclosure()
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { contracts } = useContractContext()
  const {
    assetBalance,
    balance,
    multiplier,
    totalRewardsEarned,
    loading: veNewoLoading,
    getAllRewards,
  } = useVeNewoContext()

  return (
    <ConnectOverlay isConnected={!!address}>
      <Grid templateColumns={['1fr', '1fr', '1fr', 'repeat(3,1fr)']} gap="3">
        <Card variant="simple">
          <Stat>
            <StatLabel fontSize="lg">Your locked NEWO</StatLabel>
            <StatNumber color="brand.green" fontSize="2xl">
              {Number(assetBalance).toFixed(4)}
            </StatNumber>
          </Stat>
        </Card>
        <Card variant="simple">
          <Stat>
            <StatLabel fontSize="lg">Your veNEWO balance</StatLabel>
            <StatNumber color="brand.green" fontSize="2xl">
              {Number(balance).toFixed(4)}
            </StatNumber>
          </Stat>
        </Card>
        <Card variant="simple">
          <Stat>
            <StatLabel fontSize="lg">Your Multiplier</StatLabel>
            <StatNumber color="brand.green" fontSize="2xl">
              {multiplier}x
            </StatNumber>
          </Stat>
        </Card>
      </Grid>

      <Stack my="6">
        <Text fontSize="xl" color="brand.green">
          Locked Tokens Information
        </Text>

        <Box
          border="1px solid"
          borderColor="gray.80"
          borderRadius="8"
          overflow="hidden"
        >
          <Table variant="grayStriped">
            <Thead>
              <Tr>
                <Th>Token</Th>
                <Th>Amount Locked</Th>
                <Th>Unlock Date</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              <LockedToken
                veTokenAddress={contracts.VENEWO}
                tokenAddress={contracts.NEWO}
              />
            </Tbody>
          </Table>
        </Box>
      </Stack>

      <Stack my="6">
        <Flex justify="space-between" align="center" mb="2">
          <Text fontSize="xl" color="brand.green">
            Rewards Information
          </Text>

          <DeclarationModal
            isOpen={declarationModalIsOpen}
            onClose={declarationModalOnClose}
            submitFn={getAllRewards}
          />
          <Button
            variant="greenButton"
            onClick={declarationModalOnOpen}
            isDisabled={Number(totalRewardsEarned) <= 0}
            isLoading={veNewoLoading}
          >
            Claim All Rewards
          </Button>
        </Flex>

        <Box
          border="1px solid"
          borderColor="gray.80"
          borderRadius="8"
          overflow="hidden"
        >
          <Table variant="grayStriped">
            <Thead>
              <Tr>
                <Th>Token</Th>
                <Th>AVG APR</Th>
                <Th>Boost</Th>
                <Th>Rewards Earned</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {chain &&
                chain.id &&
                veVaults[chain.id].length > 0 &&
                veVaults[chain.id].map((veVault) => {
                  return (
                    <RegisteredReward
                      key={veVault.veVaultAdderss}
                      veVaultAddress={veVault.veVaultAdderss}
                      tokenAddress={veVault.tokenAddress}
                      token0={veVault.token0}
                      token1={veVault.token1}
                    />
                  )
                })}
            </Tbody>
          </Table>
        </Box>
      </Stack>
    </ConnectOverlay>
  )
}

export default Claim
