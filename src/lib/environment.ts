import { cleanEnv, str, url } from 'envalid'

export const env = cleanEnv(
  {
    NODE_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
    NEXT_PUBLIC_ALCHEMY_ID: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    NEXT_PUBLIC_ETHERSCAN_API_KEY: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
    NEXT_PUBLIC_SNOWTRACE_API_KEY: process.env.NEXT_PUBLIC_SNOWTRACE_API_KEY,
    NEXT_PUBLIC_INFURA_ID: process.env.NEXT_PUBLIC_INFURA_ID,
    NEXT_PUBLIC_POCKET_APPLICATION_ID:
      process.env.NEXT_PUBLIC_POCKET_APPLICATION_ID,
    NEXT_PUBLIC_CONTENTFUL_SPACE_ID:
      process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    NEXT_PUBLIC_CONTENTFUL_API_KEY: process.env.NEXT_PUBLIC_CONTENTFUL_API_KEY,
    NEXT_PUBLIC_SNAPSHOT_SPACE: process.env.NEXT_PUBLIC_SNAPSHOT_SPACE,
    NEXT_PUBLIC_HUB_URL: process.env.NEXT_PUBLIC_HUB_URL,
    NEXT_PUBLIC_UPSTASH_REDIS_REST_URL:
      process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL,
    NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN:
      process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN,
    SECRET_API_KEY: process.env.SECRET_API_KEY,
    NEXT_PUBLIC_IMAGE_BASE_URL: process.env.NEXT_PUBLIC_IMAGE_BASE_URL,
  },
  {
    NODE_ENV: str({
      default: 'development',
      choices: ['development', 'test', 'staging', 'preview', 'production'],
    }),
    NEXT_PUBLIC_ALCHEMY_ID: str({ default: '' }),
    NEXT_PUBLIC_INFURA_ID: str({ default: '' }),
    NEXT_PUBLIC_POCKET_APPLICATION_ID: str({ default: '' }),
    NEXT_PUBLIC_ETHERSCAN_API_KEY: str({ default: '' }),
    NEXT_PUBLIC_SNOWTRACE_API_KEY: str({ default: '' }),
    NEXT_PUBLIC_CONTENTFUL_SPACE_ID: str({ default: '' }),
    NEXT_PUBLIC_CONTENTFUL_API_KEY: str({ default: '' }),
    NEXT_PUBLIC_SNAPSHOT_SPACE: str({ default: '' }),
    NEXT_PUBLIC_HUB_URL: url({ default: '' }),
    NEXT_PUBLIC_UPSTASH_REDIS_REST_URL: url({ default: '' }),
    NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN: str({ default: '' }),
    SECRET_API_KEY: str({ default: '' }),
    NEXT_PUBLIC_IMAGE_BASE_URL: url({ default: '' }),
  }
)
