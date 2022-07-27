import { Flex, Text } from '@chakra-ui/react'

interface StatusAmountProps {
  label: string
  data: string
}

const StatusAmount: React.FC<StatusAmountProps> = ({ label, data }) => {
  return (
    <Flex flexWrap="wrap" gap="2" alignItems="center">
      <Text color="gray.50" fontSize="xs">
        {label}
      </Text>
      <Text color="white" fontSize="xs">
        {data}
      </Text>
    </Flex>
  )
}
export default StatusAmount
