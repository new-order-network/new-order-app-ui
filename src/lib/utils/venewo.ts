import { ethers } from 'ethers'

import { contractAddresses } from 'constants/contractAddresses'
import { SUPPORTED_NETWORKS } from 'constants/network'

import veTokenAbi from 'contracts/abi/veToken.json'

export const getTotalLockedNewo = async () => {
  // Fetches the locked newo from our supported networks
  // Returns the combined value
  const networks = SUPPORTED_NETWORKS.filter((network) => {
    return !network.testnet && network
  })

  let totalLocked = 0

  for (let index = 0; index < networks.length; index++) {
    const provider = new ethers.providers.JsonRpcProvider(
      networks[index].rpcUrls.default
    )
    const veNewoAddress = contractAddresses[networks[index].id].VENEWO
    const veNewoInstance = new ethers.Contract(
      veNewoAddress,
      veTokenAbi,
      provider
    )
    const decimals = await veNewoInstance.decimals()

    // Get the totalAssets and add to totalLocked
    const totalAssets = await veNewoInstance.totalAssets()
    const formattedTotalAssets = ethers.utils.formatUnits(totalAssets, decimals)
    totalLocked += Number(formattedTotalAssets)
  }

  return totalLocked
}
