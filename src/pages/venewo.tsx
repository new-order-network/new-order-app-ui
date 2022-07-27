import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Link,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react'
import { useAccount, useNetwork } from 'wagmi'
import { useEffect, useState } from 'react'
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi'

import Card from 'components/Card'
import LockForm from 'components/VeNewo/LockForm'
import Supply from 'components/VeNewo/Supply'
import Transaction from 'components/VeNewo/Transaction'
import LockedToken from 'components/VeNewo/LockedToken'
import RegisteredReward from 'components/VeNewo/RegisteredReward'
import { Table, Tbody, Thead, Th, Tr } from 'components/Table'
import Position from 'components/VeNewo/Position'
import ConnectOverlay from 'components/ConnectOverlay'

import { numberFormatter, shortAddress } from 'lib/utils/format'

import { useContractContext } from 'store/contexts/contractContext'
import { useVeNewoContext } from 'store/contexts/veNewoContext'

import { DEFAULT_NETWORK } from 'constants/network'
import ExternalLink from 'constants/externalLink'

import Layout from 'layout'

const Page = () => {
  const { contracts } = useContractContext()
  const { activeChain } = useNetwork()
  const { data: accountData } = useAccount()
  const { totalLocked, totalBalance, assetBalance, balance, multiplier } =
    useVeNewoContext()

  const [blockExplorer, setBlockExplorer] = useState(
    DEFAULT_NETWORK.blockExplorers?.default.url
  )

  useEffect(() => {
    let blockExplorerUrl = DEFAULT_NETWORK.blockExplorers?.default.url
    if (activeChain) {
      blockExplorerUrl = activeChain?.blockExplorers?.default?.url
    }

    setBlockExplorer(blockExplorerUrl)
  }, [activeChain])

  return (
    <Layout pageTitle="New Order | veNEWO">
      <Stack spacing="4">
        <Box position="relative">
          <Flex
            flexWrap="wrap"
            position={['static', 'absolute', 'absolute']}
            right="40px"
            top="5"
            gap="3"
            p={['24px 24px 12px', '0', '0']}
          >
            <Link href={ExternalLink.veNewoFAQ} isExternal>
              <Button
                fontSize="0.8rem"
                fontWeight="bold"
                variant="outlineGrayRounded"
                leftIcon={
                  <Icon
                    as={HiOutlineQuestionMarkCircle}
                    fontSize="18"
                    color="gray.20"
                  />
                }
              >
                Frequently Asked Questions
              </Button>
            </Link>
          </Flex>

          <Tabs w="full" variant="pinkTab" pt="6" isLazy>
            <TabList px={['4', '4', '8']}>
              <Tab>Locker</Tab>
              <Tab>Claim</Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={['4', '4', '8']}>
                <Grid
                  templateColumns={[
                    '1fr',
                    '1fr',
                    '1fr',
                    '1fr',
                    '1fr',
                    '4fr 3fr',
                  ]}
                  gap="6"
                >
                  <GridItem>
                    <Stack spacing="4">
                      <Stack>
                        <Heading size="lg" color="brand.green">
                          NEWO Locker
                        </Heading>
                        <Text>
                          Lock NEWO for ranging periods to receive protocol
                          perks such as: Governance power, Protocol emissions,
                          Treasury rewards, Airdrops and Whitelists. Note that
                          veNEWO will not be a transferable token and it will
                          not trade on liquid markets. Click{' '}
                          <Link
                            href="https://docs.neworder.network/new-order/protocol-overview/venewo"
                            isExternal
                            color="brand.green"
                            variant="whiteTransition"
                          >
                            here
                          </Link>{' '}
                          to learn more.
                        </Text>
                      </Stack>

                      <Grid templateColumns={['1fr', 'repeat(2,1fr)']} gap="3">
                        <Card variant="simple">
                          <Stat>
                            <StatLabel fontSize="lg">NEWO locked</StatLabel>
                            <StatNumber color="brand.green" fontSize="2xl">
                              {numberFormatter(totalLocked, 4)}
                            </StatNumber>
                          </Stat>
                        </Card>
                        <Card variant="simple">
                          <Stat>
                            <StatLabel fontSize="lg">veNEWO balance</StatLabel>
                            <StatNumber color="brand.green" fontSize="2xl">
                              {numberFormatter(totalBalance, 4)}
                            </StatNumber>
                          </Stat>
                        </Card>
                      </Grid>

                      <Supply />

                      <Transaction />
                    </Stack>
                  </GridItem>

                  <GridItem>
                    <Stack spacing="6">
                      <Position />
                      <LockForm />

                      <Stack spacing="3">
                        <Text fontSize="lg">Contracts</Text>
                        <Card border="1px solid" borderColor="gray.80" p="5">
                          <Stack spacing="1">
                            {contracts?.VENEWO && (
                              <Flex align="center" justify="space-between">
                                <Text>veNEWO</Text>
                                <Link
                                  href={`${blockExplorer}/address/${contracts?.VENEWO}`}
                                  variant="whiteTransition"
                                  color="brand.green"
                                  isExternal
                                >
                                  {shortAddress(contracts?.VENEWO)}
                                </Link>
                              </Flex>
                            )}

                            {contracts?.VE_NEWO_SINGLE_SIDE_VAULT && (
                              <Flex align="center" justify="space-between">
                                <Text>NEWO rewards</Text>
                                <Link
                                  href={`${blockExplorer}/address/${contracts?.VE_NEWO_SINGLE_SIDE_VAULT}`}
                                  variant="whiteTransition"
                                  color="brand.green"
                                  isExternal
                                >
                                  {shortAddress(
                                    contracts?.VE_NEWO_SINGLE_SIDE_VAULT
                                  )}
                                </Link>
                              </Flex>
                            )}

                            {contracts?.VE_NEWO_USDC_LP_VAULT && (
                              <Flex align="center" justify="space-between">
                                <Text>NEWO/USDC LP vault</Text>
                                <Link
                                  href={`${blockExplorer}/address/${contracts?.VE_NEWO_USDC_LP_VAULT}`}
                                  variant="whiteTransition"
                                  color="brand.green"
                                  isExternal
                                >
                                  {shortAddress(
                                    contracts?.VE_NEWO_USDC_LP_VAULT
                                  )}
                                </Link>
                              </Flex>
                            )}

                            {contracts?.VE_NEWO_WAVAX_LP_VAULT && (
                              <Flex align="center" justify="space-between">
                                <Text>NEWO/WAVAX LP vault</Text>
                                <Link
                                  href={`${blockExplorer}/address/${contracts?.VE_NEWO_WAVAX_LP_VAULT}`}
                                  variant="whiteTransition"
                                  color="brand.green"
                                  isExternal
                                >
                                  {shortAddress(
                                    contracts?.VE_NEWO_WAVAX_LP_VAULT
                                  )}
                                </Link>
                              </Flex>
                            )}
                          </Stack>
                        </Card>
                      </Stack>
                    </Stack>
                  </GridItem>
                </Grid>
              </TabPanel>

              <TabPanel p={['4', '4', '8']}>
                <ConnectOverlay isConnected={!!accountData?.address}>
                  <Grid
                    templateColumns={['1fr', '1fr', '1fr', 'repeat(3,1fr)']}
                    gap="3"
                  >
                    <Card variant="simple">
                      <Stat>
                        <StatLabel fontSize="lg">Your locked NEWO</StatLabel>
                        <StatNumber color="brand.green" fontSize="2xl">
                          {assetBalance}
                        </StatNumber>
                      </Stat>
                    </Card>
                    <Card variant="simple">
                      <Stat>
                        <StatLabel fontSize="lg">Your veNEWO balance</StatLabel>
                        <StatNumber color="brand.green" fontSize="2xl">
                          {balance}
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
                          <LockedToken />
                        </Tbody>
                      </Table>
                    </Box>
                  </Stack>

                  <Stack my="6">
                    <Text fontSize="xl" color="brand.green">
                      Rewards Information
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
                            <Th>AVG APR</Th>
                            <Th>Boost</Th>
                            <Th>Rewards Earned</Th>
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <RegisteredReward
                            veVaultAddress={contracts.VE_NEWO_SINGLE_SIDE_VAULT}
                            tokenAddress={contracts.NEWO}
                          />

                          {contracts.VE_NEWO_USDC_LP_VAULT && (
                            <RegisteredReward
                              veVaultAddress={contracts.VE_NEWO_USDC_LP_VAULT}
                              tokenAddress={contracts.NEWO_USDC_LP}
                              token0={contracts.NEWO}
                              token1={contracts.USDC}
                            />
                          )}

                          {contracts.VE_NEWO_WAVAX_LP_VAULT && (
                            <RegisteredReward
                              veVaultAddress={contracts.VE_NEWO_WAVAX_LP_VAULT}
                              tokenAddress={contracts.NEWO_WAVAX_LP}
                              token0={contracts.NEWO}
                              token1={contracts.WAVAX}
                            />
                          )}
                        </Tbody>
                      </Table>
                    </Box>
                  </Stack>
                </ConnectOverlay>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Stack>
    </Layout>
  )
}

export default Page
