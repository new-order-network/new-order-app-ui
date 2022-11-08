import { contractAddresses } from 'constants/contractAddresses'

export interface VaultProps {
  label: string
  vaultAddress?: string
  tokenAddress?: string
  token0?: string
  token1?: string
  isActive?: boolean
  isLegacyVault?: boolean //for disabling APR, Deposit and Input button, Withdraw Buton and Claims Button for Legacy Vaults (Single-Side and LP Vaults)
  isLegacyLPVault?: boolean //for disabling APR, Deposit and Input button, Rewards Column to 0, Claims, Withdraw and Claims buttons for Legacy LP Vaults
}

export interface VaultsProps {
  [key: number]: VaultProps[]
}

export const Vaults: VaultsProps = {
  1: [
    {
      label: 'Legacy NEWO Single-Side',
      vaultAddress: contractAddresses[1].NEWO_SINGLE_SIDE_VAULT,
      tokenAddress: contractAddresses[1].NEWO,
      isActive: false,
      isLegacyVault: true,
    },
    {
      label: 'Legacy Sushi LP - NEWO/USDC',
      vaultAddress: contractAddresses[1].NEWO_USDC_LP_VAULT,
      tokenAddress: contractAddresses[1].NEWO_USDC_LP,
      token0: contractAddresses[1].NEWO,
      token1: contractAddresses[1].USDC,
      isActive: false,
      isLegacyVault: true,
      isLegacyLPVault: true,
    },
    {
      label: 've LP Vault',
      vaultAddress: contractAddresses[1].VE_NEWO_USDC_LP_VAULT,
      tokenAddress: contractAddresses[1].NEWO_USDC_LP,
      token0: contractAddresses[1].NEWO,
      token1: contractAddresses[1].USDC,
      isActive: true,
    },
  ],
  5: [
    {
      label: 've LP Vault',
      vaultAddress: contractAddresses[5].VE_NEWO_USDC_LP_VAULT,
      tokenAddress: contractAddresses[5].NEWO_USDC_LP,
      token0: contractAddresses[5].NEWO,
      token1: contractAddresses[5].USDC,
      isActive: true,
    },
  ],
  43114: [
    {
      label: 'Legacy NEWO Single-Side',
      vaultAddress: contractAddresses[43114].NEWO_SINGLE_SIDE_VAULT,
      tokenAddress: contractAddresses[43114].NEWO,
      isActive: false,
      isLegacyVault: true,
    },
    {
      label: 'Legacy Trader Joe LP - NEWO/WAVAX',
      vaultAddress: contractAddresses[43114].NEWO_WAVAX_LP_VAULT,
      tokenAddress: contractAddresses[43114].NEWO_WAVAX_LP,
      token0: contractAddresses[43114].NEWO,
      token1: contractAddresses[43114].WAVAX,
      isActive: false,
      isLegacyVault: true,
      isLegacyLPVault: true,
    },
    {
      label: 've LP Vault',
      vaultAddress: contractAddresses[43114].VE_NEWO_WAVAX_LP_VAULT,
      tokenAddress: contractAddresses[43114].NEWO_WAVAX_LP,
      token0: contractAddresses[43114].NEWO,
      token1: contractAddresses[43114].WAVAX,
      isActive: true,
    },
  ],
  43113: [],
}
