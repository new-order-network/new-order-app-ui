import { createContext, useContext, useEffect, useReducer } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { ethers } from 'ethers'

import useVeToken from 'hooks/useVeToken'

import { useContractContext } from 'store/contexts/contractContext'
import {
  initialVeNewoState,
  UPDATE_ALLOWANCE,
  UPDATE_ASSET_BALANCE,
  UPDATE_BALANCE,
  UPDATE_MULTIPLIER,
  UPDATE_TOTAL_ASSETS,
  UPDATE_TOTAL_BALANCE,
  UPDATE_TOTAL_LOCKED,
  UPDATE_TOTAL_SUPPLY,
  UPDATE_UNLOCK_DATE,
  veNewoReducer,
  VeNewoStateProps,
} from 'store/reducers/veNewoReducer'

import { SUPPORTED_NETWORKS } from 'constants/network'
import { contractAddresses } from 'constants/contractAddresses'

import veTokenAbi from 'contracts/abi/veToken.json'

interface VeNewoProviderProps {
  children: React.ReactNode
}

interface VeNewoContextStateProps extends VeNewoStateProps {
  updateState?: () => Promise<void>
}

export const VeNewoContext = createContext<VeNewoContextStateProps>({
  ...initialVeNewoState,
})

export const VeNewoProvider: React.FC<VeNewoProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(veNewoReducer, initialVeNewoState)
  const { data: accountData } = useAccount()
  const { contracts } = useContractContext()
  const { activeChain } = useNetwork()
  const veNewo = useVeToken(contracts?.VENEWO, contracts?.NEWO)

  const updateMetrics = async () => {
    // This function updates the totalLocked and totalBalance metrics
    // These metrics are from our supported networks combined

    const networks = SUPPORTED_NETWORKS.filter((network) => {
      return !network.testnet && network
    })

    let totalLocked = 0
    let totalBalance = 0

    networks.forEach(async (network) => {
      const provider = new ethers.providers.JsonRpcProvider(
        network.rpcUrls.default
      )
      const veNewoAddress = contractAddresses[network.id].VENEWO
      const veNewoInstance = new ethers.Contract(
        veNewoAddress,
        veTokenAbi,
        provider
      )
      const decimals = await veNewoInstance.decimals()

      // Get the totalAssets and add to totalLocked
      const totalAssets = await veNewoInstance.totalAssets()
      const formattedTotalAssets = ethers.utils.formatUnits(
        totalAssets,
        decimals
      )
      totalLocked += Number(formattedTotalAssets)
      dispatch({ type: UPDATE_TOTAL_LOCKED, payload: totalLocked.toFixed(4) })

      // Get the totalSupply and add to totalBalance
      const totalSupply = await veNewoInstance.totalSupply()
      const formattedTotalSupply = ethers.utils.formatUnits(
        totalSupply,
        decimals
      )
      totalBalance += Number(formattedTotalSupply)
      dispatch({ type: UPDATE_TOTAL_BALANCE, payload: totalBalance.toFixed(4) })
    })
  }

  const updateAllowance = async () => {
    if (accountData?.address) {
      const allowance = await veNewo.veTokenAllowance(accountData?.address)
      dispatch({ type: UPDATE_ALLOWANCE, payload: allowance })
    }
  }

  const updateUnlockDate = async () => {
    if (accountData?.address) {
      const unlockDate = await veNewo.unlockDate(accountData?.address)
      dispatch({ type: UPDATE_UNLOCK_DATE, payload: unlockDate })
    }
  }

  const updateTotalSupply = async () => {
    const totalSupply = await veNewo.totalSupply()
    dispatch({
      type: UPDATE_TOTAL_SUPPLY,
      payload: Number(totalSupply).toFixed(4),
    })
  }

  const updateTotalAssets = async () => {
    const totalAssets = await veNewo.totalAssets()
    dispatch({
      type: UPDATE_TOTAL_ASSETS,
      payload: Number(totalAssets).toFixed(4),
    })
  }

  const updateBalance = async () => {
    if (accountData?.address) {
      const balance = await veNewo.balanceOf(accountData?.address)
      dispatch({ type: UPDATE_BALANCE, payload: Number(balance).toFixed(4) })
    }
  }

  const updateAssetBalance = async () => {
    if (accountData?.address) {
      const assetBalance = await veNewo.assetBalanceOf(accountData?.address)
      dispatch({
        type: UPDATE_ASSET_BALANCE,
        payload: Number(assetBalance).toFixed(4),
      })
    }
  }

  const updateMultiplier = async () => {
    if (accountData?.address) {
      const balance = await veNewo.balanceOf(accountData?.address)
      const assetBalance = await veNewo.assetBalanceOf(accountData?.address)
      const multiplier = Number(balance) / Number(assetBalance)

      if (Number.isFinite(multiplier)) {
        dispatch({
          type: UPDATE_MULTIPLIER,
          payload: Number(multiplier).toFixed(2),
        })
      }
    }
  }

  const updateState = async () => {
    Promise.all([
      updateMetrics(),
      updateAllowance(),
      updateUnlockDate(),
      updateTotalSupply(),
      updateTotalAssets(),
      updateBalance(),
      updateAssetBalance(),
      updateMultiplier(),
    ])
  }

  useEffect(() => {
    updateState()
    // eslint-disable-next-line
  }, [accountData?.address, contracts, activeChain?.id, veNewo.veTokenInstance])

  return (
    <VeNewoContext.Provider
      value={{
        ...state,
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
