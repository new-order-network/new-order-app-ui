import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'

import useToken from 'hooks/useToken'

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
  newoBalance: string
  metamaskIsInstalled: boolean
  accountAddress: string
  updateState?: () => Promise<void>
}

export const NewoContext = createContext<NewoContextProps>({
  newoBalance: '0.0',
  metamaskIsInstalled: false,
  accountAddress: '',
})

export const NewoProvider: React.FC<NewoProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(newoReducer, initialNewoState)
  const { contracts } = useContractContext()
  const newoToken = useToken(contracts?.NEWO)
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { disconnect } = useDisconnect()

  const updateNewoBalance = async () => {
    if (address) {
      const newoBalance = await newoToken?.balanceOf(address)

      if (newoBalance) {
        dispatch({
          type: NewoChangeType.UPDATE_NEWO_BALANCE,
          payload: newoBalance,
        })
      }
    }
  }

  const disconnectWallet = async () => {
    dispatch({
      type: NewoChangeType.DISCONNECT_WALLET,
      payload: null,
    })
    dispatch({
      type: NewoChangeType.UPDATE_ACCOUNT_ADDRESS,
      payload: '',
    })
    disconnect()
  }

  const updateState = async () => {
    // Updates necessary balances or data that might change when tx is ran
    Promise.all([updateNewoBalance()])
  }

  useEffect(() => {
    if (address && newoToken.tokenInstance) {
      updateState()
    }

    // eslint-disable-next-line
  }, [address, contracts, chain?.id, newoToken.tokenInstance])

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
    <NewoContext.Provider value={{ ...state, disconnectWallet, updateState }}>
      {children}
    </NewoContext.Provider>
  )
}

export const useNewoContext = () => {
  return useContext(NewoContext)
}
