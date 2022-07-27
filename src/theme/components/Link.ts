const Link = {
  baseStyle: {
    transition: 'color 0.3s ease',
    textDecoration: 'none',
    boxShadow: 'none',
    _hover: {
      textDecoration: 'none',
      boxShadow: 'none',
    },
    _focus: {
      textDecoration: 'none',
      boxShadow: 'none',
    },
  },
  sizes: {},
  variants: {
    whiteTransition: {
      _hover: {
        color: 'white',
      },
    },
    orangeTransition: {
      _hover: {
        color: 'brand.orange',
      },
    },
  },
  defaultProps: {},
}

export default Link
