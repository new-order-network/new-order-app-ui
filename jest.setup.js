import { jest } from '@jest/globals'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import SeedRandom from 'seedrandom'

jest.mock('next/image', () => {
  return {
    __esModule: true,
    default: () => {
      return 'Next image stub'
    },
  }
})

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        route: '/',
        pathname: '',
        query: {},
        asPath: '',
      }
    },
  }
})

jest.spyOn(global.Math, 'random').mockImplementation(SeedRandom('1'))
