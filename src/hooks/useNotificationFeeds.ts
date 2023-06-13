import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import * as PushAPI from '@pushprotocol/restapi'

import { env } from 'lib/environment'

import { EPNSNotification } from 'constants/notification'

const getUserNotificationFeeds = async (
  accountAddress: string
): Promise<EPNSNotification[]> => {
  const notifications = await PushAPI.user.getFeeds({
    user: `eip155:5:${accountAddress}`,
    limit: 1000,
    env: env.NEXT_PUBLIC_PUSH_ENV,
  })
  console.group('TESTING NOTIF')
  console.log('accountAddress', accountAddress)
  console.log('notifications', notifications)
  console.groupEnd()
  return notifications
}

export const useNotificationFeeds = (
  accountAddress: string,
  options?: UseQueryOptions<EPNSNotification[]>
) => {
  return useQuery({
    queryKey: ['user-feeds'],
    queryFn: () => {
      return getUserNotificationFeeds(accountAddress)
    },
    refetchInterval: () => {
      return 5000
    },
    ...options,
  })
}
