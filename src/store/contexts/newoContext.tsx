import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'

import useToken from 'hooks/useToken'

import {
  DISCONNECT_WALLET,
  initialNewoState,
  newoReducer,
  UPDATE_METAMASK_STATUS,
  UPDATE_NEWO_BALANCE,
} from 'store/reducers/newoReducer'
import { useContractContext } from 'store/contexts/contractContext'

interface NewoProviderProps {
  children: React.ReactNode
}

interface NewoContextProps {
  disconnectWallet?: () => void
  newoBalance: string
  metamaskIsInstalled: boolean
  updateState?: () => Promise<void>
}

export const NewoContext = createContext<NewoContextProps>({
  newoBalance: '0.0',
  metamaskIsInstalled: false,
})

export const NewoProvider: React.FC<NewoProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(newoReducer, initialNewoState)
  const { contracts } = useContractContext()
  const newoToken = useToken(contracts?.NEWO)
  const { address: accountAddress } = useAccount()
  const { chain } = useNetwork()
  const { disconnect } = useDisconnect()

  const updateNewoBalance = async () => {
    if (accountAddress) {
      const newoBalance = await newoToken?.balanceOf(accountAddress)

      if (newoBalance) {
        dispatch({
          type: UPDATE_NEWO_BALANCE,
          payload: newoBalance,
        })
      }
    }
  }

  const disconnectWallet = async () => {
    dispatch({
      type: DISCONNECT_WALLET,
      payload: null,
    })

    disconnect()
  }

  const updateState = async () => {
    // Updates necessary balances or data that might change when tx is ran
    Promise.all([updateNewoBalance()])
  }

  useEffect(() => {
    if (accountAddress && newoToken.tokenInstance) {
      updateState()
    }

    // eslint-disable-next-line
  }, [accountAddress, contracts, chain?.id, newoToken.tokenInstance])

  useEffect(() => {
    if (typeof window?.ethereum === 'undefined') {
      dispatch({
        type: UPDATE_METAMASK_STATUS,
        payload: false,
      })
    } else {
      dispatch({
        type: UPDATE_METAMASK_STATUS,
        payload: true,
      })
    }
  }, [])

  return (
    <NewoContext.Provider value={{ ...state, disconnectWallet, updateState }}>
      {children}
    </NewoContext.Provider>
  )
}

export const useNewoContext = () => {
  return useContext(NewoContext)
}
