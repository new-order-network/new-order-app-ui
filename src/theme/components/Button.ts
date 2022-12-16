const Button = {
  baseStyle: {
    transition: '0.3s ease all',
    _focus: {
      textDecoration: 'none',
      boxShadow: 'none',
    },
  },
  sizes: {},
  variants: {
    outlineGreenBox: {
      border: '1px solid #36ff7a',
      borderRadius: 0,
      color: 'green.100',
      _hover: {
        color: 'black',
        bgColor: 'green.100',
      },
    },
    outlineGrayRounded: {
      border: '1px solid #4d4d4d',
      borderRadius: 'full',
      color: 'white',
      _hover: {
        color: 'white',
        bgColor: 'gray.85',
      },
    },
    outlineGreenRounded: {
      border: '1px solid #4d4d4d',
      borderColor: 'green.100',
      borderRadius: 'full',
      color: 'white',
      height: '9',
      _hover: {
        color: 'white',
        bgColor: 'green.75',
      },
    },

    walletButton: {
      color: 'white',
      backgroundColor: 'transparent',
      w: 'full',
      py: '8',
      fontSize: '1rem',
      justifyContent: 'flex-start',
      _hover: {
        backgroundColor: 'gray.85',
      },
    },
    greenSmallButton: {
      borderRadius: '0.25rem',
      border: '1px solid',
      borderColor: 'green.100',
      padding: '0px 4px',
      h: '18px',
      bgColor: 'green.80',
      _hover: {
        color: 'white',
        bgColor: 'green.80',
      },
    },
    outlineGreen: {
      borderRadius: '0.25rem',
      border: '1px solid',
      borderColor: 'green.100',
      padding: '0px 4px',
      h: '18px',
      bgColor: 'transparent',
      _hover: {
        color: 'white',
        bgColor: 'green.75',
      },
    },
    backButton: {
      borderRadius: '0.25rem',
      border: 'none',
      padding: '4px',
      h: '24px',
      bgColor: 'transparent',
      _hover: {
        color: 'brand.purple',
        svg: {
          stroke: 'brand.purple',
        },
      },
    },
    greenButton: {
      color: 'gray.100',
      backgroundColor: 'green.100',
      fontWeight: 'medium',
      py: '5',
      px: '6',
      fontSize: 'sm',
      borderRadius: 'full',
      _focus: { boxShadow: 'none', backgroundColor: 'green.90' },
      _hover: {
        backgroundColor: 'green.90',
      },
      '&:disabled': {
        backgroundColor: 'green.100',
        _hover: {
          backgroundColor: 'green.100',
        },
      },
    },
  },
  defaultProps: {},
}

export default Button
