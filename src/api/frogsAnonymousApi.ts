import { createClient } from 'contentful'

import { env } from 'lib/environment'

const frogsAnonymousApi = createClient({
  space: env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
  accessToken: env.NEXT_PUBLIC_CONTENTFUL_API_KEY as string,
})

export default frogsAnonymousApi
