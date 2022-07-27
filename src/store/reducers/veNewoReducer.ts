export const UPDATE_TOTAL_LOCKED = 'UPDATE_TOTAL_LOCKED'
export const UPDATE_TOTAL_BALANCE = 'UPDATE_TOTAL_BALANCE'
export const UPDATE_ALLOWANCE = 'UPDATE_ALLOWANCE'
export const UPDATE_UNLOCK_DATE = 'UPDATE_UNLOCK_DATE'
export const UPDATE_TOTAL_SUPPLY = 'UPDATE_TOTAL_SUPPLY'
export const UPDATE_TOTAL_ASSETS = 'UPDATE_TOTAL_ASSETS'
export const UPDATE_ASSET_BALANCE = 'UPDATE_ASSET_BALANCE'
export const UPDATE_BALANCE = 'UPDATE_BALANCE'
export const UPDATE_MULTIPLIER = 'UPDATE_MULTIPLIER'

export interface VeNewoStateProps {
  totalLocked: string
  totalBalance: string
  totalSupply: string
  totalAssets: string
  allowance: string
  unlockDate: number
  assetBalance: string
  balance: string
  multiplier: string
}

interface VeNewoTypeProps {
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any
}

export const initialVeNewoState = {
  totalLocked: '',
  totalBalance: '',
  totalSupply: '',
  totalAssets: '',
  allowance: '',
  unlockDate: 0,
  assetBalance: '',
  balance: '',
  multiplier: '0.00',
}

export const veNewoReducer = (
  state: VeNewoStateProps,
  { type, payload }: VeNewoTypeProps
) => {
  switch (type) {
    case UPDATE_TOTAL_LOCKED:
      return {
        ...state,
        totalLocked: payload,
      }
    case UPDATE_TOTAL_BALANCE:
      return {
        ...state,
        totalBalance: payload,
      }
    case UPDATE_ALLOWANCE:
      return {
        ...state,
        allowance: payload,
      }
    case UPDATE_UNLOCK_DATE:
      return {
        ...state,
        unlockDate: payload,
      }
    case UPDATE_TOTAL_SUPPLY:
      return {
        ...state,
        totalSupply: payload,
      }
    case UPDATE_TOTAL_ASSETS:
      return {
        ...state,
        totalAssets: payload,
      }
    case UPDATE_BALANCE:
      return {
        ...state,
        balance: payload,
      }
    case UPDATE_ASSET_BALANCE:
      return {
        ...state,
        assetBalance: payload,
      }
    case UPDATE_MULTIPLIER:
      return {
        ...state,
        multiplier: payload,
      }
    default:
      return state
  }
}
