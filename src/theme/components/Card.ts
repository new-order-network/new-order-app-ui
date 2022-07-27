const Card = {
  // The styles all Cards have in common
  baseStyle: {
    shadow: 'md',
    borderRadius: 'xl',
    backgroundColor: 'gray.90',
    transition: 'all 0.3s ease',
  },
  // Two variants: rounded and smooth
  variants: {
    simple: {
      p: '5',
      cursor: 'pointer',
      _hover: {
        bg: 'gray.85',
      },
    },
  },
  // The default variant value
  defaultProps: {
    variant: 'smooth',
  },
}
export default Card
