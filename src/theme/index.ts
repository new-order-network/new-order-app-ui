import { extendTheme } from '@chakra-ui/react'

import Alert from 'theme/components/Alert'
import Button from 'theme/components/Button'
import Tabs from 'theme/components/Tabs'
import Link from 'theme/components/Link'
import Card from 'theme/components/Card'
import Form from 'theme/components/Form'
import Radio from 'theme/components/Radio'
import Table from 'theme/components/Table'
import Slider from 'theme/components/Slider'
import Tooltip from 'theme/components/Tooltip'
import Modal from 'theme/components/Modal'

const theme = extendTheme({
  fonts: {
    heading: 'vectrex',
    body: 'america',
  },
  config: {
    // Initially use dark mode
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  shadows: {
    dark: '0.3125rem 0.3125rem 1.25rem rgb(0 0 0 / 20%), -0.3125rem -0.3125rem 1.25rem rgb(0 0 0 / 20%)',
  },
  colors: {
    brand: {
      blue: '#00A3FF',
      purple: '#9E00FF',
      red: '#F10939',
      orange: '#FC9700',
      pink: '#e85ef6',
      green: '#36ff7a',
    },
    blue: {
      '10': '#D5F0FF',
      '20': '#AAE0FF',
      '30': '#80D1FF',
      '40': '#55C2FF',
      '50': '#2BB2FF',
      '60': '#00A3FF',
      '70': '#0082CC',
      '80': '#006299',
      '90': '#004166',
      '100': '#002133',
    },
    purple: {
      '10': '#EFD5FF',
      '20': '#DFAAFF',
      '30': '#CF80FF',
      '40': '#BE55FF',
      '50': '#AE2BFF',
      '60': '#9E00FF',
      '70': '#7E00CC',
      '80': '#5F0099',
      '90': '#3F0066',
      '100': '#200033',
    },
    red: {
      '10': '#FDD6DE',
      '20': '#FAADBD',
      '30': '#F8849C',
      '40': '#F65B7B',
      '50': '#F3325A',
      '60': '#F10939',
      '70': '#C1072E',
      '80': '#910522',
      '90': '#330000',
      '100': '#30020B',
    },
    white: '#ffffff',
    gray: {
      '10': '#F4F4F4',
      '20': '#E0E0E0',
      '30': '#C6C6C6',
      '40': '#A8A8A8',
      '50': '#8D8D8D',
      '55': '#202020',
      '60': '#6F6F6F',
      '65': '#4d4d4d',
      '70': '#525252',
      '75': '#313131',
      '80': '#393939',
      '85': '#252525',
      '90': '#1C1C1C', //#262626
      '100': '#161616',
    },
    green: {
      '40': '#81FF33',
      '50': '#61ff00',
      '60': '#133300',
      '75': '#222e26',
      '80': '#2c7c47',
      '90': '#03ff58',
      '100': '#36ff7a',
    },
    yellow: {
      '90': '#332600',
      '100': '#FFCD33',
    },
    pink: {
      '10': '#FCE7FE',
      '20': '#F5BBFB',
      '30': '#EF90F9',
      '40': '#E964F6',
      '50': '#E339F4',
      '60': '#DC0EF2',
      '70': '#B00BC1',
      '80': '#840891',
      '90': '#3d2340',
      '100': '#2C0330',
    },
  },
  components: {
    Alert,
    Button,
    Tabs,
    Link,
    Card,
    Form,
    Radio,
    Table,
    Slider,
    Tooltip,
    Modal,
  },
})

export default theme
