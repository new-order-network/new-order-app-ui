import {
  Box,
  Button,
  Circle,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useToast,
  useToken,
} from '@chakra-ui/react'
import { IoNotifications } from 'react-icons/io5'
import { useEffect, useState } from 'react'
import * as PushAPI from '@pushprotocol/restapi'
import { useSigner } from 'wagmi'
import hexToRgba from 'hex-to-rgba'

import Notification from 'components/Notifications/Notification'
import Card from 'components/Card'

import { useNotificationFeeds } from 'hooks/useNotificationFeeds'

import { env } from 'lib/environment'

import { Subscription } from 'models/pushProtocol'

import { useNewoContext } from 'store/contexts/newoContext'

import { EPNSNotification } from 'constants/notification'
import ExternalLink from 'constants/externalLink'

interface NotificationBellProps {
  isSidebar?: boolean
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  isSidebar = false,
}) => {
  const toast = useToast()
  const { data: signer } = useSigner()
  const { accountAddress } = useNewoContext()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [pushPink, pushPurple] = useToken('colors', [
    'protocols.push.pink',
    'protocols.push.purple',
  ])

  const rgbaPushPink = hexToRgba(pushPink, 0.8)
  const rgbaPushPurple = hexToRgba(pushPurple, 0.8)

  useEffect(() => {
    if (accountAddress) {
      checkSubscription()
    }
    // eslint-disable-next-line
  }, [accountAddress])

  const checkSubscription = async () => {
    const subscriptions = await PushAPI.user.getSubscriptions({
      user: `eip155:5:${accountAddress}`,
      env: env.NEXT_PUBLIC_PUSH_ENV,
    })

    const channelSubscription = subscriptions.find(
      (subscription: Subscription) => {
        return subscription.channel === env.NEXT_PUBLIC_PUSH_CHANNEL_ADDRESS
      }
    )

    if (channelSubscription) {
      setIsSubscribed(true)
    } else {
      setIsSubscribed(false)
    }
  }

  const readNotifications = () => {
    const channelData = epnsNotificationData?.filter(
      (notification: EPNSNotification) => {
        return notification?.app === env.NEXT_PUBLIC_PUSH_CHANNEL_NAME
      }
    )
    window.localStorage.setItem('has_new_notification', 'false')
    if (channelData) {
      setEpnsNotifications(channelData)
    }
  }

  const subscribeToChannel = async () => {
    if (signer) {
      setIsLoading(true)
      await PushAPI.channels.subscribe({
        // eslint-disable-next-line
        signer: signer as any,
        channelAddress: `eip155:5:${env.NEXT_PUBLIC_PUSH_CHANNEL_ADDRESS}`,
        userAddress: `eip155:5:${accountAddress}`,
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'You have subscribed to push notifications.',
            isClosable: true,
            position: 'top-right',
            status: 'success',
            variant: 'success',
          })
          setIsLoading(false)
          checkSubscription()
        },
        onError: (err) => {
          toast({
            title: 'Action Failed',
            description: 'Something went wrong! Please try again later.',
            isClosable: true,
            position: 'top-right',
            status: 'error',
            variant: 'error',
          })
          console.error('[PUSH SUBSCRIBE ERROR]', err)
          setIsLoading(false)
        },
        env: env.NEXT_PUBLIC_PUSH_ENV,
      })
    }
  }

  const unsubscribeToChannel = async () => {
    if (signer) {
      setIsLoading(true)
      await PushAPI.channels.unsubscribe({
        // eslint-disable-next-line
        signer: signer as any,
        channelAddress: `eip155:5:${env.NEXT_PUBLIC_PUSH_CHANNEL_ADDRESS}`,
        userAddress: `eip155:5:${accountAddress}`,
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'You have unsubscribed to push notifications.',
            isClosable: true,
            position: 'top-right',
            status: 'success',
            variant: 'success',
          })
          setIsLoading(false)
          checkSubscription()
        },
        onError: (err) => {
          toast({
            title: 'Action Failed',
            description: 'Something went wrong! Please try again later.',
            isClosable: true,
            position: 'top-right',
            status: 'error',
            variant: 'error',
          })
          console.error('[PUSH UNSUBSCRIBE ERROR]', err)
          setIsLoading(false)
        },
        env: env.NEXT_PUBLIC_PUSH_ENV,
      })
    }
  }

  const [notificationCount, setNotificationCount] = useState(0)
  const [epnsNotifications, setEpnsNotifications] = useState<
    EPNSNotification[]
  >([])

  const { data: epnsNotificationData, isLoading: isEPNSNotificationsLoading } =
    useNotificationFeeds(accountAddress, {
      enabled: Boolean(accountAddress),
      onSuccess: (data) => {
        if (data && data?.length > 0) {
          const channelData = data?.filter((notification: EPNSNotification) => {
            return notification?.app === env.NEXT_PUBLIC_PUSH_CHANNEL_NAME
          })
          setNotificationCount(channelData?.length)
          if (channelData?.length !== notificationCount) {
            window.localStorage.setItem('has_new_notification', 'true')
          }
        }
      },
    })

  const notificationButton = (display: string[]) => {
    if (!isSubscribed) {
      return (
        <Tooltip
          label={
            <Box>
              <Text>
                Subscribe to our push (previously EPNS) notifications. Simply
                click this button and sign the message.
              </Text>

              {!accountAddress && (
                <Text color="red.50">
                  Note: Please connect your wallet first.
                </Text>
              )}
            </Box>
          }
          placement="top-end"
        >
          <Button
            mx="4"
            display={display}
            bgGradient="linear(to-tr, protocols.push.pink, protocols.push.purple)"
            borderRadius="full"
            fontSize="0.8rem"
            fontWeight="bold"
            transition="all 0.3s ease"
            _hover={{
              bgGradient: `linear(to-tr, ${rgbaPushPink}, ${rgbaPushPurple})`,
            }}
            _focus={{
              bgGradient: `linear(to-tr, ${rgbaPushPink}, ${rgbaPushPurple})`,
            }}
            _active={{
              bgGradient: `linear(to-tr, ${rgbaPushPink}, ${rgbaPushPurple})`,
            }}
            onClick={subscribeToChannel}
            isLoading={isLoading}
            isDisabled={!accountAddress || !signer}
          >
            Subscribe to push notifications
          </Button>
        </Tooltip>
      )
    } else {
      if (isSidebar) {
        return (
          <MenuButton
            as={Button}
            mx="4"
            display={['flex', 'flex', 'none']}
            onClick={() => {
              readNotifications()
            }}
          >
            <HStack>
              <Icon color="gray.60" fontSize="xl" as={IoNotifications} />
              <Text>Notifications</Text>
            </HStack>
          </MenuButton>
        )
      } else {
        return (
          <Box pos="relative" display={['none', 'none', 'flex']}>
            {Boolean(window.localStorage.getItem('has_new_notification')) && (
              <Circle
                bg="green.100"
                size="2.5"
                pos="absolute"
                top="2"
                right="5"
                zIndex={1}
              />
            )}
            <MenuButton
              as={IconButton}
              aria-label="Notifications"
              icon={
                <Icon color="gray.60" fontSize="2xl" as={IoNotifications} />
              }
              variant="outline"
              mr="3"
              onClick={() => {
                readNotifications()
              }}
            />
          </Box>
        )
      }
    }
  }
  return (
    <>
      <Menu closeOnSelect={false} placement="bottom-end">
        {isSidebar
          ? notificationButton(['flex', 'flex', 'none'])
          : notificationButton(['none', 'none', 'flex'])}
        <MenuList
          maxW="410px"
          backgroundColor="gray.75"
          fontSize="0.8rem"
          border="none"
          p={4}
        >
          <Text fontSize="lg">Notifications</Text>
          <Text pb={4} fontSize="xs" color="gray.50">
            Notifications are fetched from{' '}
            <Text
              as="span"
              bgGradient="linear(to-tr, protocols.push.pink, protocols.push.purple)"
              bgClip="text"
            >
              <Link
                href={
                  env.NEXT_PUBLIC_PUSH_ENV === 'staging'
                    ? ExternalLink.stagingPushApp
                    : ExternalLink.pushApp
                }
                isExternal
                _hover={{
                  textDecoration: 'underline',
                }}
              >
                {env.NEXT_PUBLIC_PUSH_ENV === 'staging'
                  ? 'staging.push.org'
                  : 'app.push.org'}
              </Link>
            </Text>
            <br />
            Channel: {env.NEXT_PUBLIC_PUSH_CHANNEL_NAME}
          </Text>
          {isEPNSNotificationsLoading ? (
            <Stack spacing={2}>
              <Skeleton
                h="100px"
                startColor="gray.85"
                endColor="gray.100"
                borderRadius="xl"
              />
              <Skeleton
                h="100px"
                startColor="gray.85"
                endColor="gray.100"
                borderRadius="xl"
              />
            </Stack>
          ) : (
            <Stack
              spacing={2}
              overflow="auto"
              maxH={300}
              pr="1"
              sx={{
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'gray.70',
                  borderRadius: '24px',
                },
              }}
            >
              {epnsNotifications && epnsNotifications?.length > 0 ? (
                epnsNotifications
                  ?.filter((notification: EPNSNotification) => {
                    return (
                      notification?.app === env.NEXT_PUBLIC_PUSH_CHANNEL_NAME
                    )
                  })
                  ?.map((notification: EPNSNotification, index: number) => {
                    return <Notification key={index} {...notification} />
                  })
              ) : (
                <Card variant="simple">
                  <Flex alignItems="center" justifyContent="center">
                    <Text py={8}>No new notifications</Text>
                  </Flex>
                </Card>
              )}
            </Stack>
          )}
          <MenuItem
            bg="transparent"
            _hover={{ bg: 'none' }}
            _active={{ bg: 'none' }}
            _focus={{ bg: 'none' }}
            py={0}
          >
            <Text
              pt={4}
              cursor="pointer"
              transition="all 0.3s ease"
              _hover={{
                bgGradient:
                  'linear(to-tr, protocols.push.pink, protocols.push.purple)',
                bgClip: 'text',
              }}
              onClick={unsubscribeToChannel}
              alignItems="center"
              color="gray.50"
            >
              Unsubscribe to push notifications
              {isLoading && <Spinner size="xs" ml="2" />}
            </Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}

export default NotificationBell
