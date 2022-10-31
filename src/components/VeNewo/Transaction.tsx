import { useEffect, useState } from 'react'
import { useNetwork } from 'wagmi'
import { Link, Stack, Text } from '@chakra-ui/react'
import axios from 'axios'
import dayjs from 'dayjs'

import Card from 'components/Card'
import { Table, Tbody, Td, Th, Thead, Tr } from 'components/Table'

import { shortAddress } from 'lib/utils/format'

import { useContractContext } from 'store/contexts/contractContext'

import { DEFAULT_NETWORK, NETWORK_API_URL } from 'constants/network'

const Transaction = () => {
  const { chain } = useNetwork()
  const { contracts } = useContractContext()
  const [transactions, setTransactions] = useState([])
  const [blockExplorer, setBlockExplorer] = useState(
    DEFAULT_NETWORK.blockExplorers?.default.url
  )

  useEffect(() => {
    let apiUrl =
      NETWORK_API_URL[DEFAULT_NETWORK.id as keyof typeof NETWORK_API_URL]

    if (chain) {
      apiUrl = NETWORK_API_URL[chain.id as keyof typeof NETWORK_API_URL]
    }

    axios
      .get(
        `${apiUrl}&module=account&action=txlist&address=${contracts.VENEWO}&startblock=1&endblock=99999999&page=1&offset=10&sort=desc`
      )
      .then((res) => {
        if (Array.isArray(res.data.result)) {
          setTransactions(res.data.result)
        }
      })
      .catch((err) => {
        console.error('[TRANSACTION ERROR]', err)
      })
  }, [chain, contracts.VENEWO])

  useEffect(() => {
    let blockExplorerUrl = DEFAULT_NETWORK.blockExplorers?.default.url
    if (chain) {
      blockExplorerUrl = chain?.blockExplorers?.default?.url
    }

    setBlockExplorer(blockExplorerUrl)
  }, [chain])

  return (
    <Stack>
      <Text fontSize="xl">Recent Transactions</Text>
      <Card border="1px solid" borderColor="gray.80" p="0" overflow="hidden">
        <Table variant="grayStriped">
          <Thead>
            <Tr>
              <Th>Transaction Hash</Th>
              <Th>Time</Th>
              <Th>From</Th>
              <Th>To</Th>
            </Tr>
          </Thead>

          <Tbody>
            {transactions &&
              transactions.length > 0 &&
              transactions.map((transaction: any) => {
                return (
                  <Tr key={transaction.hash}>
                    <Td>
                      <Link
                        href={`${blockExplorer}/tx/${transaction.hash}`}
                        variant="whiteTransition"
                        color="brand.green"
                        isExternal
                      >
                        {shortAddress(transaction.hash)}
                      </Link>
                    </Td>

                    <Td>
                      <Stack spacing="1">
                        <Text color="white">
                          {dayjs
                            .unix(transaction.timeStamp)
                            .format('MMM DD YYYY')}
                        </Text>
                        <Text color="gray.50" fontSize="sm">
                          {dayjs
                            .unix(transaction.timeStamp)
                            .format('HH:mm:ss Z')}
                        </Text>
                      </Stack>
                    </Td>

                    <Td>
                      <Text fontSize="sm">
                        {shortAddress(transaction.from)}
                      </Text>
                    </Td>

                    <Td>
                      <Text fontSize="sm">{shortAddress(transaction.to)}</Text>
                    </Td>
                  </Tr>
                )
              })}
          </Tbody>
        </Table>
      </Card>
    </Stack>
  )
}

export default Transaction
