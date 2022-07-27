import { Flex, Text } from '@chakra-ui/react'
import dayjs from 'dayjs'

interface FormattedDateProps {
  date: number
}
const FormattedDate: React.FC<FormattedDateProps> = ({ date }) => {
  return (
    <Flex alignItems="center" gap="2">
      <Text fontSize="x-small" color="white">
        {dayjs.unix(date).format('MM.DD.YYYY')}
      </Text>
      <Text fontSize="x-small" color="gray.50">
        {dayjs.unix(date).format('HH.mm')}
      </Text>
    </Flex>
  )
}

export default FormattedDate
