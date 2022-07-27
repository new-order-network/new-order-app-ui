import { Box, BoxProps, useStyleConfig } from '@chakra-ui/react'

interface CardHeaderProps extends BoxProps {
  header?: string | React.ReactNode
  children: JSX.Element
  variant?: 'simple'
}

const Card: React.FC<CardHeaderProps> = (props) => {
  const { header, variant, children, ...rest } = props

  const styles = useStyleConfig('Card', { variant })
  return (
    <Box __css={styles} {...rest}>
      {header && (
        <Box borderTopRadius="xl" backgroundColor="gray.85" p="3">
          {header}
        </Box>
      )}
      <Box>{children}</Box>
    </Box>
  )
}

export default Card
