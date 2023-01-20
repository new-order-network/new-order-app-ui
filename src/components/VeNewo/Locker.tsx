import {
  Flex,
  Grid,
  GridItem,
  Heading,
  Link,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useNetwork } from 'wagmi'

import Card from 'components/Card'
import LockForm from 'components/VeNewo/LockForm'
import Position from 'components/VeNewo/Position'
import Supply from 'components/VeNewo/Supply'
import Transaction from 'components/VeNewo/Transaction'

import { numberFormatter, shortAddress } from 'lib/utils/format'

import { useContractContext } from 'store/contexts/contractContext'
import { useVeNewoContext } from 'store/contexts/veNewoContext'

import { DEFAULT_NETWORK } from 'constants/network'

const Locker = () => {
  const { chain } = useNetwork()
  const { contracts } = useContractContext()
  const { totalLocked, totalBalance } = useVeNewoContext()

  const [blockExplorer, setBlockExplorer] = useState(
    DEFAULT_NETWORK.blockExplorers?.default.url
  )

  useEffect(() => {
    let blockExplorerUrl = DEFAULT_NETWORK.blockExplorers?.default.url
    if (chain) {
      blockExplorerUrl = chain?.blockExplorers?.default?.url
    }

    setBlockExplorer(blockExplorerUrl)
  }, [chain])

  return (
    <Grid
      templateColumns={['1fr', '1fr', '1fr', '1fr', '1fr', '4fr 3fr']}
      gap="6"
    >
      <GridItem>
        <Stack spacing="4">
          <Stack>
            <Heading size="lg" color="brand.green">
              NEWO Locker
            </Heading>
            <Text>
              Lock NEWO for ranging periods to receive protocol perks such as:
              Governance power, Protocol emissions, Treasury rewards, Airdrops
              and Whitelists. Note that veNEWO will not be a transferable token
              and it will not trade on liquid markets. Click{' '}
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
                      {shortAddress(contracts?.VE_NEWO_SINGLE_SIDE_VAULT)}
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
                      {shortAddress(contracts?.VE_NEWO_USDC_LP_VAULT)}
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
                      {shortAddress(contracts?.VE_NEWO_WAVAX_LP_VAULT)}
                    </Link>
                  </Flex>
                )}
              </Stack>
            </Card>
          </Stack>
        </Stack>
      </GridItem>
    </Grid>
  )
}

export default Locker
