import { Children, cloneElement, isValidElement, ReactElement } from 'react'
import { TableRowProps, Tr as ChakraTr } from '@chakra-ui/react'

import { Consumer } from 'store/contexts/tableContext'

interface ITrInnerProps extends TableRowProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers?: Record<number, any>
  inHeader?: boolean
}

const TrInner = (props: ITrInnerProps) => {
  const { headers, children, inHeader, ...rest } = props

  if (headers && inHeader) {
    Children.map(props.children, (child, i) => {
      if (child) {
        headers[i] = (child as ReactElement).props.children
      }
    })
  }

  const childProps = (idx: number) => {
    return inHeader ? { key: idx } : { key: idx, columnKey: idx }
  }

  return (
    <ChakraTr {...rest}>
      {children &&
        Children.map(children, (child, idx) => {
          return isValidElement(child) && cloneElement(child, childProps(idx))
        })}
    </ChakraTr>
  )
}

export type ITrProps = Omit<ITrInnerProps, 'headers'>

export const Tr = (props: ITrProps) => {
  return (
    <Consumer>
      {(headers) => {
        return <TrInner {...props} headers={headers} />
      }}
    </Consumer>
  )
}
