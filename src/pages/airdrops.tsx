import { Flex, Grid, GridItem, Image, Text } from '@chakra-ui/react'
import { useAccount } from 'wagmi'

import Airdrop from 'components/Airdrop/Airdrop'

import { useContractContext } from 'store/contexts/contractContext'

import { AirdropProps } from 'constants/airdrop/airdrops'

import Layout from 'layout'

const Airdrops = () => {
  const accountData = useAccount()
  const { airdrops } = useContractContext()

  const noAirdropContent = () => {
    return (
      <GridItem>
        <Text fontSize="lg">
          We are sorry, but it looks like there are no Airdrops available to you
          :(
        </Text>
        <Image
          m={['40px auto 0', '40px auto 0', '24']}
          src="/images/backgrounds/NoAirDrops.svg"
          alt="No Airdrops Available"
        />
      </GridItem>
    )
  }

  const walletNotConnected = () => {
    return (
      <GridItem>
        <Text fontSize="lg">Please connect wallet to claim your aidrops.</Text>
        <Image
          src="/images/backgrounds/NoMetamaskConnected.svg"
          alt="No Airdrops Available"
        />
      </GridItem>
    )
  }

  return (
    <Layout
      bgPosition="bottom right"
      bgRepeat="no-repeat"
      bgImage="url('/images/backgrounds/dotted-background.svg')"
    >
      <Flex
        flexDirection="column"
        flexWrap="wrap"
        gap="4"
        p={['28px 24px', '28px 40px', '28px 40px']}
        h="full"
      >
        <Text fontSize="1.5rem" fontWeight="extrabold">
          Airdrops
        </Text>
        <Grid templateColumns={['1fr', '1fr', '1fr', '2fr 1fr', '1fr 1fr']}>
          {!accountData?.address
            ? walletNotConnected()
            : airdrops && airdrops.length > 0
            ? airdrops.map((airdrop: AirdropProps) => {
                return (
                  <Airdrop
                    key={airdrop.distributorAddress}
                    distributorAddress={airdrop?.distributorAddress}
                    tokenAddress={airdrop?.tokenAddress}
                    merkleRoot={airdrop?.merkleRoot}
                  />
                )
              })
            : noAirdropContent()}
        </Grid>
      </Flex>
    </Layout>
  )
}
export default Airdrops
