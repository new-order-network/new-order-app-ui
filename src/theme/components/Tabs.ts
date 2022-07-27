const Tabs = {
  parts: ['tab', 'tablist'],
  baseStyle: {
    transition: '0.3s ease all',
    tab: {
      '&:focus': {
        boxShadow: 'none',
      },
    },
  },
  sizes: {},
  variants: {
    pinkTab: {
      tablist: {
        borderBottom: '2px solid',
        borderColor: 'gray.75',
      },
      tab: {
        fontSize: '1.15rem',
        _selected: {
          fontWeight: 'bold',
          color: 'white',
          borderBottom: '2px solid',
          borderColor: 'brand.pink',
          marginBottom: '-2px',
        },
      },
    },
    greenTab: {
      tablist: {},
      tab: {
        borderRadius: 'md',
        border: '1px solid',
        borderColor: 'green.100',
        padding: '3px 5px',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        mr: '2',
        _selected: {
          backgroundColor: 'green.80',
        },
      },
    },
    pinkPillTab: {
      tablist: {},
      tab: {
        borderRadius: 'md',
        border: '1px solid',
        borderColor: 'brand.pink',
        padding: '3px 5px',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        mr: '2',
        _selected: {
          backgroundColor: 'pink.90',
        },
      },
    },
    greenPillTab: {
      tablist: {
        borderRadius: 'full',
        border: '1px solid',
        borderColor: 'gray.50',
        display: 'inline-flex',
      },
      tab: {
        borderRadius: 'full',
        padding: '3px 5px',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        pr: '4',
        pl: '4',
        _selected: {
          backgroundColor: 'green.80',
          border: '2px solid',
          borderColor: 'green.100',
        },
      },
    },
  },

  defaultProps: {},
}

export default Tabs
