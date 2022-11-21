import {
  Box,
  Button,
  Text,
  Tooltip,
  useToast,
  useToken,
} from '@chakra-ui/react'
import hexToRgba from 'hex-to-rgba'
import { useSigner } from 'wagmi'
import * as PushAPI from '@pushprotocol/restapi'
import { useEffect, useState } from 'react'

import { env } from 'lib/environment'

import { Subscription } from 'models/pushProtocol'

import { useNewoContext } from 'store/contexts/newoContext'

export const PushProtocolButton = () => {
  const { data: signer } = useSigner()
  const { accountAddress } = useNewoContext()
  const toast = useToast()
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

  return (
    <Tooltip
      label={
        <Box>
          <Text>
            {isSubscribed ? 'Unsubscribe' : 'Subscribe'} to our push (previously
            EPNS) notifications. Simply click this button and sign the message.
          </Text>

          {!accountAddress && (
            <Text color="red.50">Note: Please connect your wallet first.</Text>
          )}
        </Box>
      }
      placement="top-end"
    >
      <Button
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
        onClick={isSubscribed ? unsubscribeToChannel : subscribeToChannel}
        isLoading={isLoading}
        isDisabled={!accountAddress || !signer}
      >
        {isSubscribed ? 'Unsubscribe' : 'Subscribe'} to push notifications
      </Button>
    </Tooltip>
  )
}
