import ethereumMainnetMerkleRoot from 'constants/airdrop/ethereumMainnetMerkleRoot.json'
import { contractAddresses } from 'constants/contractAddresses'

export interface AirdropProps {
  distributorAddress?: `0x${string}`
  tokenAddress?: `0x${string}`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  merkleRoot: any
}

export interface AirdropsProps {
  [key: number]: AirdropProps[]
}

export const Airdrops: AirdropsProps = {
  1: [
    {
      distributorAddress: contractAddresses[1].AIRDROP,
      tokenAddress: contractAddresses[1].NEWO,
      merkleRoot: ethereumMainnetMerkleRoot,
    },
  ],
  5: [],
  43114: [],
  43113: [],
}
