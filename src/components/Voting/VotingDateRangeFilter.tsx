import { Box } from '@chakra-ui/react'

import DateRangePicker from 'components/Forms/DateRangePicker'

import { VotingFiltersProps } from 'models/voting'

interface VotingDateRangeFilterProps {
  filters: VotingFiltersProps
  setFilters: ({
    startDateFilter,
    endDateFilter,
    searchKeyFilter,
  }: VotingFiltersProps) => void
}
const VotingDateRangeFilter: React.FC<VotingDateRangeFilterProps> = ({
  filters,
  setFilters,
}) => {
  const onDateChange = (start: Date, end: Date) => {
    if (start && end) {
      setFilters({ ...filters, startDateFilter: start, endDateFilter: end })
    } else {
      setFilters({ ...filters, startDateFilter: null, endDateFilter: null })
    }
  }

  return (
    <Box w="auto" my={['2', '2', '2', 0]}>
      <DateRangePicker onDateChange={onDateChange} placeholder="Vote Launch:" />
    </Box>
  )
}

export default VotingDateRangeFilter
