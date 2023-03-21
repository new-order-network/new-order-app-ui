/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { useAccount, useContractRead, useContractReads } from 'wagmi'
import { BigNumber, ethers } from 'ethers'
import { mainnet, avalanche } from 'wagmi/chains'

import useVeToken from 'hooks/useVeToken'
import useVeRewardsController from 'hooks/useVeRewardsController'

import { useContractContext } from 'store/contexts/contractContext'
import {
  initialVeNewoState,
  UPDATE_TOTAL_BALANCE,
  UPDATE_TOTAL_LOCKED,
  veNewoReducer,
  VeNewoStateProps,
} from 'store/reducers/veNewoReducer'

import { contractAddresses } from 'constants/contractAddresses'

import veTokenAbi from 'contracts/abi/veToken.json'
import veVaultAbi from 'contracts/abi/xNewo.json'

interface VeNewoProviderProps {
  children: React.ReactNode
}

interface VeNewoContextStateProps extends VeNewoStateProps {
  totalLocked: string
  totalBalance: string
  totalSupply: string
  totalAssets: string
  totalRewardsEarned: string
  allowance: string
  unlockDate: number
  assetBalance: string
  balance?: string
  multiplier: number
  loading: boolean
  notifyAllDeposit?: () => Promise<void>
  getAllRewards?: () => Promise<void>
  exitAllRewards?: () => Promise<void>
  updateState?: () => Promise<void>
}

export const VeNewoContext = createContext<VeNewoContextStateProps>({
  ...initialVeNewoState,
  totalSupply: '',
  totalAssets: '',
  totalRewardsEarned: '',
  allowance: '',
  unlockDate: 0,
  assetBalance: '',
  balance: '',
  multiplier: 0,
  loading: false,
})

export const VeNewoProvider: React.FC<VeNewoProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(veNewoReducer, initialVeNewoState)
  const [totalRewardsEarned, setTotalRewardsEarned] = useState('0')
  const { contracts } = useContractContext()
  const veNewo = useVeToken(contracts?.VENEWO, contracts?.NEWO)
  const veNewoRewardsController = useVeRewardsController(
    contracts.VE_REWARDS_CONTROLLER
  )
  const { address: accountAddress } = useAccount()

  const {
    data: veNewoSingleSideVaultEarned,
    refetch: refetchVeNewoSingleSideVaultEarned,
  } = useContractRead({
    address: contracts.VE_NEWO_SINGLE_SIDE_VAULT,
    abi: veVaultAbi,
    functionName: 'earned',
    args: [accountAddress],
    enabled: !!contracts.VE_NEWO_SINGLE_SIDE_VAULT,
    select: (data) => {
      const formattedData = ethers.utils.formatUnits(
        data as BigNumber,
        veNewo.decimals as BigNumber
      )
      return formattedData
    },
  })

  const { data: veNewoUsdcVaultEarned, refetch: refetchVeNewoUsdcVaultEarned } =
    useContractRead({
      address: contracts.VE_NEWO_USDC_LP_VAULT,
      abi: veVaultAbi,
      functionName: 'earned',
      args: [accountAddress],
      enabled: !!contracts.VE_NEWO_USDC_LP_VAULT,
      select: (data) => {
        const formattedData = ethers.utils.formatUnits(
          data as BigNumber,
          veNewo.decimals as BigNumber
        )
        return formattedData
      },
    })

  const {
    data: veNewoWavaxVaultEarned,
    refetch: refetchVeNewoWavaxVaultEarned,
  } = useContractRead({
    address: contracts.VE_NEWO_WAVAX_LP_VAULT,
    abi: veVaultAbi,
    functionName: 'earned',
    args: [accountAddress],
    enabled: !!contracts.VE_NEWO_WAVAX_LP_VAULT,
    select: (data) => {
      const formattedData = ethers.utils.formatUnits(
        data as BigNumber,
        veNewo.decimals as BigNumber
      )
      return formattedData
    },
  })

  const { refetch: refetchMetrics } = useContractReads({
    contracts: [
      {
        address: contractAddresses[mainnet.id].VENEWO,
        abi: veTokenAbi,
        functionName: 'totalSupply',
        chainId: mainnet.id,
      },
      {
        address: contractAddresses[avalanche.id].VENEWO,
        abi: veTokenAbi,
        functionName: 'totalSupply',
        chainId: avalanche.id,
      },
      {
        address: contractAddresses[mainnet.id].VENEWO,
        abi: veTokenAbi,
        functionName: 'totalAssets',
        chainId: mainnet.id,
      },
      {
        address: contractAddresses[avalanche.id].VENEWO,
        abi: veTokenAbi,
        functionName: 'totalAssets',
        chainId: avalanche.id,
      },
    ],
    select: (data) => {
      const results: string[] = []
      for (let i = 0; i < data.length; i++) {
        if (!data[i]) {
          results[i] = '0'
        } else {
          results[i] = ethers.utils.formatUnits(
            data[i] as BigNumber,
            veNewo.decimals as BigNumber
          )
        }
      }
      return results
    },
    onSuccess: (data) => {
      // Add the two totalSupply
      const totalBalance = Number(data[0]) + Number(data[1])
      // Add the two totalAssets
      const totalLocked = Number(data[2]) + Number(data[3])
      dispatch({ type: UPDATE_TOTAL_LOCKED, payload: totalLocked.toFixed(4) })
      dispatch({ type: UPDATE_TOTAL_BALANCE, payload: totalBalance.toFixed(4) })
    },
    enabled: !!veNewo.decimals,
  })

  useEffect(() => {
    const totalEarned =
      Number(veNewoSingleSideVaultEarned) ||
      0 + Number(veNewoUsdcVaultEarned) ||
      0 + Number(veNewoWavaxVaultEarned) ||
      0
    setTotalRewardsEarned(totalEarned.toString())
  }, [
    veNewoSingleSideVaultEarned,
    veNewoUsdcVaultEarned,
    veNewoWavaxVaultEarned,
  ])

  const updateState = async () => {
    Promise.all([
      refetchMetrics(),
      veNewo.updateState(),
      refetchVeNewoSingleSideVaultEarned(),
      refetchVeNewoUsdcVaultEarned(),
      refetchVeNewoWavaxVaultEarned(),
    ])
  }

  return (
    <VeNewoContext.Provider
      value={{
        ...state,
        totalSupply: veNewo.totalSupply,
        totalAssets: veNewo.totalAssets,
        totalRewardsEarned,
        allowance: veNewo.allowance,
        unlockDate: veNewo.unlockDate!,
        assetBalance: veNewo.assetBalance,
        balance: veNewo.balance,
        multiplier: veNewo.multiplier!,
        loading: veNewoRewardsController.loading,
        notifyAllDeposit: veNewoRewardsController.notifyAllDeposit,
        getAllRewards: veNewoRewardsController.getAllRewards,
        exitAllRewards: veNewoRewardsController.exitAllRewards,
        updateState,
      }}
    >
      {children}
    </VeNewoContext.Provider>
  )
}

export const useVeNewoContext = () => {
  return useContext(VeNewoContext)
}
