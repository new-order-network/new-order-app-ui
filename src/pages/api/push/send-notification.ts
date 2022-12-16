import { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'
import * as PushAPI from '@pushprotocol/restapi'

import { env } from 'lib/environment'

import { API_METHOD } from 'models/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // API endpoint to send notifications to users
  const method = req.method

  switch (method) {
    case API_METHOD.POST:
      // Checks if an entity is allowed to call this API
      if (req.query.SECRET_API_KEY !== env.SECRET_API_KEY) {
        return res
          .status(401)
          .send({ message: 'You are not authorized to call this API.' })
      }

      const { addresses, title, body, cta, img } = req.body.data

      if (!addresses || addresses.length === 0) {
        return res
          .status(406)
          .send({ message: 'Data provided does not meet requirements' })
      }

      const privateKey = `0x${env.PUSH_CHANNEL_PRIVATE_KEY}`
      const signer = new ethers.Wallet(privateKey)
      const notificationRecipients = addresses.map((address: string) => {
        return `eip155:5:${address}`
      })

      const pushApiRes = await PushAPI.payloads.sendNotification({
        signer,
        type: 4, // subset
        identityType: 2, // direct payload
        notification: {
          title,
          body,
        },
        payload: {
          title,
          body,
          cta,
          img,
        },
        recipients: notificationRecipients, // recipients addresses
        channel: `eip155:5:${env.NEXT_PUBLIC_PUSH_CHANNEL_ADDRESS}`, // your channel address
        env: env.NEXT_PUBLIC_PUSH_ENV,
      })

      if (pushApiRes.status === 204) {
        return res
          .status(201)
          .json({ message: 'Push Notification Created & Sent' })
      }
    default:
      return res.status(405).json({ message: 'Method Not Allowed' })
  }
}
