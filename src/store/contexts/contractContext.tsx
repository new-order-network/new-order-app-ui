import { createContext, useContext, useEffect, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { useDisclosure, useToast } from '@chakra-ui/react'

import { isChainSupported } from 'lib/utils/web3'

import {
  contractAddresses,
  ContractAddressesProps,
  ContractAddressProps,
} from 'constants/contractAddresses'
import { VaultProps, Vaults, VaultsProps } from 'constants/vaults'
import { DEFAULT_NETWORK } from 'constants/network'
import {
  AirdropProps,
  Airdrops,
  AirdropsProps,
} from 'constants/airdrop/airdrops'

interface ContractProviderProps {
  children: React.ReactNode
}

interface ContractContextProps {
  airdrops: AirdropProps[]
  vaults: VaultProps[]
  contracts: ContractAddressProps
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
  hasNetworkError: boolean
}

const DEFAULT_ACTIVE_NETWORK: keyof ContractAddressesProps = DEFAULT_NETWORK.id
const DEFAULT_ACTIVE_VAULT_NETWORK: keyof VaultsProps = DEFAULT_NETWORK.id
const DEFAULT_ACTIVE_AIRDROP_NETWORK: keyof AirdropsProps = DEFAULT_NETWORK.id

export const initialContractState = {
  contracts: contractAddresses[DEFAULT_ACTIVE_NETWORK],
  vaults: Vaults[DEFAULT_ACTIVE_VAULT_NETWORK],
  airdrops: Airdrops[DEFAULT_ACTIVE_AIRDROP_NETWORK],
  isOpen: false,
  onClose: () => {
    return
  },
  onOpen: () => {
    return
  },
  hasNetworkError: false,
}

export const ContractContext = createContext<ContractContextProps>({
  ...initialContractState,
})

export const ContractProvider: React.FC<ContractProviderProps> = ({
  children,
}) => {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { activeChain } = useNetwork()

  const { data: accountData } = useAccount()

  const [contracts, setContracts] = useState(
    contractAddresses[DEFAULT_ACTIVE_NETWORK]
  )
  const [vaults, setVaults] = useState(Vaults[DEFAULT_ACTIVE_VAULT_NETWORK])
  const [airdrops, setAirdrops] = useState(
    Airdrops[DEFAULT_ACTIVE_AIRDROP_NETWORK]
  )
  const [hasNetworkError, setHasNetworkError] = useState(false)

  useEffect(() => {
    if (activeChain?.id) {
      setContracts(contractAddresses[activeChain.id])
      setVaults(Vaults[activeChain.id])
      setAirdrops(Airdrops[activeChain.id])
    }
  }, [activeChain, accountData])

  useEffect(() => {
    const isSupportedChain =
      activeChain?.id && isChainSupported(activeChain?.id)

    if (activeChain && !isSupportedChain) {
      setHasNetworkError(true)
      onOpen()
      toast({
        title: 'Unsupported network',
        description:
          'Please change to the Ethereum mainnet to use the NEW ORDER dApp',
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      })
    } else {
      setHasNetworkError(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChain])

  return (
    <ContractContext.Provider
      value={{
        contracts,
        vaults,
        airdrops,
        onClose,
        onOpen,
        isOpen,
        hasNetworkError,
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}

export const useContractContext = () => {
  return useContext(ContractContext)
}
