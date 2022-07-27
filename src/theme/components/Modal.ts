import { modalAnatomy as parts } from '@chakra-ui/anatomy'

const Modal = {
  parts: parts.keys,
  baseStyle: {
    dialog: {
      backgroundColor: 'gray.100',
    },
    closeButton: {
      _focus: { boxShadow: 'none' },
      _hover: { color: 'brand.red' },
    },
  },
  sizes: {},
  variants: {},
  defaultProps: {},
}

export default Modal
