import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Icon,
  Text,
} from '@chakra-ui/react'
import { forwardRef } from 'react'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import { FiCalendar } from 'react-icons/fi'

interface CustomDatePickerProps extends ReactDatePickerProps {
  placeholder: string
}

const CustomDatePicker: React.FC<CustomDatePickerProps & BoxProps> = ({
  placeholder,
  ...props
}) => {
  const CustomInput = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ value, onClick }, ref) => {
      return (
        <Button
          data-testid="datePicker"
          value={value}
          ref={ref}
          onClick={onClick}
          fontSize="0.8rem"
          w="full"
          fontWeight="bold"
          variant="outlineGrayRounded"
          borderRadius="md"
          justifyContent="flex-start"
          px="4"
          leftIcon={
            <Icon
              mr="1"
              fontSize="20"
              fill="transparent"
              stroke="gray.80"
              as={FiCalendar}
            />
          }
        >
          <Text color="gray.60" mr="1" fontSize={['0.6rem', '0.8rem']}>
            {placeholder}
          </Text>
          <Text fontSize={['0.6rem', '0.8rem']}>{value}</Text>
        </Button>
      )
    }
  )

  return (
    <Box
      as={DatePicker}
      className="date-range-picker"
      customInput={<CustomInput />}
      placeholderText="Click to select a date"
      w="auto"
      dateFormat="MM/dd/yyyy"
      isClearable={false}
      {...props}
    />
  )
}

export default CustomDatePicker
