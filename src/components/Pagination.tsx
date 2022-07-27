import {
  Pagination as ChakraPagination,
  PaginationPage,
  PaginationNext,
  PaginationPrevious,
  PaginationPageGroup,
  PaginationContainer,
  PaginationSeparator,
} from '@ajna/pagination'
import { Box } from '@chakra-ui/react'
import React from 'react'
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi'

interface PaginationProps {
  pages: number[]
  pagesCount: number
  isDisabled: boolean
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

const Pagination: React.FC<PaginationProps> = ({
  pages,
  pagesCount,
  isDisabled,
  currentPage,
  setCurrentPage,
}) => {
  const handlePageChange = (nextPage: number): void => {
    setCurrentPage(nextPage)
  }

  return (
    <Box
      as={ChakraPagination}
      pagesCount={pagesCount}
      currentPage={currentPage}
      isDisabled={isDisabled}
      onPageChange={handlePageChange}
    >
      <PaginationContainer
        align="center"
        justify="space-between"
        gap={['2', '2', '4']}
        p={['0', '0', '1']}
        py="2"
      >
        <PaginationPrevious variant="outline" p="0">
          <FiChevronLeft />
        </PaginationPrevious>

        <PaginationPageGroup
          isInline
          align="center"
          separator={<PaginationSeparator variant="link" color="green.100" />}
          gap={['0', '0', '1']}
        >
          {pages.map((page: number) => {
            return (
              <PaginationPage
                key={page}
                w={['4', '4', '5']}
                page={page}
                variant="link"
                color="green.100"
                fontSize="md"
                _current={{
                  color: 'white',
                }}
              />
            )
          })}
        </PaginationPageGroup>

        <PaginationNext variant="outline" p="0">
          <FiChevronRight />
        </PaginationNext>
      </PaginationContainer>
    </Box>
  )
}

export default Pagination
