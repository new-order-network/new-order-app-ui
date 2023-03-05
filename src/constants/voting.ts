import { contractAddresses } from 'constants/contractAddresses'

// NOTE: Update this whenever snapshot strategies are updated
export const snapshotStrategies = [
  {
    __typename: 'Strategy',
    name: 'contract-call',
    network: '1',
    params: {
      symbol: 'sNEWO',
      address: contractAddresses[1].GOVERNANCE_VAULT,
      decimals: 18,
      methodABI: {
        name: 'votingPower',
        type: 'function',
        inputs: [
          {
            name: 'who',
            type: 'address',
            internalType: 'address',
          },
        ],
        outputs: [
          {
            name: '',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
    },
  },
  {
    __typename: 'Strategy',
    name: 'contract-call',
    network: '1',
    params: {
      symbol: 'veNEWO',
      address: contractAddresses[1].VENEWO,
      decimals: 18,
      methodABI: {
        name: 'balanceOf',
        type: 'function',
        inputs: [
          {
            name: 'account',
            type: 'address',
            internalType: 'address',
          },
        ],
        outputs: [
          {
            name: '',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
    },
  },
  {
    __typename: 'Strategy',
    name: 'contract-call',
    network: '43114',
    params: {
      symbol: 'veNEWOa',
      address: contractAddresses[43114].VENEWO,
      decimals: 18,
      methodABI: {
        name: 'balanceOf',
        type: 'function',
        inputs: [
          {
            name: 'account',
            type: 'address',
            internalType: 'address',
          },
        ],
        outputs: [
          {
            name: '',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
    },
  },
]
