import { Flex, SimpleGrid, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { usePagination } from '@ajna/pagination'
import dayjs from 'dayjs'

import VotingCard from 'components/Voting/VotingCard'
import VotingLoader from 'components/Loaders/VotingLoader'
import VotingSearchFilter from 'components/Voting/VotingSearchFilter'
import VotingStatusFilter from 'components/Voting/VotingStatusFilter'
import VotingDateRangeFilter from 'components/Voting/VotingDateRangeFilter'
import Pagination from 'components/Pagination'
import VotingPower from 'components/Voting/VotingPower'

import {
  snapshotProposalCountQuery,
  snapshotProposalQuery,
} from 'api/snapshotApi'

import {
  VotingStatus,
  VotingChoices,
  VotingFiltersProps,
  VotingProposalProps,
  VotingStatusOrOutcome,
  VotingStatusChoices,
} from 'models/voting'

import { VotingProvider } from 'store/contexts/votingContext'

import Layout from 'layout'

const Voting = () => {
  const pageSize = 50
  const proposalCountData = useQuery(snapshotProposalCountQuery)
  const [totalVotingProposals, setTotalVotingProposals] = useState(0)
  const { pages, pagesCount, currentPage, isDisabled, setCurrentPage } =
    usePagination({
      total: totalVotingProposals,
      limits: {
        outer: 2,
        inner: 1,
      },
      initialState: {
        pageSize: pageSize,
        currentPage: 1,
      },
    })
  const skip = (currentPage - 1) * pageSize
  const { data, loading } = useQuery(snapshotProposalQuery, {
    variables: { first: pageSize, skip: skip },
  })

  const [votingProposals, setVotingProposals] = useState(data?.proposals)

  const [status, setStatus] = useState<VotingStatusChoices>(
    VotingStatusOrOutcome.ALL
  )
  const [filters, setFilters] = useState<VotingFiltersProps>({
    startDateFilter: null,
    endDateFilter: null,
    searchKeyFilter: '',
  })

  useEffect(() => {
    if (data) {
      setVotingProposals(data?.proposals)
    }
    if (proposalCountData?.data) {
      setTotalVotingProposals(proposalCountData?.data?.space?.proposalsCount)
    }
  }, [data, proposalCountData])

  const onFilterChange = (
    start: Date | null,
    end: Date | null,
    searchKeyword?: string
  ) => {
    let filteredVotingProposals = data?.proposals
    if (searchKeyword && searchKeyword?.length > 0) {
      filteredVotingProposals = filteredVotingProposals?.filter(
        (proposal: VotingProposalProps) => {
          return proposal.title
            .toLowerCase()
            .includes(searchKeyword?.toLowerCase())
        }
      )
    }

    if (start && end) {
      filteredVotingProposals = filteredVotingProposals?.filter(
        (proposal: VotingProposalProps) => {
          const startDate = dayjs.unix(proposal.start).startOf('day').toDate()
          const endDate = dayjs.unix(proposal.end).startOf('day').toDate()
          return (
            startDate.getTime() >= start.getTime() &&
            endDate.getTime() <= end.getTime()
          )
        }
      )
    }
    setVotingProposals(filteredVotingProposals)
  }

  useEffect(() => {
    if (filters) {
      onFilterChange(
        filters?.startDateFilter,
        filters?.endDateFilter,
        filters?.searchKeyFilter
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  useEffect(() => {
    // reset filters on change of current page
    setFilters({
      searchKeyFilter: '',
      startDateFilter: null,
      endDateFilter: null,
    })
  }, [currentPage])

  return (
    <VotingProvider>
      <Layout>
        <Flex
          flexDirection="column"
          flexWrap="wrap"
          gap="4"
          p={['28px 24px', '28px 40px', '28px 40px']}
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap="2"
            mb="4"
          >
            <Text fontSize="1.5rem" fontWeight="extrabold">
              Voting
            </Text>
            <Flex flexWrap="wrap" gap="3" alignItems="center">
              <VotingPower />
            </Flex>
          </Flex>
          <VotingSearchFilter filters={filters} setFilters={setFilters} />
          <Flex
            alignItems="center"
            justifyContent={['center', 'space-between']}
            flexWrap="wrap"
            gap="2"
          >
            <Flex alignItems="center" flexWrap="wrap" gap="2">
              <VotingStatusFilter
                votingProposals={votingProposals}
                status={status}
                setStatus={setStatus}
              />
              <VotingDateRangeFilter
                filters={filters}
                setFilters={setFilters}
              />
            </Flex>
            <Pagination
              pages={pages}
              pagesCount={pagesCount}
              isDisabled={isDisabled}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </Flex>
          {loading ? (
            <VotingLoader />
          ) : (
            <SimpleGrid
              mr={[0, 0, 0, 0, '16']}
              mt="3"
              minChildWidth={['200px', '300px']}
              spacing="5"
            >
              {votingProposals?.length > 0
                ? votingProposals
                    ?.filter((proposal: VotingProposalProps) => {
                      if (status === VotingStatusOrOutcome.ALL) {
                        return proposal
                      } else if (
                        status === VotingStatusOrOutcome.ACTIVE ||
                        status === VotingStatusOrOutcome.CLOSED
                      ) {
                        return proposal.state === status
                      } else {
                        const highestVotedIndex = proposal.scores.indexOf(
                          Math.max(...proposal.scores)
                        )
                        if (status === VotingStatusOrOutcome.PASSED) {
                          return (
                            proposal.state === VotingStatus.CLOSED &&
                            proposal.choices[highestVotedIndex] ===
                              VotingChoices.FOR
                          )
                        } else if (status === VotingStatusOrOutcome.FAILED) {
                          return (
                            proposal.state === VotingStatus.CLOSED &&
                            proposal.choices[highestVotedIndex] ===
                              VotingChoices.AGAINST
                          )
                        }
                        return (
                          proposal.state === VotingStatus.CLOSED &&
                          proposal.choices[highestVotedIndex] ===
                            VotingChoices.ABSTAIN
                        )
                      }
                    })
                    .map((proposal: VotingProposalProps) => {
                      return (
                        <VotingCard key={proposal.id} proposal={proposal} />
                      )
                    })
                : 'No data found.'}
            </SimpleGrid>
          )}
        </Flex>
      </Layout>
    </VotingProvider>
  )
}

export default Voting
