import { TableHeadProps, Thead as ChakraThead } from '@chakra-ui/react'
import { cloneElement, isValidElement } from 'react'

export const Thead = (props: TableHeadProps) => {
  const { children, ...rest } = props

  return (
    <ChakraThead {...rest}>
      {isValidElement(children) && cloneElement(children, { inHeader: true })}
    </ChakraThead>
  )
}
