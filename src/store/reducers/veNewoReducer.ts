export const UPDATE_TOTAL_LOCKED = 'UPDATE_TOTAL_LOCKED'
export const UPDATE_TOTAL_BALANCE = 'UPDATE_TOTAL_BALANCE'

export interface VeNewoStateProps {
  totalLocked: string
  totalBalance: string
}

interface VeNewoTypeProps {
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any
}

export const initialVeNewoState = {
  totalLocked: '',
  totalBalance: '',
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
    default:
      return state
  }
}
