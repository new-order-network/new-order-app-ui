import { TableCellProps, Td as ChakraTd } from '@chakra-ui/react'

import { Consumer } from 'store/contexts/tableContext'

interface ITdInnerProps extends TableCellProps {
  columnKey?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  narrowHeaders: Record<number, any>
}

const TdInner = (props: ITdInnerProps) => {
  const { narrowHeaders, columnKey = 0, ...rest } = props
  const classes = `${props.className || ''} pivoted`

  return (
    <ChakraTd data-testid="td" {...rest} className={classes}>
      <div data-testid="td-before" className="tdBefore">
        {narrowHeaders[columnKey]}
      </div>
      {props.children ?? <div>&nbsp;</div>}
    </ChakraTd>
  )
}

export type ITdProps = Omit<ITdInnerProps, 'narrowHeaders'>

export const Td = (props: ITdProps) => {
  return (
    <Consumer>
      {(headers) => {
        return <TdInner {...props} narrowHeaders={headers} />
      }}
    </Consumer>
  )
}
