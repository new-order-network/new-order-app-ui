import Input from 'components/Forms/Input'

import { VotingFiltersProps } from 'models/voting'

interface VotingSearchFilterProps {
  filters: VotingFiltersProps
  setFilters: ({
    startDateFilter,
    endDateFilter,
    searchKeyFilter,
  }: VotingFiltersProps) => void
}
const VotingSearchFilter: React.FC<VotingSearchFilterProps> = ({
  filters,
  setFilters,
}) => {
  return (
    <Input
      formControlWidth={['full', 'sm']}
      formLabelBgColor="gray.100"
      formLabelColor="gray.65"
      id="search-votes"
      onChange={(e) => {
        return setFilters({ ...filters, searchKeyFilter: e.target.value })
      }}
      value={filters.searchKeyFilter}
      label={
        filters.searchKeyFilter.length > 0 ? 'Searching (by Title)' : 'Search'
      }
    />
  )
}

export default VotingSearchFilter
