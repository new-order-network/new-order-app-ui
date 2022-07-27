import { createContext } from 'react'

const { Provider, Consumer } = createContext<Record<number, any>>({})
export { Provider, Consumer }
