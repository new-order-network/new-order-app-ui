import { alertAnatomy as parts } from '@chakra-ui/anatomy'

const Radio = {
  parts: parts.keys,
  baseStyle: {
    container: {
      position: 'absolute',
      top: '100px',
      right: '20px',
      w: ['full', '400px'],
      p: '4',
      boxShadow: 'md',
      borderRadius: 'md',
    },
    description: {
      fontSize: 'sm',
    },
  },
  sizes: {},
  variants: {
    success: {
      container: {
        bgGradient: 'linear(to-br, green.60, gray.100, gray.100)',
      },
      icon: {
        color: 'green.40',
      },
    },
    error: {
      container: {
        bgGradient: 'linear(to-br, red.90, gray.100, gray.100)',
      },
      icon: {
        color: 'brand.red',
      },
    },
    warning: {
      container: {
        bgGradient: 'linear(to-br, yellow.90, gray.100, gray.100)',
      },
      icon: {
        color: 'yellow.100',
      },
    },
    info: {
      container: {
        bgGradient: 'linear(to-br, blue.100, gray.100, gray.100)',
      },
      icon: {
        color: 'brand.blue',
      },
    },
  },
  defaultProps: {
    defaultVariant: 'info',
  },
}

export default Radio
