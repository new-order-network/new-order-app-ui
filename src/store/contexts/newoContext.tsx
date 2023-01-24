import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { useAccount, useBalance, useDisconnect } from 'wagmi'

import {
  initialNewoState,
  NewoChangeType,
  newoReducer,
} from 'store/reducers/newoReducer'
import { useContractContext } from 'store/contexts/contractContext'

interface NewoProviderProps {
  children: React.ReactNode
}

interface NewoContextProps {
  disconnectWallet?: () => void
  newoBalance?: string
  newoBalanceIsLoading: boolean
  metamaskIsInstalled: boolean
  accountAddress: string
  updateState?: () => Promise<void>
}

export const NewoContext = createContext<NewoContextProps>({
  newoBalance: '0.0',
  newoBalanceIsLoading: false,
  metamaskIsInstalled: false,
  accountAddress: '',
})

export const NewoProvider: React.FC<NewoProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(newoReducer, initialNewoState)
  const { contracts } = useContractContext()
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const {
    data: newoBalance,
    refetch: refetchNewoBalance,
    isLoading: newoBalanceIsLoading,
  } = useBalance({
    address,
    token: contracts.NEWO,
  })

  useEffect(() => {
    updateState()
    // eslint-disable-next-line
  }, [contracts])

  const disconnectWallet = async () => {
    dispatch({
      type: NewoChangeType.UPDATE_ACCOUNT_ADDRESS,
      payload: '',
    })
    disconnect()
  }

  const updateState = async () => {
    // Updates necessary balances or data that might change when tx is ran
    Promise.all([refetchNewoBalance()])
  }

  useEffect(() => {
    if (address) {
      dispatch({
        type: NewoChangeType.UPDATE_ACCOUNT_ADDRESS,
        payload: address,
      })
    } else {
      dispatch({
        type: NewoChangeType.UPDATE_ACCOUNT_ADDRESS,
        payload: '',
      })
    }
  }, [address])

  useEffect(() => {
    if (typeof window?.ethereum === 'undefined') {
      dispatch({
        type: NewoChangeType.UPDATE_METAMASK_STATUS,
        payload: false,
      })
    } else {
      dispatch({
        type: NewoChangeType.UPDATE_METAMASK_STATUS,
        payload: true,
      })
    }
  }, [])

  return (
    <NewoContext.Provider
      value={{
        ...state,
        newoBalance: newoBalance?.formatted,
        newoBalanceIsLoading,
        disconnectWallet,
        updateState,
      }}
    >
      {children}
    </NewoContext.Provider>
  )
}

export const useNewoContext = () => {
  return useContext(NewoContext)
}
