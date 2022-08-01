import { BASE_API_URL } from 'constants/api'

export const getVeNewo = async () => {
  try {
    const supplies = await fetch(`${BASE_API_URL}/venewo`)

    return supplies
  } catch (error) {
    return null
  }
}

export const getLockedNewo = async () => {
  try {
    const supplies = await fetch(`${BASE_API_URL}/locked-newo`)

    return supplies
  } catch (error) {
    return null
  }
}
