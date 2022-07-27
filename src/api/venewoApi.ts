import { BASE_API_URL } from 'constants/api'

interface NetworkProps {
  network: string
}

export const getVeNewo = async ({ network }: NetworkProps) => {
  try {
    const supplies = await fetch(`${BASE_API_URL}/venewo/?NETWORK=${network}`)

    return supplies
  } catch (error) {
    return null
  }
}

export const getLockedNewo = async ({ network }: NetworkProps) => {
  try {
    const supplies = await fetch(
      `${BASE_API_URL}/locked-newo/?NETWORK=${network}`
    )

    return supplies
  } catch (error) {
    return null
  }
}
