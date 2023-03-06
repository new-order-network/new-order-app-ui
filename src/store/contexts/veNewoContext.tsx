/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createContext, useContext, useReducer } from 'react'
import { useContractReads } from 'wagmi'
import { BigNumber, ethers } from 'ethers'
import { mainnet, avalanche } from 'wagmi/chains'

import useVeToken from 'hooks/useVeToken'

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

interface VeNewoProviderProps {
  children: React.ReactNode
}

interface VeNewoContextStateProps extends VeNewoStateProps {
  totalLocked: string
  totalBalance: string
  totalSupply: string
  totalAssets: string
  allowance: string
  unlockDate: number
  assetBalance: string
  balance?: string
  multiplier: number
  updateState?: () => Promise<void>
}

export const VeNewoContext = createContext<VeNewoContextStateProps>({
  ...initialVeNewoState,
  totalSupply: '',
  totalAssets: '',
  allowance: '',
  unlockDate: 0,
  assetBalance: '',
  balance: '',
  multiplier: 0,
})

export const VeNewoProvider: React.FC<VeNewoProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(veNewoReducer, initialVeNewoState)
  const { contracts } = useContractContext()
  const veNewo = useVeToken(contracts?.VENEWO, contracts?.NEWO)

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

  const updateState = async () => {
    Promise.all([refetchMetrics(), veNewo.updateState()])
  }

  return (
    <VeNewoContext.Provider
      value={{
        ...state,
        totalSupply: veNewo.totalSupply,
        totalAssets: veNewo.totalAssets,
        allowance: veNewo.allowance,
        unlockDate: veNewo.unlockDate!,
        assetBalance: veNewo.assetBalance,
        balance: veNewo.balance,
        multiplier: veNewo.multiplier!,
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
