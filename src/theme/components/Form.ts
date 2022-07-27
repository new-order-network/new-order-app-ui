// NOTE: It is important that the Label comes after the Form Control due to css selectors
const activeLabelStyles = {
  transform: 'scale(0.85) translateY(-24px)',
}

const Form = {
  baseStyle: {},
  sizes: {},
  variants: {
    floating: {
      container: {
        _focusWithin: {
          label: {
            ...activeLabelStyles,
          },
        },
        'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label':
          {
            ...activeLabelStyles,
          },
        label: {
          top: 0,
          left: 0,
          position: 'absolute',
          pointerEvents: 'none',
          mx: 3,
          px: 1,
          my: 2,
          transformOrigin: 'left top',
        },
      },
    },
  },
  defaultProps: {},
}

export default Form
