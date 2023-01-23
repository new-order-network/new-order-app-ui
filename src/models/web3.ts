import { BigNumber } from 'ethers'

export interface BalanceData {
  decimals: number
  formatted: string
  symbol: string
  value: BigNumber
}
