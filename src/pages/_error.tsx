import Link from 'next/link'
import type { NextPage } from 'next'
import { Container, Heading, Box, Flex, Button } from '@chakra-ui/react'
import { getReasonPhrase } from 'http-status-codes'
import { FiArrowLeft } from 'react-icons/fi'

interface ErrorProps {
  statusCode?: number
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  const phrase = statusCode
    ? getReasonPhrase(statusCode)
    : 'An error occurred on client'

  return (
    <Box as="main" bgColor="black" minH="100vh" overflowX="hidden">
      <Box
        bgImage="url('/images/backgrounds/night-city-error.svg')"
        bgPosition={['left top', 'center top', 'center top']}
        bgRepeat="repeat-x"
        position="relative"
        minH="100vh"
      >
        <Container maxW="container.xl">
          {statusCode ? (
            <Flex
              direction="column"
              align="center"
              justify="center"
              minH="100vh"
            >
              <Heading color="green.100" fontSize={['100px', '100px', '150px']}>
                {statusCode}
              </Heading>

              <Heading
                color="green.100"
                fontSize={['lg', 'lg', 'xl']}
                textTransform="uppercase"
                textAlign="center"
              >
                {phrase ? phrase : `An error ${statusCode} occured`}
              </Heading>

              {statusCode === 404 && (
                <Link href="/" passHref>
                  <Button
                    leftIcon={<FiArrowLeft />}
                    variant="outlineGreenBox"
                    py="8"
                    px="6"
                    fontSize="lg"
                    mt="8"
                  >
                    GO BACK TO HOME PAGE
                  </Button>
                </Link>
              )}
            </Flex>
          ) : (
            <Flex
              direction="column"
              align="center"
              justify="center"
              minH="100vh"
            >
              <Heading
                color="green.100"
                fontSize="4xl"
                textTransform="uppercase"
                textAlign="center"
              >
                An error occurred on client
              </Heading>
              <Link href="/" passHref>
                <Button
                  leftIcon={<FiArrowLeft />}
                  variant="outlineGreenBox"
                  py="8"
                  px="6"
                  fontSize="lg"
                  mt="8"
                >
                  GO BACK TO HOME PAGE
                </Button>
              </Link>
            </Flex>
          )}
        </Container>
      </Box>
    </Box>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
