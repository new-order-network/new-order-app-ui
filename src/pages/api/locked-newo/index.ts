import redis from 'lib/redis'

import { VeNewoChartData } from 'models/chart'
import { API_METHOD } from 'models/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  const method = req.method

  switch (method) {
    case API_METHOD.GET:
      const defaultNetwork = 'ethereum'

      // Get all Locked Newo Supplies
      const lockedNewoSupplies = await redis.hvals(
        `locked_newo_${req.query.NETWORK || defaultNetwork}`
      )

      const lockedNewoSortedSupplies = lockedNewoSupplies.sort(function (
        a: VeNewoChartData,
        b: VeNewoChartData
      ) {
        const diff = +new Date(a.date) - +new Date(b.date)
        return diff
      })

      return res.status(200).json(lockedNewoSortedSupplies)
    default:
      return res.status(405).json({ message: 'Method Not Allowed' })
  }
}
