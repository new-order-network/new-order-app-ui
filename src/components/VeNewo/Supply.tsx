import { AspectRatio, Flex, Select, Stack, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useNetwork } from 'wagmi'

import Card from 'components/Card'
import { LineChart } from 'components/Chart'

import { getLockedNewo, getVeNewo } from 'api/venewoApi'

import { convertToChartData } from 'lib/utils/data'

import { ChartData, SupplyType } from 'models/chart'

const Supply = () => {
  const { chain } = useNetwork()
  const [supplyType, setSupplyType] = useState<SupplyType>(SupplyType.VENEWO)
  const [chartData, setChartData] = useState<ChartData[]>([])

  useEffect(() => {
    let isMounted = true
    async function loadVeNewo() {
      if (isMounted) {
        const supplies = await getVeNewo()

        if (supplies) {
          const suppliesDataJson = await supplies.json()

          setSupplyType(SupplyType.VENEWO)
          setChartData(convertToChartData(suppliesDataJson))
        }
      }
    }

    async function loadLockedNewo() {
      if (isMounted) {
        const lockedSupplies = await getLockedNewo()

        if (lockedSupplies) {
          const lockedSuppliesDataJson = await lockedSupplies.json()

          setSupplyType(SupplyType.LOCKED_NEWO)
          setChartData(convertToChartData(lockedSuppliesDataJson))
        }
      }
    }

    if (supplyType === SupplyType.LOCKED_NEWO) {
      loadLockedNewo()
    } else if (supplyType === SupplyType.VENEWO) {
      loadVeNewo()
    }

    return () => {
      isMounted = false
    }
  }, [chain, supplyType])

  return (
    <Card border="1px solid" borderColor="gray.80" p="5">
      <Stack spacing="4">
        <Flex justify="space-between" align="center">
          <Text fontSize="xl">Supply</Text>
          <Select
            maxW="40%"
            value={supplyType}
            onChange={(e) => {
              setSupplyType(e.target.value as SupplyType)
            }}
          >
            <option value={SupplyType.VENEWO}>veNEWO</option>
            <option value={SupplyType.LOCKED_NEWO}>Locked NEWO</option>
          </Select>
        </Flex>

        <AspectRatio w="100%" ratio={[6 / 5, 9 / 5, 21 / 10, 8 / 3]}>
          <LineChart data={chartData} />
        </AspectRatio>
      </Stack>
    </Card>
  )
}

export default Supply
