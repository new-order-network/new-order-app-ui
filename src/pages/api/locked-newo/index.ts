import { ethers } from 'ethers'
import dayjs from 'dayjs'

import { env } from 'lib/environment'
import redis from 'lib/redis'

import { VeNewoChartData } from 'models/chart'
import { API_METHOD } from 'models/types'

import { contractAddresses } from 'constants/contractAddresses'
import { SUPPORTED_NETWORKS } from 'constants/network'

import veTokenAbi from 'contracts/abi/veToken.json'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  const method = req.method

  switch (method) {
    case API_METHOD.GET:
      // Get all Locked Newo Supplies
      const lockedNewoSupplies = await redis.hvals('combined_locked_newo')

      const lockedNewoSortedSupplies = lockedNewoSupplies.sort(function (
        a: VeNewoChartData,
        b: VeNewoChartData
      ) {
        const diff = +new Date(a.date) - +new Date(b.date)
        return diff
      })

      return res.status(200).json(lockedNewoSortedSupplies)
    case API_METHOD.POST:
      // Trigger venewo supply creation

      // Checks if an entity is allowed to call this API
      if (req.query.SECRET_API_KEY !== env.SECRET_API_KEY) {
        return res
          .status(401)
          .send({ message: 'You are not authorized to call this API.' })
      }

      const networks = SUPPORTED_NETWORKS.filter((network) => {
        return !network.testnet && network
      })

      let totalLocked = 0

      for (let index = 0; index < networks.length; index++) {
        const provider = new ethers.providers.JsonRpcProvider(
          networks[index].rpcUrls.default
        )
        const veNewoAddress = contractAddresses[networks[index].id].VENEWO
        const veNewoInstance = new ethers.Contract(
          veNewoAddress,
          veTokenAbi,
          provider
        )
        const decimals = await veNewoInstance.decimals()

        // Get the totalAssets and add to totalLocked
        const totalAssets = await veNewoInstance.totalAssets()
        const formattedTotalAssets = ethers.utils.formatUnits(
          totalAssets,
          decimals
        )
        totalLocked += Number(formattedTotalAssets)
      }

      // Set Redis Database
      const DATABASE = 'combined_locked_newo' //ETH and AVAX veNEWO Supplies DB

      // Make sure only 1 data is created for a single date
      let isUnique = false
      const now = dayjs().format('YYYY-MM-DD')

      const allData = await redis.hvals(DATABASE)
      if (allData.length > 0) {
        allData.forEach((data: VeNewoChartData) => {
          const date = dayjs(data.date).format('YYYY-MM-DD')
          if (dayjs().isSame(date, 'day')) {
            isUnique = false
            return res.status(400).json({
              message: `There is already an existing data created for this date: ${now}`,
            })
          }
          isUnique = true
        })
      } else {
        isUnique = true
      }

      if (isUnique) {
        // Save VENewo Total Supply to Upstash Redis DB
        const newID = Date.now().toString()
        await redis.hset(DATABASE, {
          [newID]: {
            id: Date.now().toString(),
            value: totalLocked.toFixed(4),
            date: new Date(),
          },
        })
        return res.status(200).json({ message: 'Locked Supply Added.' })
      }
    default:
      return res.status(405).json({ message: 'Method Not Allowed' })
  }
}
