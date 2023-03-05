export const shortAddress = (address: string | undefined | null) => {
  if (!address) {
    return address
  }

  if (address.length > 35) {
    return `${address.slice(0, 6)}...${address.slice(
      address.length - 4,
      address.length
    )}`
  }

  return address
}

export const numberFormatter = (n?: string, decimals?: number) => {
  if (!n) {
    return ''
  }

  const num = parseFloat(n)

  const notations = [
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' },
    { value: 1, symbol: '' },
  ]
  const item = notations.find((notation) => {
    return num >= notation.value
  })

  return item
    ? `${(num / item.value).toFixed(decimals)}${item.symbol}`
    : isNaN(num)
    ? (0).toFixed(decimals)
    : num.toFixed(decimals)
}
