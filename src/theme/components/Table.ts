import { tableAnatomy as parts } from '@chakra-ui/anatomy'

const Table = {
  parts: parts.keys,
  baseStyle: {
    th: {
      textTransform: 'capitalize',
      fontFamily: 'body',
      fontWeight: 'bold',
    },
  },
  sizes: {},
  variants: {
    grayStriped: {
      table: {
        borderTopRadius: 'lg',
      },
      th: {
        bg: 'gray.85',
        fontSize: '0.95rem',
        py: '8',
        px: '6',
        '&:first-of-type': {
          borderTopLeftRadius: 'lg',
        },
        '&:last-of-type': {
          borderTopRightRadius: 'lg',
        },
      },
      tr: {
        '&:nth-of-type(odd)': {
          bg: 'gray.90',
        },
        '&:nth-of-type(even)': {
          bg: 'gray.55',
        },
        td: {
          fontWeight: 'bold',
          fontSize: '0.9rem',
          p: '6',
        },
      },
    },
  },

  defaultProps: {},
}

export default Table
