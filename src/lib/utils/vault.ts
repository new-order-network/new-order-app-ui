import { Contract, ethers } from 'ethers'
import { erc20ABI } from 'wagmi'
import { Chain, Provider } from '@wagmi/core'

import { UseTokenResponse } from 'hooks/useToken'

import { getTokenPriceByAddress } from 'lib/utils/tokens'

export const getTvl = async (
  token: UseTokenResponse,
  vaultInstance: Contract,
  provider: Provider,
  chain?: Chain,
  tokenAddress?: string | `0x${string}`,
  token0?: string | `0x${string}`,
  token1?: string | `0x${string}`
) => {
  let computedTvl = 0

  if (token0 && token1) {
    const token0Instance = new ethers.Contract(token0, erc20ABI, provider)
    const token1Instance = new ethers.Contract(token1, erc20ABI, provider)

    // Get the usd price of token0 and token1 and rewards token
    const token0Price = await getTokenPriceByAddress(token0, chain?.name)
    const token1Price = await getTokenPriceByAddress(token1, chain?.name)

    // Get the balance of the LP contract on token0
    const lpTokenBalance0 = await token0Instance?.balanceOf(tokenAddress)
    const lpTokenBalanceDecimals0 = await token0Instance?.decimals()
    const convertedLpTokenBalance0 = ethers.utils.formatUnits(
      lpTokenBalance0,
      lpTokenBalanceDecimals0
    )

    // Get the balance of the LP contract on token1
    const lpTokenBalance1 = await token1Instance?.balanceOf(tokenAddress)
    const lpTokenBalanceDecimals1 = await token1Instance?.decimals()
    const convertedLpTokenBalance1 = ethers.utils.formatUnits(
      lpTokenBalance1,
      lpTokenBalanceDecimals1
    )

    // Get the total supply of the vault
    const vaultTotalSupply = await vaultInstance?.totalSupply()
    const convertedVaultTotalSupply = ethers.utils.formatUnits(
      vaultTotalSupply,
      'ether'
    )

    // Get the total supply of the lp token
    const tokenTotalSupply = token.totalSupply

    computedTvl =
      ((Number(convertedLpTokenBalance0) * token0Price +
        Number(convertedLpTokenBalance1) * token1Price) *
        Number(convertedVaultTotalSupply)) /
      Number(tokenTotalSupply)
  } else {
    const vaultTotalSupply = await vaultInstance?.totalSupply()
    const vaultDecimals = token?.decimals
    const convertedVaultTotalSupply = ethers.utils.formatUnits(
      vaultTotalSupply,
      vaultDecimals
    )

    computedTvl = Number(convertedVaultTotalSupply) * 0
  }

  return Number(computedTvl)
}
