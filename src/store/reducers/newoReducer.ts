export enum NewoChangeType {
  UPDATE_METAMASK_STATUS = 'UPDATE_METAMASK_STATUS',
  UPDATE_ACCOUNT_ADDRESS = 'UPDATE_ACCOUNT_ADDRESS',
}

interface NewoStateProps {
  metamaskIsInstalled: boolean
  accountAddress: string
}
interface NewoTypeProps {
  type: 'UPDATE_METAMASK_STATUS' | 'UPDATE_ACCOUNT_ADDRESS'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any
}

export const initialNewoState = {
  metamaskIsInstalled: false,
  accountAddress: '',
}

export const newoReducer = (
  state: NewoStateProps,
  { type, payload }: NewoTypeProps
) => {
  switch (type) {
    case NewoChangeType.UPDATE_METAMASK_STATUS:
      return {
        ...state,
        metamaskIsInstalled: payload,
      }
    case NewoChangeType.UPDATE_ACCOUNT_ADDRESS:
      return {
        ...state,
        accountAddress: payload,
      }
    default:
      return state
  }
}
