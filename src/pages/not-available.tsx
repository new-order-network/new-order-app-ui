import { Box, Text } from '@chakra-ui/react'
import Head from 'next/head'

const NotAvailable = () => {
  return (
    <>
      <Head>New Order | Not Available</Head>

      <Box as="main" bgColor="black" minH="100vh" overflowX="hidden">
        <Text>Application not available in your jurisdiction</Text>
      </Box>
    </>
  )
}

export default NotAvailable
