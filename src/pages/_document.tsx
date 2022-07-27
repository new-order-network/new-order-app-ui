import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  const description =
    'New Order is an Ecosystem DAO that is built to operate as a launchpad for the most innovative Web3 financial products, tools and applications that contribute to the vision of creating a fully composable financial ecosystem embracing multi-chain DeFi at its core. The DAO will support early stage projects aligned with its vision of being chain-agnostic, focused on a plethora of innovative new-age asset classes including data-driven tokens, NFT’s and more. The primary goal is to create an ecosystem that is not bottlenecked by limited interoperability and allow liquidity to freely enter markets and foster growth in the biggest financial ecosystem in DeFi.'
  const url = 'https://dao.neworder.network/'
  const title = 'New Order | DAO'
  const imageSrc = 'https://new-order-dapp-v2.vercel.app/images/seo_banner.png'

  return (
    <Html>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="title" content={title} />

        {/* Primary Meta Tags */}
        <meta name="title" content={title} />
        <meta name="description" content={description} />

        {/* Open Graph / Facebook  */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageSrc} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={url} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={imageSrc} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
