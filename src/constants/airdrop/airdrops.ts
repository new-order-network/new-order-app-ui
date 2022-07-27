import ethereumMainnetMerkleRoot from 'constants/airdrop/ethereumMainnetMerkleRoot.json'
import ethereumRinkebyMerkleRoot from 'constants/airdrop/ethereumRinkebyMerkleRoot.json'
import { contractAddresses } from 'constants/contractAddresses'

export interface AirdropProps {
  distributorAddress?: string
  tokenAddress?: string
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
  4: [
    {
      distributorAddress: contractAddresses[4].AIRDROP,
      tokenAddress: contractAddresses[4].NEWO,
      merkleRoot: ethereumRinkebyMerkleRoot,
    },
  ],
  43114: [],
  43113: [],
}
