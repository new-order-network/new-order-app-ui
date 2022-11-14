import {
  Box,
  Grid,
  GridItem,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import { Table, Tbody, Th, Thead, Tr } from 'components/Table'
import Vault from 'components/Vault/Vault'
import VeVault from 'components/Vault/VeVault'
import ActiveDeposit from 'components/Vault/ActiveDeposit'
import VeActiveDeposit from 'components/Vault/VeActiveDeposit'

import { useContractContext } from 'store/contexts/contractContext'

import { VaultProps } from 'constants/vaults'

import Layout from 'layout'

const Invest = () => {
  const { vaults: vaultsData } = useContractContext()

  const [vaults, setVaults] = useState<VaultProps[]>()

  useEffect(() => {
    if (vaultsData) {
      setVaults(vaultsData)
    }
  }, [vaultsData])

  return (
    <Layout
      bgPosition="bottom right"
      bgRepeat="no-repeat"
      bgImage="url('/images/backgrounds/dotted-background.svg')"
    >
      <Stack spacing="4">
        <Box position="relative">
          <Text p="32px 0 0 32px" fontSize="1.5rem" fontWeight="extrabold">
            Vault Assets
          </Text>
          <Tabs w="full" variant="pinkTab">
            <TabList p="20px 40px 0">
              <Tab fontSize={['1rem', '1.2rem']}>Deposit</Tab>
              <Tab fontSize={['1rem', '1.2rem']}>Active Deposits</Tab>
            </TabList>

            <TabPanels p="28px 24px">
              <TabPanel p="0">
                <Grid
                  templateColumns={[
                    '1fr',
                    '1fr',
                    '1fr 1fr',
                    '1fr 1fr',
                    'repeat(3, 1fr)',
                    'repeat(4, 1fr)',
                    'repeat(4, 1fr)',
                    'repeat(5, 1fr)',
                  ]}
                  gap={6}
                >
                  {vaults &&
                    vaults
                      ?.filter((vault: VaultProps) => {
                        return vault.isActive === true
                      })
                      ?.map((vault) => {
                        const isVeVault = vault.label
                          .toLowerCase()
                          .includes('ve')

                        if (isVeVault) {
                          return (
                            <GridItem key={vault.vaultAddress}>
                              <VeVault
                                label={vault.label}
                                vaultAddress={vault.vaultAddress}
                                tokenAddress={vault.tokenAddress}
                                token0={vault.token0}
                                token1={vault.token1}
                                isLegacyVault={vault.isLegacyVault}
                              />
                            </GridItem>
                          )
                        }

                        return (
                          <GridItem key={vault.vaultAddress}>
                            <Vault
                              label={vault.label}
                              vaultAddress={vault.vaultAddress}
                              tokenAddress={vault.tokenAddress}
                              token0={vault.token0}
                              token1={vault.token1}
                              isLegacyVault={vault.isLegacyVault}
                            />
                          </GridItem>
                        )
                      })}
                </Grid>
              </TabPanel>
              <TabPanel>
                <Table variant="grayStriped" size="md">
                  <Thead>
                    <Tr>
                      <Th>Assets</Th>
                      <Th>Deposits</Th>
                      <Th>Rewards (NEWO)</Th>
                      <Th>APR</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {vaults &&
                      vaults?.map((vault) => {
                        const isVeVault = vault.label
                          .toLowerCase()
                          .includes('ve')

                        if (isVeVault) {
                          return (
                            <VeActiveDeposit
                              key={vault.vaultAddress}
                              label={vault.label}
                              vaultAddress={vault.vaultAddress}
                              tokenAddress={vault.tokenAddress}
                              token0={vault.token0}
                              token1={vault.token1}
                              isLegacyVault={vault.isLegacyVault}
                              isLegacyLPVault={vault.isLegacyLPVault}
                            />
                          )
                        }
                        return (
                          <ActiveDeposit
                            key={vault.vaultAddress}
                            label={vault.label}
                            vaultAddress={vault.vaultAddress}
                            tokenAddress={vault.tokenAddress}
                            token0={vault.token0}
                            token1={vault.token1}
                            isLegacyVault={vault.isLegacyVault}
                            isLegacyLPVault={vault.isLegacyLPVault}
                          />
                        )
                      })}
                  </Tbody>
                </Table>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Stack>
    </Layout>
  )
}

export default Invest
