import { radioAnatomy as parts } from '@chakra-ui/anatomy'

const Radio = {
  parts: parts.keys,
  baseStyle: {
    container: {
      transition: '0.3s ease all',
    },
    label: {
      transition: '0.3s ease all',
    },
  },
  sizes: {},
  variants: {
    greenButton: {
      container: {
        backgroundColor: 'gray.80',
        borderRadius: 'full',
        py: '2',
        textAlign: 'center',
        _hover: {
          backgroundColor: 'green.100',
        },
        _checked: {
          backgroundColor: 'green.100',
        },
      },
      control: {
        display: 'none',
      },
      label: {
        width: '100%',
        color: 'white',
        _hover: {
          color: 'black',
        },
        _checked: {
          color: 'black',
        },
      },
    },
  },
  defaultProps: {},
}

export default Radio
