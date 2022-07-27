import { Box, Button, ButtonProps, Icon, Text } from '@chakra-ui/react'
import { forwardRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { FiCalendar } from 'react-icons/fi'

interface DateRangePickerProps {
  onDateChange: (start: Date, end: Date) => void
  placeholder: string
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  placeholder,
  onDateChange,
}) => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
    onDateChange(start, end)
  }

  const CustomInput = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ value, onClick }, ref) => {
      return (
        <Button
          data-testid="dateRangePicker"
          value={value}
          ref={ref}
          onClick={onClick}
          fontSize="0.8rem"
          fontWeight="bold"
          variant="outlineGrayRounded"
          px="7"
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
          <Text fontSize={['0.6rem', '0.8rem']}>
            {value || 'mm/dd/yyyy - mm/dd/yyyy'}
          </Text>
        </Button>
      )
    }
  )

  return (
    <Box
      as={DatePicker}
      className="date-range-picker"
      selected={startDate}
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      customInput={<CustomInput />}
      placeholderText="Click to select a date"
      w="auto"
      monthsShown={2}
      dateFormat="MM/dd/yyyy"
      isClearable
    />
  )
}

export default DateRangePicker
