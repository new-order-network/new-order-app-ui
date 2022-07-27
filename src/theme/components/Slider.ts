import { sliderAnatomy as parts } from '@chakra-ui/anatomy'

const Slider = {
  parts: parts.keys,
  baseStyle: {},
  sizes: {},
  variants: {
    greenSlider: {
      filledTrack: {
        bgColor: 'brand.green',
      },
      thumb: {
        _focus: {
          boxShadow: 'var(--chakra-colors-brand-green)',
        },
      },
    },
  },
  defaultProps: {},
}

export default Slider
